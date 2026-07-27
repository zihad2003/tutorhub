import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton, Stars } from "../components/ui";
import { APPLICATIONS } from "../data/mockData";
import { CheckCircle2, Clock, MessageCircle, FileText } from "lucide-react";

export function TutorApplications({ onNavigate, role = "parent" }) {
  const isTutor = role === "tutor";
  const backLink = isTutor ? "tutor-dashboard" : "parent-dashboard";

  if (isTutor) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-4 sm:p-6 lg:ml-64">
          <div className="mx-auto max-w-[1200px]">
            <button
              onClick={() => onNavigate(backLink)}
              className="mb-6 text-sm font-semibold"
              style={{ color: C.primary }}
            >
              &larr; Back to dashboard
            </button>

            <h1 className="text-2xl font-semibold" style={{ color: C.text }}>My Submitted Applications</h1>
            <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
              Track the status of job applications you've submitted to parents.
            </p>

            <div className="mt-8 space-y-6">
              {APPLICATIONS.map((app) => (
                <div
                  key={app.id}
                  className="rounded-lg border p-6 shadow-sm"
                  style={{ borderColor: C.border }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold" style={{ color: C.text }}>
                          Application for Request #{app.requestId}
                        </h3>
                        <Badge tone={app.status === "accepted" ? "success" : "warning"}>
                          {app.status === "accepted" ? "Accepted" : "Under Review"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                        Subjects: {app.subjects.join(", ")} · Proposed Rate: <strong className="text-blue-600">৳{app.fee}/hr</strong>
                      </p>
                    </div>

                    <SecondaryButton size="sm" onClick={() => onNavigate("tutor-chat")}>
                      <MessageCircle size={14} className="mr-1.5 inline" /> Message Parent
                    </SecondaryButton>
                  </div>

                  <div className="mt-4 rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                    <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>
                      Your Cover Letter
                    </p>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: C.text }}>
                      {app.coverLetter}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs" style={{ color: C.textSecondary }}>
                    <span>Submitted on {app.appliedDate}</span>
                    <span>Request ID: #{app.requestId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingApps = APPLICATIONS.filter(a => a.status === "pending");

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          <button
            onClick={() => onNavigate(backLink)}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Tutor Applications</h1>
          <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
            Review and hire tutors for your posted requests.
          </p>

          {pendingApps.length === 0 ? (
            <div className="mt-10 rounded-lg border p-10 text-center" style={{ borderColor: C.border }}>
              <p className="text-sm font-semibold" style={{ color: C.text }}>No pending applications</p>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                Post a tuition request to start receiving applications.
              </p>
              <PrimaryButton className="mt-4" onClick={() => onNavigate("post-request")}>
                Post Request
              </PrimaryButton>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {pendingApps.map((app) => (
                <div
                  key={app.id}
                  className="rounded-lg border p-6"
                  style={{ borderColor: C.border }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <img
                      src={app.tutorImg}
                      alt={app.tutorName}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold" style={{ color: C.text }}>
                          {app.tutorName}
                        </h3>
                        <Stars rating={app.rating} />
                      </div>
                      <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                        {app.subjects.join(", ")} · {app.experience} experience
                      </p>
                      <p className="mt-2 text-sm font-semibold" style={{ color: C.text }}>
                        ৳{app.fee}<span className="font-normal" style={{ color: C.textSecondary }}>/hour</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <SecondaryButton size="sm" onClick={() => onNavigate("chat")}>
                        <MessageCircle size={14} className="mr-1.5 inline" />
                        Message
                      </SecondaryButton>
                      <PrimaryButton size="sm">Hire</PrimaryButton>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                    <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>
                      Cover Letter
                    </p>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: C.text }}>
                      {app.coverLetter}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs" style={{ color: C.textSecondary }}>
                    <span>Applied on {app.appliedDate}</span>
                    <span>Request ID: {app.requestId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
