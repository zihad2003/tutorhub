import { C } from "../constants/tokens";
import { StatCard } from "../components/ui/StatCard";
import { Table } from "../components/ui/Table";
import { PrimaryButton, SecondaryButton, Badge } from "../components/ui";
import { Users, Calendar, DollarSign, ChevronRight, Plus, Send, CheckCircle2 } from "lucide-react";
import { LESSONS, TUTOR_EARNINGS, REQUESTS, HIRED_TUTORS } from "../data/mockData";
import { useState } from "react";

export function TutorDashboard({ onNavigate }) {
  const [appliedIds, setAppliedIds] = useState([]);

  const activeStudents = HIRED_TUTORS.filter(t => t.status === "active").length;
  const monthLessonsCount = LESSONS.filter(l => l.date && l.date.startsWith("2026-07")).length;
  const pendingEarnings = LESSONS.filter(l => l.status === "pending").reduce((acc, l) => acc + l.fee, 0);
  const openRequests = REQUESTS.filter(r => r.status === "open");

  const handleQuickApply = (id) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds([...appliedIds, id]);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          {/* Header Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Tutor Dashboard</h1>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>Welcome back! Here's your teaching overview.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SecondaryButton onClick={() => onNavigate("tutor-profile")}>Edit Profile</SecondaryButton>
              <PrimaryButton onClick={() => onNavigate("tutor-lessons")}>
                <Plus size={16} className="mr-1.5 inline" /> Log Lesson
              </PrimaryButton>
            </div>
          </div>

          {/* Interactive Stat Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <div onClick={() => onNavigate("hired-tutors")} className="cursor-pointer transition-transform hover:scale-[1.02]">
              <StatCard
                label="Active Students"
                value={activeStudents.toString()}
                icon={Users}
                trend={{ value: "+1", positive: true }}
              />
            </div>
            <div onClick={() => onNavigate("tutor-lessons")} className="cursor-pointer transition-transform hover:scale-[1.02]">
              <StatCard
                label="Lessons Taught This Month"
                value={monthLessonsCount.toString()}
                icon={Calendar}
                trend={{ value: "+3", positive: true }}
              />
            </div>
            <div onClick={() => onNavigate("earnings")} className="cursor-pointer transition-transform hover:scale-[1.02]">
              <StatCard
                label="Pending Earnings"
                value={`৳${pendingEarnings}`}
                icon={DollarSign}
              />
            </div>
          </div>

          {/* Earnings Summary Section */}
          <div className="mt-8 rounded-lg border p-6 shadow-sm" style={{ borderColor: C.border }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: C.text }}>Earnings Summary</h2>
                <p className="mt-0.5 text-xs" style={{ color: C.textSecondary }}>Monthly tuition payout breakdown</p>
              </div>
              <button
                onClick={() => onNavigate("earnings")}
                className="text-sm font-semibold hover:underline"
                style={{ color: C.primary }}
              >
                View all <ChevronRight size={14} className="inline" />
              </button>
            </div>
            <div className="mt-4">
              <Table
                columns={[
                  { key: "month", label: "Month" },
                  { key: "totalLessons", label: "Lessons Taught" },
                  { key: "totalEarnings", label: "Earnings", render: (amount) => `৳${amount}` },
                  { key: "status", label: "Status", render: (status) => (
                    <Badge tone={status === "paid" ? "success" : "warning"}>{status}</Badge>
                  )},
                ]}
                data={TUTOR_EARNINGS.slice(0, 3)}
              />
            </div>
          </div>

          {/* Active Open Requests Section */}
          <div className="mt-8 rounded-lg border p-6 shadow-sm" style={{ borderColor: C.border }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: C.text }}>Active Tuition Requests</h2>
                <p className="mt-0.5 text-xs" style={{ color: C.textSecondary }}>Open requests from parents looking for tutors</p>
              </div>
              <button
                onClick={() => onNavigate("requests")}
                className="text-sm font-semibold hover:underline"
                style={{ color: C.primary }}
              >
                Browse all <ChevronRight size={14} className="inline" />
              </button>
            </div>
            <div className="mt-4">
              {openRequests.length === 0 ? (
                <p className="py-8 text-center text-sm" style={{ color: C.textSecondary }}>
                  No active requests available
                </p>
              ) : (
                <div className="space-y-3">
                  {openRequests.slice(0, 3).map((req) => {
                    const isApplied = appliedIds.includes(req.id);
                    return (
                      <div
                        key={req.id}
                        className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-gray-50/60 sm:flex-row sm:items-center sm:justify-between"
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

                        <div className="flex items-center gap-2">
                          {isApplied ? (
                            <span className="flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                              <CheckCircle2 size={14} /> Applied
                            </span>
                          ) : (
                            <PrimaryButton size="sm" onClick={() => handleQuickApply(req.id)}>
                              <Send size={14} className="mr-1.5 inline" /> Quick Apply
                            </PrimaryButton>
                          )}
                          <SecondaryButton size="sm" onClick={() => onNavigate("requests")}>Details</SecondaryButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
