import { C } from "../constants/tokens";
import { StatCard } from "../components/ui/StatCard";
import { Table } from "../components/ui/Table";
import { PrimaryButton, Badge } from "../components/ui";
import { Users, DollarSign, FileText, AlertCircle, ChevronRight } from "lucide-react";
import { ADMIN_APPROVALS, PAYMENTS, HIRED_TUTORS } from "../data/mockData";
import { TUTORS } from "../data/tutors";
import { useEffect, useState } from "react";

export function AdminDashboard({ onNavigate }) {
  const [pendingTutorRows, setPendingTutorRows] = useState([]);
  const [pendingParentRows, setPendingParentRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [tutorResponse, parentResponse] = await Promise.all([
          fetch("/api/auth/pending/tutors"),
          fetch("/api/auth/pending/parents"),
        ]);
        if (!tutorResponse.ok || !parentResponse.ok) return;
        const tutors = await tutorResponse.json();
        const parents = await parentResponse.json();
        if (cancelled) return;
        setPendingTutorRows(Array.isArray(tutors) ? tutors : []);
        setPendingParentRows(Array.isArray(parents) ? parents : []);
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

  const totalTutors = TUTORS.length + pendingTutorRows.length;
  const totalParents = HIRED_TUTORS.length + ADMIN_APPROVALS.parents.length + pendingParentRows.length + 10;
  const pendingTutors = pendingTutorRows.length;
  const pendingParents = pendingParentRows.length;
  const totalPayments = PAYMENTS.filter(p => p.status === "paid").reduce((acc, p) => acc + p.totalAmount, 0);

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
                trend={{ value: "+12", positive: true }}
              />
            </div>
            <div onClick={() => onNavigate("admin-users")} className="cursor-pointer transition-transform hover:scale-[1.02]">
              <StatCard
                label="Total Parents"
                value={totalParents.toString()}
                icon={Users}
                trend={{ value: "+28", positive: true }}
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
                trend={{ value: "+15%", positive: true }}
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
                  { key: "month", label: "Month" },
                  { key: "totalLessons", label: "Lessons" },
                  { key: "totalAmount", label: "Amount", render: (amount) => `৳${amount}` },
                  { key: "status", label: "Status", render: (status) => (
                    <Badge tone={status === "paid" ? "success" : "warning"}>{status}</Badge>
                  )},
                ]}
                data={PAYMENTS.slice(0, 5)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
