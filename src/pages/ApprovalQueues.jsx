import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton } from "../components/ui";
import { ADMIN_APPROVALS } from "../data/mockData";
import { CheckCircle2, XCircle, MapPin, Mail, Phone, Award, Calendar } from "lucide-react";
import { useState } from "react";

export function ApprovalQueues({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("tutors");

  const pendingTutors = ADMIN_APPROVALS.tutors.filter(t => t.status === "pending");
  const pendingParents = ADMIN_APPROVALS.parents.filter(p => p.status === "pending");

  return (
    <div className="flex min-h-screen bg-white lg:block">
      <div className="flex-1 p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          <button
            onClick={() => onNavigate("admin-dashboard")}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Approval Queue</h1>
          <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
            Review and approve pending tutor and parent registrations.
          </p>

          <div className="mt-6 flex gap-2 rounded-lg border p-1" style={{ borderColor: C.border, background: C.surface }}>
            {["tutors", "parents"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-150"
                style={{
                  background: activeTab === tab ? C.bg : "transparent",
                  color: activeTab === tab ? C.text : C.textSecondary,
                  boxShadow: activeTab === tab ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                }}
              >
                {tab === "tutors" ? `Tutors (${pendingTutors.length})` : `Parents (${pendingParents.length})`}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "tutors" ? (
              pendingTutors.length === 0 ? (
                <div className="rounded-lg border p-10 text-center" style={{ borderColor: C.border }}>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>No pending tutor approvals</p>
                  <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                    All tutor registrations have been reviewed.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingTutors.map((tutor) => (
                    <div
                      key={tutor.id}
                      className="rounded-lg border p-6"
                      style={{ borderColor: C.border }}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <img
                          src={tutor.img}
                          alt={tutor.name}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold" style={{ color: C.text }}>
                              {tutor.name}
                            </h3>
                            <Badge tone="warning">Pending</Badge>
                          </div>
                          <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                            {tutor.email}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-4 text-sm" style={{ color: C.textSecondary }}>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} /> {tutor.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award size={14} /> {tutor.experience}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} /> Applied {tutor.appliedDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <SecondaryButton>
                            <XCircle size={16} className="mr-1.5 inline" />
                            Reject
                          </SecondaryButton>
                          <PrimaryButton>
                            <CheckCircle2 size={16} className="mr-1.5 inline" />
                            Approve
                          </PrimaryButton>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>
                          Subjects
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {tutor.subjects.map((subject) => (
                            <Badge key={subject} tone="neutral">{subject}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>
                          Certificates
                        </p>
                        <div className="space-y-2">
                          {tutor.certificates.map((cert) => (
                            <div key={cert} className="flex items-center gap-2 rounded-lg border p-3" style={{ borderColor: C.border, background: C.surface }}>
                              <Award size={16} color={C.accent} />
                              <span className="text-sm" style={{ color: C.text }}>{cert}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              pendingParents.length === 0 ? (
                <div className="rounded-lg border p-10 text-center" style={{ borderColor: C.border }}>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>No pending parent approvals</p>
                  <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                    All parent registrations have been reviewed.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingParents.map((parent) => (
                    <div
                      key={parent.id}
                      className="rounded-lg border p-6"
                      style={{ borderColor: C.border }}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold" style={{ color: C.text }}>
                              {parent.name}
                            </h3>
                            <Badge tone="warning">Pending</Badge>
                          </div>
                          <div className="mt-2 space-y-1 text-sm" style={{ color: C.textSecondary }}>
                            <p className="flex items-center gap-2">
                              <Mail size={14} /> {parent.email}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone size={14} /> {parent.phone}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin size={14} /> {parent.location}
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar size={14} /> Applied {parent.appliedDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <SecondaryButton>
                            <XCircle size={16} className="mr-1.5 inline" />
                            Reject
                          </SecondaryButton>
                          <PrimaryButton>
                            <CheckCircle2 size={16} className="mr-1.5 inline" />
                            Approve
                          </PrimaryButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
