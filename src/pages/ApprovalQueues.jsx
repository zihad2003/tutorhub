import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton } from "../components/ui";
import { CheckCircle2, XCircle, MapPin, Mail, Phone, Award, Calendar, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

async function reviewAccount(role, id, action) {
  const response = await fetch(`/api/auth/${role}/${id}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-actor-role": "admin" },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not update this account.");
  return data;
}

export function ApprovalQueues({ onNavigate, initialTab = "tutors" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [tutorsList, setTutorsList] = useState([]);
  const [parentsList, setParentsList] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [tutorResponse, parentResponse] = await Promise.all([
          fetch("/api/auth/pending/tutors"),
          fetch("/api/auth/pending/parents"),
        ]);
        if (!tutorResponse.ok || !parentResponse.ok) throw new Error("Could not load the approval queue.");
        const tutors = await tutorResponse.json();
        const parents = await parentResponse.json();
        if (cancelled) return;
        setTutorsList(Array.isArray(tutors) ? tutors : []);
        setParentsList(Array.isArray(parents) ? parents : []);
        setLoadError("");
      } catch (error) {
        if (!cancelled) setLoadError(error.message || "Could not load the approval queue.");
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const runReview = async (role, id, action, setter) => {
    if (busyId) return;
    setBusyId(`${role}-${id}`);
    setActionError("");
    try {
      await reviewAccount(role, id, action);
      setter((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setActionError(error.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleApproveTutor = (id) => runReview("tutors", id, "approve", setTutorsList);
  const handleRejectTutor = (id) => runReview("tutors", id, "reject", setTutorsList);
  const handleApproveParent = (id) => runReview("parents", id, "approve", setParentsList);
  const handleRejectParent = (id) => runReview("parents", id, "reject", setParentsList);

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

          {loadError && <p className="mt-4 text-sm" style={{ color: C.error }}>{loadError}</p>}
          {actionError && <p className="mt-4 text-sm" style={{ color: C.error }}>{actionError}</p>}

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
                        {tutor.img ? (
                          <img
                            src={tutor.img}
                            alt={tutor.name}
                            className="h-20 w-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-xl font-semibold text-blue-700">
                            {(tutor.name || "?").slice(0, 1)}
                          </div>
                        )}
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
                              <MapPin size={14} /> {tutor.location || "Location not added"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award size={14} /> {tutor.experience || "New tutor"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} /> Applied {tutor.appliedDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <SecondaryButton onClick={() => handleRejectTutor(tutor.id)} disabled={busyId === `tutors-${tutor.id}`}>
                            <XCircle size={16} className="mr-1.5 inline" />
                            Reject
                          </SecondaryButton>
                          <PrimaryButton onClick={() => handleApproveTutor(tutor.id)} disabled={busyId === `tutors-${tutor.id}`}>
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
                          {(tutor.subjects || []).length === 0 ? (
                            <span className="text-sm" style={{ color: C.textSecondary }}>No subjects added yet</span>
                          ) : tutor.subjects.map((subject) => (
                            <Badge key={subject} tone="neutral">{subject}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>
                          Certificates & Documents
                        </p>
                        <div className="space-y-2">
                          {(tutor.certificates || []).map((cert, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedDoc({ title: `${tutor.name} - ${cert.name}`, url: cert.url })}
                                className="flex-1 flex items-center gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-gray-50"
                                style={{ borderColor: C.border, background: C.surface }}
                              >
                                <Award size={16} color={C.accent} />
                                <span className="text-sm font-semibold" style={{ color: C.primary }}>View {cert.name}</span>
                              </button>
                              <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-gray-50"
                                style={{ borderColor: C.border, background: C.surface }}
                                title="Open in new tab"
                              >
                                <ExternalLink size={18} style={{ color: C.primary }} />
                              </a>
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
                          <SecondaryButton onClick={() => handleRejectParent(parent.id)} disabled={busyId === `parents-${parent.id}`}>
                            <XCircle size={16} className="mr-1.5 inline" />
                            Reject
                          </SecondaryButton>
                          <PrimaryButton onClick={() => handleApproveParent(parent.id)} disabled={busyId === `parents-${parent.id}`}>
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
            <div className="flex-1 bg-gray-50 p-6 overflow-y-auto flex justify-center">
              <iframe
                src={selectedDoc.url}
                className="w-full max-w-3xl rounded-lg border shadow-md bg-white"
                style={{ height: "1050px", minHeight: "1050px" }}
                scrolling="no"
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
