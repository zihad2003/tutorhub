import { C } from "../constants/tokens";
import { StatCard } from "../components/ui/StatCard";
import { Table } from "../components/ui/Table";
import { PrimaryButton, Badge } from "../components/ui";
import { Users, Calendar, DollarSign, FileText, ChevronRight, Star, Clock, XCircle } from "lucide-react";
import { LESSONS, PAYMENTS, APPLICATIONS, HIRED_TUTORS } from "../data/mockData";
import { rowsForAccount, currentMonthPrefix, useLiveList } from "../lib/records";

function LockedParentDashboard({ account }) {
  const rejected = account.status === "rejected";
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Dashboard</h1>
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
                    ? "An admin rejected this application. Requests, tutors, lessons, payments, and chat stay locked."
                    : "An admin still needs to approve your account. You can wait here. Requests, tutors, lessons, payments, and chat stay locked until then."}
                </p>
                <p className="mt-3 text-sm font-semibold" style={{ color: C.text }}>{account.email}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Active Tutors" value="0" icon={Users} />
            <StatCard label="Lessons This Month" value="0" icon={Calendar} />
            <StatCard label="Pending Lessons" value="0" icon={FileText} />
            <StatCard label="Pending Payments" value="0" icon={DollarSign} />
          </div>
          <div className="mt-8 rounded-lg border p-8 text-center" style={{ borderColor: C.border }}>
            <p className="text-sm font-semibold" style={{ color: C.text }}>No family activity yet</p>
            <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
              Your tutors, lessons, and payments will appear here after an admin approves this account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ParentDashboard({ onNavigate, account }) {
  const [lessons] = useLiveList("/lessons", LESSONS);
  const [payments] = useLiveList("/payments", PAYMENTS);
  const [applications] = useLiveList("/applications", APPLICATIONS);
  const [hired] = useLiveList("/hired_tutors", HIRED_TUTORS);

  const isOwnAccount = account && !account.demo && account.role === "parent";
  if (isOwnAccount && account.status !== "approved") return <LockedParentDashboard account={account} />;

  const ownerId = isOwnAccount ? account.id : null;
  const myTutors = rowsForAccount(hired, ownerId, "parentId");
  const myLessons = lessons;
  const myPayments = rowsForAccount(payments, ownerId, "parentId");
  const monthPrefix = currentMonthPrefix();
  const activeTutorsCount = myTutors.filter((tutor) => tutor.status === "active").length;
  const monthLessonsCount = myLessons.filter((lesson) => lesson.date && String(lesson.date).startsWith(monthPrefix)).length;
  const pendingLessons = myLessons.filter((lesson) => lesson.status === "pending").length;
  const pendingPayments = myPayments.filter((payment) => payment.status === "pending").length;
  const recentLessons = myLessons.slice(0, 5);
  const pendingApplications = applications.filter((app) => app.status === "pending");

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
              />
            <StatCard
              label="Lessons This Month"
              value={monthLessonsCount.toString()}
                icon={Calendar}
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
                {pendingApplications.length === 0 ? (
                  <p className="py-8 text-center text-sm" style={{ color: C.textSecondary }}>
                    No pending applications
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingApplications.slice(0, 3).map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                        style={{ borderColor: C.border }}
                      >
                        <div className="flex items-center gap-3">
                          <img src={app.tutorImg} alt={app.tutorName} className="h-10 w-10 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: C.text }}>{app.tutorName}</p>
                            <p className="text-xs" style={{ color: C.textSecondary }}>{(Array.isArray(app.subjects) ? app.subjects : []).join(", ")} · ৳{app.fee}/hr</p>
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
                  data={myPayments.slice(0, 3)}
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
                  {(myTutors || []).slice(0, 2).map((tutor) => {
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
