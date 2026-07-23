import { C } from "../constants/tokens";
import { StatCard } from "../components/ui/StatCard";
import { Table } from "../components/ui/Table";
import { PrimaryButton, Badge } from "../components/ui";
import { Users, Calendar, DollarSign, FileText, ChevronRight } from "lucide-react";
import { LESSONS, TUTOR_EARNINGS, APPLICATIONS } from "../data/mockData";

export function TutorDashboard({ onNavigate }) {
  const pendingLessons = LESSONS.filter(l => l.status === "pending").length;
  const pendingEarnings = TUTOR_EARNINGS.filter(e => e.status === "pending").length;
  const pendingApplications = APPLICATIONS.filter(a => a.status === "pending").length;

  const recentLessons = LESSONS.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-white lg:block">
      <div className="flex-1 p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Dashboard</h1>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>Welcome back! Here's your overview.</p>
            </div>
            <PrimaryButton onClick={() => onNavigate("tutor-profile")}>Edit Profile</PrimaryButton>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Active Students"
              value="2"
              icon={Users}
              trend={{ value: "+1", positive: true }}
            />
            <StatCard
              label="Lessons This Month"
              value={LESSONS.length.toString()}
              icon={Calendar}
              trend={{ value: "+3", positive: true }}
            />
            <StatCard
              label="Pending Earnings"
              value={`৳${TUTOR_EARNINGS.find(e => e.status === "pending")?.totalEarnings || 0}`}
              icon={DollarSign}
            />
            <StatCard
              label="Pending Applications"
              value={pendingApplications.toString()}
              icon={FileText}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: C.text }}>Recent Lessons</h2>
                <button
                  onClick={() => onNavigate("tutor-lessons")}
                  className="text-sm font-semibold"
                  style={{ color: C.primary }}
                >
                  View all <ChevronRight size={14} className="inline" />
                </button>
              </div>
              <div className="mt-4">
                <Table
                  columns={[
                    { key: "subject", label: "Subject" },
                    { key: "topic", label: "Topic" },
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
                <h2 className="text-lg font-semibold" style={{ color: C.text }}>Earnings Summary</h2>
                <button
                  onClick={() => onNavigate("earnings")}
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
                    { key: "totalEarnings", label: "Earnings", render: (amount) => `৳${amount}` },
                    { key: "status", label: "Status", render: (status) => (
                      <Badge tone={status === "paid" ? "success" : "warning"}>{status}</Badge>
                    )},
                  ]}
                  data={TUTOR_EARNINGS.slice(0, 3)}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border p-6" style={{ borderColor: C.border }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: C.text }}>Active Requests</h2>
              <button
                onClick={() => onNavigate("requests")}
                className="text-sm font-semibold"
                style={{ color: C.primary }}
              >
                View all <ChevronRight size={14} className="inline" />
              </button>
            </div>
            <div className="mt-4">
              {APPLICATIONS.filter(a => a.status === "pending").length === 0 ? (
                <p className="py-8 text-center text-sm" style={{ color: C.textSecondary }}>
                  No pending requests
                </p>
              ) : (
                <div className="space-y-3">
                  {APPLICATIONS.filter(a => a.status === "pending").slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                      style={{ borderColor: C.border }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.text }}>
                          Request #{app.requestId}
                        </p>
                        <p className="text-xs" style={{ color: C.textSecondary }}>
                          {app.subjects.join(", ")} · Budget: ৳{parseInt(app.requestId) * 10}
                        </p>
                      </div>
                      <PrimaryButton size="sm" onClick={() => onNavigate("requests")}>View</PrimaryButton>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
