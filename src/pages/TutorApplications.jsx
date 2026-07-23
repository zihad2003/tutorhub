import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton, Stars } from "../components/ui";
import { APPLICATIONS } from "../data/mockData";
import { CheckCircle2, XCircle, MessageCircle } from "lucide-react";

export function TutorApplications({ onNavigate }) {
  const pendingApps = APPLICATIONS.filter(a => a.status === "pending");

  return (
    <div className="flex min-h-screen bg-white lg:block">
      <div className="flex-1 p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          <button
            onClick={() => onNavigate("parent-dashboard")}
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
                      <SecondaryButton size="sm">
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
