import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton } from "../components/ui";
import { ADMIN_APPROVALS } from "../data/mockData";
import { CheckCircle2, XCircle, MapPin, Mail, Phone, Award, Calendar, ExternalLink } from "lucide-react";
import { useState } from "react";

export function ApprovalQueues({ onNavigate, initialTab = "tutors" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tutorsList, setTutorsList] = useState(ADMIN_APPROVALS.tutors);
  const [parentsList, setParentsList] = useState(ADMIN_APPROVALS.parents);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleApproveTutor = (id) => {
    setTutorsList(prev => prev.filter(t => t.id !== id));
    ADMIN_APPROVALS.tutors = ADMIN_APPROVALS.tutors.filter(t => t.id !== id);
  };

  const handleRejectTutor = (id) => {
    setTutorsList(prev => prev.filter(t => t.id !== id));
    ADMIN_APPROVALS.tutors = ADMIN_APPROVALS.tutors.filter(t => t.id !== id);
  };

  const handleApproveParent = (id) => {
    setParentsList(prev => prev.filter(p => p.id !== id));
    ADMIN_APPROVALS.parents = ADMIN_APPROVALS.parents.filter(p => p.id !== id);
  };

  const handleRejectParent = (id) => {
    setParentsList(prev => prev.filter(p => p.id !== id));
    ADMIN_APPROVALS.parents = ADMIN_APPROVALS.parents.filter(p => p.id !== id);
  };

  const pendingTutors = tutorsList.filter(t => t.status === "pending");
  const pendingParents = parentsList.filter(p => p.status === "pending");

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
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
                          <SecondaryButton onClick={() => handleRejectTutor(tutor.id)}>
                            <XCircle size={16} className="mr-1.5 inline" />
                            Reject
                          </SecondaryButton>
                          <PrimaryButton onClick={() => handleApproveTutor(tutor.id)}>
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
                          Certificates & Documents
                        </p>
                        <div className="space-y-2">
                          {tutor.certificates.map((cert) => (
                            <div key={cert} className="flex items-center gap-2 rounded-lg border p-3" style={{ borderColor: C.border, background: C.surface }}>
                              <Award size={16} color={C.accent} />
                              <span className="text-sm" style={{ color: C.text }}>{cert}</span>
                            </div>
                          ))}
                          {tutor.cvUrl && (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedDoc({ title: `${tutor.name} - CV`, url: tutor.cvUrl })}
                                className="flex-1 flex items-center gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-gray-50"
                                style={{ borderColor: C.border, background: C.surface }}
                              >
                                <span className="text-sm font-semibold" style={{ color: C.primary }}>View CV</span>
                              </button>
                              <a
                                href={tutor.cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-gray-50"
                                style={{ borderColor: C.border, background: C.surface }}
                                title="Open in new tab"
                              >
                                <ExternalLink size={18} style={{ color: C.primary }} />
                              </a>
                            </div>
                          )}
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
                        <div className="flex-1 w-full min-w-0">
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
                          {parent.studentIdUrl && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 w-full max-w-[680px] shadow-sm">
                              <iframe 
                                src={parent.studentIdUrl} 
                                className="w-full h-[310px] border-0 bg-white block" 
                                title={`${parent.name} Student ID`} 
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <SecondaryButton onClick={() => handleRejectParent(parent.id)}>
                            <XCircle size={16} className="mr-1.5 inline" />
                            Reject
                          </SecondaryButton>
                          <PrimaryButton onClick={() => handleApproveParent(parent.id)}>
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

      {/* Document Modal Preview */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex h-[88vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: C.border }}>
              <h3 className="text-lg font-semibold" style={{ color: C.text }}>
                {selectedDoc.title}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <XCircle size={22} />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 p-2">
              <iframe
                src={selectedDoc.url}
                className="h-full w-full rounded-lg border-0 shadow-inner"
                title={selectedDoc.title}
              />
            </div>
            <div className="flex justify-end border-t px-6 py-3" style={{ borderColor: C.border }}>
              <SecondaryButton onClick={() => setSelectedDoc(null)}>Close</SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
