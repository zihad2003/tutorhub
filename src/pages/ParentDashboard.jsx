import { C } from "../constants/tokens";
import { StatCard } from "../components/ui/StatCard";
import { Table } from "../components/ui/Table";
import { PrimaryButton, Badge } from "../components/ui";
import { Users, Calendar, DollarSign, FileText, ChevronRight, Star } from "lucide-react";
import { LESSONS, PAYMENTS, APPLICATIONS, HIRED_TUTORS } from "../data/mockData";

export function ParentDashboard({ onNavigate }) {
  const activeTutorsCount = HIRED_TUTORS.filter(t => t.status === "active").length;
  const monthLessonsCount = LESSONS.filter(l => l.date && l.date.startsWith("2026-07")).length;
  const pendingLessons = LESSONS.filter(l => l.status === "pending").length;
  const pendingPayments = PAYMENTS.filter(p => p.status === "pending").length;

  const recentLessons = LESSONS.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Dashboard</h1>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>Welcome back! Here's your overview.</p>
            </div>
            <PrimaryButton onClick={() => onNavigate("post-request")}>Post Request</PrimaryButton>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <StatCard
              label="Active Tutors"
              value={activeTutorsCount.toString()}
              icon={Users}
              trend={{ value: "+1", positive: true }}
            />
            <StatCard
              label="Lessons This Month"
              value={monthLessonsCount.toString()}
              icon={Calendar}
              trend={{ value: "+2", positive: true }}
            />
            <StatCard
              label="Pending Lessons"
              value={pendingLessons.toString()}
              icon={FileText}
            />
            <StatCard
              label="Pending Payments"
              value={pendingPayments.toString()}
              icon={DollarSign}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: C.text }}>Recent Lessons</h2>
                <button
                  onClick={() => onNavigate("lessons")}
                  className="text-sm font-semibold"
                  style={{ color: C.primary }}
                >
                  View all <ChevronRight size={14} className="inline" />
                </button>
              </div>
              <div className="mt-4">
                <Table
                  columns={[
                    { key: "tutorName", label: "Tutor" },
                    { key: "subject", label: "Subject" },
                    { key: "date", label: "Date" },
                    { key: "status", label: "Status", render: (status) => (
                      <Badge tone={status === "confirmed" ? "success" : "warning"}>{status}</Badge>
                    )},
                  ]}
                  data={recentLessons}
                />
              </div>
            </div>

            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: C.text }}>Pending Applications</h2>
                <button
                  onClick={() => onNavigate("applications")}
                  className="text-sm font-semibold"
                  style={{ color: C.primary }}
                >
                  View all <ChevronRight size={14} className="inline" />
                </button>
              </div>
              <div className="mt-4">
                {APPLICATIONS.filter(a => a.status === "pending").length === 0 ? (
                  <p className="py-8 text-center text-sm" style={{ color: C.textSecondary }}>
                    No pending applications
                  </p>
                ) : (
                  <div className="space-y-3">
                    {APPLICATIONS.filter(a => a.status === "pending").slice(0, 3).map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                        style={{ borderColor: C.border }}
                      >
                        <div className="flex items-center gap-3">
                          <img src={app.tutorImg} alt={app.tutorName} className="h-10 w-10 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: C.text }}>{app.tutorName}</p>
                            <p className="text-xs" style={{ color: C.textSecondary }}>{app.subjects.join(", ")} · ৳{app.fee}/hr</p>
                          </div>
                        </div>
                        <PrimaryButton size="sm" onClick={() => onNavigate("applications")}>Review</PrimaryButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: C.text }}>Payment Summary</h2>
                <button
                  onClick={() => onNavigate("payments")}
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
                  data={PAYMENTS.slice(0, 3)}
                />
              </div>
            </div>

            <div className="rounded-lg border p-6 flex flex-col justify-between" style={{ borderColor: C.border, background: C.surface }}>
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: C.text }}>
                    <Star size={18} fill={C.warning} color={C.warning} />
                    Rate Your Hired Tutors
                  </h2>
                  <button
                    onClick={() => onNavigate("reviews")}
                    className="text-sm font-semibold"
                    style={{ color: C.primary }}
                  >
                    All Reviews <ChevronRight size={14} className="inline" />
                  </button>
                </div>
                <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
                  Have you completed lessons recently? Evaluate your tutors' performance, punctuality, and teaching quality.
                </p>
                  {(HIRED_TUTORS || []).slice(0, 2).map((tutor) => {
                    if (!tutor) return null;
                    const subjectsText = Array.isArray(tutor.subjects) ? tutor.subjects.join(", ") : (tutor.subjects || "Subjects");
                    return (
                      <div key={tutor.id || Math.random()} className="flex items-center justify-between p-2.5 rounded-lg border bg-white" style={{ borderColor: C.border }}>
                        <div className="flex items-center gap-3">
                          <img src={tutor.tutorImg || "https://i.pravatar.cc/150?img=12"} alt={tutor.tutorName || "Tutor"} className="h-9 w-9 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: C.text }}>{tutor.tutorName || "Tutor"}</p>
                            <p className="text-xs" style={{ color: C.textSecondary }}>{subjectsText}</p>
                          </div>
                        </div>
                        <PrimaryButton size="sm" onClick={() => onNavigate("reviews")}>Rate Tutor</PrimaryButton>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
