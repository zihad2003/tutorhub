import { C } from "../constants/tokens";
import { StatCard } from "../components/ui/StatCard";
import { Table } from "../components/ui/Table";
import { PrimaryButton, Badge } from "../components/ui";
import { Users, Calendar, DollarSign, FileText, ChevronRight, MapPin } from "lucide-react";
import { LESSONS, TUTOR_EARNINGS, APPLICATIONS, REQUESTS, HIRED_TUTORS } from "../data/mockData";

export function TutorDashboard({ onNavigate }) {
  const activeStudents = HIRED_TUTORS.filter(t => t.status === "active").length;
  const monthLessonsCount = LESSONS.filter(l => l.date && l.date.startsWith("2026-07")).length;
  const pendingEarnings = LESSONS.filter(l => l.status === "pending").reduce((acc, l) => acc + l.fee, 0);
  const pendingApplications = APPLICATIONS.filter(a => a.status === "pending").length;
  const openRequests = REQUESTS.filter(r => r.status === "open");

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
            <PrimaryButton onClick={() => onNavigate("tutor-profile")}>Edit Profile</PrimaryButton>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <StatCard
              label="Active Students"
              value={activeStudents.toString()}
              icon={Users}
              trend={{ value: "+1", positive: true }}
            />
            <StatCard
              label="Lessons This Month"
              value={monthLessonsCount.toString()}
              icon={Calendar}
              trend={{ value: "+3", positive: true }}
            />
            <StatCard
              label="Pending Earnings"
              value={`৳${pendingEarnings}`}
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
              {openRequests.length === 0 ? (
                <p className="py-8 text-center text-sm" style={{ color: C.textSecondary }}>
                  No active requests available
                </p>
              ) : (
                <div className="space-y-3">
                  {openRequests.slice(0, 3).map((req) => (
                    <div
                      key={req.id}
                      className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                      style={{ borderColor: C.border }}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold" style={{ color: C.text }}>
                            {req.subject} ({req.classLevel})
                          </p>
                          <Badge tone="neutral">Request #{req.id}</Badge>
                        </div>
                        <p className="mt-1 text-xs" style={{ color: C.textSecondary }}>
                          {req.location} · Preferred: {req.preferredDays} · Budget: <span className="font-semibold text-blue-600">৳{req.budget}/hr</span>
                        </p>
                      </div>
                      <PrimaryButton size="sm" onClick={() => onNavigate("requests")}>View Details</PrimaryButton>
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
