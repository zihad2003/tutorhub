import { authUrl, fetchFromAPI, fileUrl, patchToAPI } from "../api";
import { C } from "../constants/tokens";
import { StatCard } from "../components/ui/StatCard";
import { Table } from "../components/ui/Table";
import { PrimaryButton, SecondaryButton, Badge } from "../components/ui";
import { Users, DollarSign, AlertCircle, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export function AdminDashboard({ onNavigate }) {
  const [pendingTutorRows, setPendingTutorRows] = useState([]);
  const [pendingParentRows, setPendingParentRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [tutorResponse, parentResponse, summaryData, paymentRows, withdrawalRows, certificateRows] = await Promise.all([
          fetch(authUrl("/api/auth/pending/tutors")),
          fetch(authUrl("/api/auth/pending/parents")),
          fetchFromAPI("/summary").catch(() => null),
          fetchFromAPI("/payments").catch(() => []),
          fetchFromAPI("/withdrawal_requests").catch(() => []),
          fetchFromAPI("/certificates").catch(() => []),
        ]);
        if (!cancelled) {
          setWithdrawals(Array.isArray(withdrawalRows) ? withdrawalRows.filter((row) => row.status === "pending") : []);
          setCertificates(Array.isArray(certificateRows) ? certificateRows.filter((row) => row.status === "pending") : []);
        }
        if (!tutorResponse.ok || !parentResponse.ok) return;
        const tutors = await tutorResponse.json();
        const parents = await parentResponse.json();
        if (cancelled) return;
        setPendingTutorRows(Array.isArray(tutors) ? tutors : []);
        setPendingParentRows(Array.isArray(parents) ? parents : []);
        if (summaryData && typeof summaryData.tutors === "number") setSummary(summaryData);
        if (Array.isArray(paymentRows)) {
          setRecentPayments(paymentRows.slice(0, 5).map((row) => ({
            ...row,
            totalAmount: Number(row.totalAmount) || 0,
          })));
        }
      } catch {
        if (!cancelled) {
          setPendingTutorRows([]);
          setPendingParentRows([]);
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const pendingTutors = summary ? summary.pendingTutors : pendingTutorRows.length;
  const pendingParents = summary ? summary.pendingParents : pendingParentRows.length;
  const totalTutors = summary ? summary.tutors : pendingTutorRows.length;
  const totalParents = summary ? summary.parents : pendingParentRows.length;
  const totalPayments = summary ? summary.paidRevenue : 0;

  const reviewCertificate = async (id, status) => {
    try {
      const saved = await patchToAPI(`/certificates/${id}`, { status });
      setCertificates((rows) => rows.filter((row) => row.id !== saved.id));
    } catch {
      setCertificates((rows) => rows);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Admin Dashboard</h1>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>Platform overview and management.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <div onClick={() => onNavigate("admin-users")} className="cursor-pointer transition-transform hover:scale-[1.02]">
              <StatCard
                label="Total Tutors"
                value={totalTutors.toString()}
                icon={Users}
              />
            </div>
            <div onClick={() => onNavigate("admin-users")} className="cursor-pointer transition-transform hover:scale-[1.02]">
              <StatCard
                label="Total Parents"
                value={totalParents.toString()}
                icon={Users}
              />
            </div>
            <div onClick={() => onNavigate("admin-tutor-approvals")} className="cursor-pointer transition-transform hover:scale-[1.02]">
              <StatCard
                label="Pending Approvals"
                value={(pendingTutors + pendingParents).toString()}
                icon={AlertCircle}
              />
            </div>
            <div onClick={() => onNavigate("admin-payments")} className="cursor-pointer transition-transform hover:scale-[1.02]">
              <StatCard
                label="Total Revenue"
                value={`৳${totalPayments}`}
                icon={DollarSign}
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: C.text }}>Pending Tutor Approvals</h2>
                <button
                  onClick={() => onNavigate("admin-tutor-approvals")}
                  className="text-sm font-semibold"
                  style={{ color: C.primary }}
                >
                  View all <ChevronRight size={14} className="inline" />
                </button>
              </div>
              <div className="mt-4">
                {pendingTutorRows.length === 0 ? (
                  <p className="py-8 text-center text-sm" style={{ color: C.textSecondary }}>
                    No pending tutor approvals
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingTutorRows.slice(0, 3).map((tutor) => (
                      <div
                        key={tutor.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                        style={{ borderColor: C.border }}
                      >
                        <div className="flex items-center gap-3">
                          {tutor.img ? (
                            <img src={tutor.img} alt={tutor.name} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                              {(tutor.name || "?").slice(0, 1)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold" style={{ color: C.text }}>{tutor.name}</p>
                            <p className="text-xs" style={{ color: C.textSecondary }}>{tutor.email}</p>
                          </div>
                        </div>
                        <PrimaryButton size="sm" onClick={() => onNavigate("admin-tutor-approvals")}>Review</PrimaryButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: C.text }}>Pending Parent Approvals</h2>
                <button
                  onClick={() => onNavigate("admin-parent-approvals")}
                  className="text-sm font-semibold"
                  style={{ color: C.primary }}
                >
                  View all <ChevronRight size={14} className="inline" />
                </button>
              </div>
              <div className="mt-4">
                {pendingParentRows.length === 0 ? (
                  <p className="py-8 text-center text-sm" style={{ color: C.textSecondary }}>
                    No pending parent approvals
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingParentRows.slice(0, 3).map((parent) => (
                      <div
                        key={parent.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                        style={{ borderColor: C.border }}
                      >
                        <div>
                          <p className="text-sm font-semibold" style={{ color: C.text }}>{parent.name}</p>
                          <p className="text-xs" style={{ color: C.textSecondary }}>{parent.email} · {parent.location}</p>
                        </div>
                        <PrimaryButton size="sm" onClick={() => onNavigate("admin-parent-approvals")}>Review</PrimaryButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border p-6" style={{ borderColor: C.border }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: C.text }}>Withdrawal Requests</h2>
              <button
                onClick={() => onNavigate("admin-payments")}
                className="text-sm font-semibold"
                style={{ color: C.primary }}
              >
                View all <ChevronRight size={14} className="inline" />
              </button>
            </div>
            <div className="mt-4">
              {withdrawals.length === 0 ? (
                <p className="py-8 text-center text-sm" style={{ color: C.textSecondary }}>
                  No withdrawal requests
                </p>
              ) : (
                <div className="space-y-3">
                  {withdrawals.slice(0, 5).map((row) => (
                    <div key={row.id} className="flex items-center justify-between rounded-lg border p-3" style={{ borderColor: C.border }}>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.text }}>{row.tutorName}</p>
                        <p className="text-xs" style={{ color: C.textSecondary }}>{row.method} · {row.accountNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold" style={{ color: C.text }}>৳{Number(row.amount || 0).toLocaleString("en-US")}</p>
                        <Badge tone="warning">Pending</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-lg border p-6" style={{ borderColor: C.border }}>
            <h2 className="text-lg font-semibold" style={{ color: C.text }}>Certificate reviews</h2>
            <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>Documents tutors submitted for review.</p>
            {certificates.length === 0 ? (
              <p className="mt-4 text-sm" style={{ color: C.textSecondary }}>No certificates waiting for review.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: C.border }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: C.text }}>{cert.title}</p>
                      <p className="mt-1 text-xs" style={{ color: C.textSecondary }}>{cert.tutorName} · {cert.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={fileUrl(cert.url)} target="_blank" rel="noopener noreferrer" className="rounded-lg border px-3 py-2 text-sm font-semibold" style={{ borderColor: C.border, color: C.primary }}>View</a>
                      <SecondaryButton onClick={() => reviewCertificate(cert.id, "rejected")}>Reject</SecondaryButton>
                      <PrimaryButton onClick={() => reviewCertificate(cert.id, "verified")}>Verify</PrimaryButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 rounded-lg border p-6" style={{ borderColor: C.border }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: C.text }}>Recent Payments</h2>
              <button
                onClick={() => onNavigate("admin-payments")}
                className="text-sm font-semibold"
                style={{ color: C.primary }}
              >
                View all <ChevronRight size={14} className="inline" />
              </button>
            </div>
            <div className="mt-4">
              <Table
                columns={[
                  { key: "parentName", label: "Parent" },
                  { key: "tutorName", label: "Tutor" },
                  { key: "month", label: "Month" },
                  { key: "totalAmount", label: "Amount", render: (amount) => `৳${Number(amount || 0).toLocaleString("en-US")}` },
                  { key: "status", label: "Status", render: (status) => (
                    <Badge tone={status === "paid" ? "success" : "warning"}>{status}</Badge>
                  )},
                ]}
                data={recentPayments}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
