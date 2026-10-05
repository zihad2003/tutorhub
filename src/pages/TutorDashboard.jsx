import { C } from "../constants/tokens";
import { StatCard } from "../components/ui/StatCard";
import { Table } from "../components/ui/Table";
import { PrimaryButton, SecondaryButton, Badge } from "../components/ui";
import { Users, Calendar, DollarSign, ChevronRight, Plus, Send, CheckCircle2, X, Clock, XCircle } from "lucide-react";
import { LESSONS, TUTOR_EARNINGS, REQUESTS, HIRED_TUTORS } from "../data/mockData";
import { useState } from "react";
import { Input } from "../components/ui";
import { postToAPI } from "../api";
import { currentMonthPrefix, rowsForAccount, useLiveList } from "../lib/records";

function LockedTutorDashboard({ account, onReapply }) {
  const rejected = account.status === "rejected";
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Tutor Dashboard</h1>
            <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
              Welcome, {account.name}. This dashboard belongs to your account.
            </p>
          </div>

          <div
            className="rounded-lg border p-6"
            style={{ borderColor: rejected ? "#FECACA" : "#FDE68A", background: rejected ? "#FEF2F2" : "#FFFBEB" }}
          >
            <div className="flex items-start gap-3">
              {rejected ? <XCircle size={22} color={C.error} /> : <Clock size={22} color={C.warning} />}
              <div>
                <p className="text-lg font-semibold" style={{ color: rejected ? C.error : "#92400E" }}>
                  {rejected ? "Application rejected" : "Pending Approval"}
                </p>
                <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                  {rejected
                    ? "An admin rejected this application. You can submit it again."
                    : "An admin still needs to approve your account. You can wait here. Lessons, requests, earnings, chat, and profile tools stay locked until then."}
                </p>
                <p className="mt-3 text-sm font-semibold" style={{ color: C.text }}>{account.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Active Students" value="0" icon={Users} />
            <StatCard label="Lessons Taught This Month" value="0" icon={Calendar} />
            <StatCard label="Pending Earnings" value="৳0" icon={DollarSign} />
          </div>

          {rejected && (
            <div className="mt-6">
              <PrimaryButton onClick={onReapply}>Reapply</PrimaryButton>
            </div>
          )}
          <div className="mt-8 rounded-lg border p-8 text-center" style={{ borderColor: C.border }}>
            <p className="text-sm font-semibold" style={{ color: C.text }}>No teaching activity yet</p>
            <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
              Your students, lessons, and earnings will appear here after an admin approves this account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TutorDashboard({ onNavigate, account, onReapply }) {
  const [appliedIds, setAppliedIds] = useState([]);
  const [lessons] = useLiveList("/lessons", LESSONS);
  const [requests] = useLiveList("/requests", REQUESTS);
  const [earnings] = useLiveList("/tutor_earnings", TUTOR_EARNINGS);
  const [hired] = useLiveList("/hired_tutors", HIRED_TUTORS);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyRequestId, setApplyRequestId] = useState(null);
  const [applyFee, setApplyFee] = useState("");
  const [applyCoverLetter, setApplyCoverLetter] = useState("");
  const [applyError, setApplyError] = useState("");

  const isOwnAccount = account && !account.demo && account.role === "tutor";
  const ownerId = isOwnAccount ? account.id : null;
  const myLessons = rowsForAccount(lessons, ownerId, "tutorId");
  const myEarnings = rowsForAccount(earnings, ownerId, "tutorId");
  const myStudents = rowsForAccount(hired, ownerId, "tutorId");
  const requestRows = requests;
  const monthPrefix = currentMonthPrefix();
  const activeStudents = myStudents.filter((tutor) => tutor.status === "active").length;
  const monthLessonsCount = myLessons.filter((lesson) => lesson.date && String(lesson.date).startsWith(monthPrefix)).length;
  const pendingEarnings = myLessons
    .filter((lesson) => lesson.status === "pending")
    .reduce((total, lesson) => total + (Number(lesson.fee) || 0), 0);
  const openRequests = requestRows.filter((request) => request.status === "open");

  const handleQuickApply = (req) => {
    setApplyRequestId(req.id);
    setApplyFee(req.budget);
    setApplyCoverLetter(`I am interested in tutoring ${req.subject}. I have experience teaching ${req.classLevel} and can easily adapt to the required schedule.`);
    setApplyError("");
    setApplyModalOpen(true);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!applyFee || !applyCoverLetter.trim()) {
      setApplyError("Please fill in all required fields.");
      return;
    }
    if (account?.id && account.role === "tutor") {
      try {
        await postToAPI("/applications", {
          requestId: applyRequestId,
          tutorId: account.id,
          coverLetter: applyCoverLetter.trim(),
        });
      } catch {
        setApplyError("The application could not be saved. Please try again.");
        return;
      }
    }
    if (!appliedIds.includes(applyRequestId)) {
      setAppliedIds([...appliedIds, applyRequestId]);
    }
    setApplyModalOpen(false);
  };

  if (isOwnAccount && account.status !== "approved") return <LockedTutorDashboard account={account} onReapply={onReapply} />;

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
              />
            </div>
            <div onClick={() => onNavigate("tutor-lessons")} className="cursor-pointer transition-transform hover:scale-[1.02]">
              <StatCard
                label="Lessons Taught This Month"
                value={monthLessonsCount.toString()}
                icon={Calendar}
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
                data={myEarnings.slice(0, 3)}
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
                            <PrimaryButton size="sm" onClick={() => handleQuickApply(req)}>
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

      {/* Quick Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold" style={{ color: C.text }}>Submit Application</h3>
              <button onClick={() => setApplyModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={submitApplication} className="space-y-4">
              {applyError && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                  {applyError}
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-semibold" style={{ color: C.text }}>Proposed Hourly Rate (৳)</label>
                <Input 
                  type="number" 
                  value={applyFee} 
                  onChange={(e) => setApplyFee(e.target.value)} 
                  placeholder="e.g. 800" 
                  required 
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold" style={{ color: C.text }}>Cover Letter</label>
                <textarea
                  rows={4}
                  value={applyCoverLetter}
                  onChange={(e) => setApplyCoverLetter(e.target.value)}
                  className="w-full rounded-lg border p-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: C.border }}
                  placeholder="Briefly explain why you are a good fit for this tuition..."
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <SecondaryButton type="button" onClick={() => setApplyModalOpen(false)}>Cancel</SecondaryButton>
                <PrimaryButton type="submit">Submit Application</PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
