import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton, Stars } from "../components/ui";
import { APPLICATIONS, REQUESTS } from "../data/mockData";
import { fetchFromAPI } from "../api";
import { CheckCircle2, Clock, MessageCircle, FileText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function TutorApplications({ onNavigate, role = "parent" }) {
  const isTutor = role === "tutor";
  const backLink = isTutor ? "tutor-dashboard" : "parent-dashboard";
  const [apps, setApps] = useState(APPLICATIONS);
  const [hiringApp, setHiringApp] = useState(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchFromAPI("/applications")
      .then((data) => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        setApps(data.map((app) => ({
          ...app,
          subjects: Array.isArray(app.subjects) ? app.subjects : [],
          rating: Number(app.rating) || 0,
        })));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleHire = (app) => {
    setApps(apps.map(a => a.id === app.id ? { ...a, status: "offer_sent" } : a));
  };

  const generateAutoCoverLetter = (requestId) => {
    setIsGenerating(true);
    const request = REQUESTS.find(r => r.id === requestId);
    if (!request) {
      setIsGenerating(false);
      return;
    }

    // Auto-generate cover letter based on request details
    const templates = [
      `I am writing to express my interest in the ${request.subject} teaching position for ${request.classLevel}. With my expertise in ${request.subject} and proven track record of helping students achieve academic excellence, I am confident in my ability to provide quality education tailored to your specific requirements. I am available ${request.preferredDays} and can accommodate your preferred timing of ${request.preferredTime || "flexible hours"}. My teaching approach focuses on building strong fundamentals while making learning engaging and effective.`,
      
      `I would like to apply for the ${request.subject} tutor position. As an experienced educator specializing in ${request.classLevel}, I have successfully helped numerous students improve their academic performance. I understand you are looking for someone available ${request.preferredDays} in ${request.location}, and I am well-suited to meet these requirements. My teaching methodology emphasizes conceptual clarity and practical application, ensuring students not only understand the material but also develop problem-solving skills.`,
      
      `I am excited to apply for the ${request.subject} tutoring opportunity. With extensive experience teaching ${request.classLevel} students, I have developed effective strategies to help students excel in ${request.subject}. I am available during ${request.preferredDays} and can work within your budget range of ৳${request.budget}/hr. My goal is to create a supportive learning environment where students feel confident to ask questions and explore concepts deeply.`
    ];

    // Select a template based on request subject (simple hash)
    const templateIndex = (request.subject.length + request.classLevel.length) % templates.length;
    const generatedLetter = templates[templateIndex];
    
    setCoverLetter(generatedLetter);
    setIsGenerating(false);
  };

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
              {apps.map((app) => (
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
                        Subjects: {(Array.isArray(app.subjects) ? app.subjects : []).join(", ")}
                      </p>
                    </div>

                    <SecondaryButton size="sm" onClick={() => onNavigate("tutor-chat")}>
                      <MessageCircle size={14} className="mr-1.5 inline" /> Message Parent
                    </SecondaryButton>
                  </div>

                  <div className="mt-4 rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>
                        Your Cover Letter
                      </p>
                      <button
                        type="button"
                        onClick={() => generateAutoCoverLetter(app.requestId)}
                        disabled={isGenerating}
                        className="flex items-center gap-1.5 rounded-md border bg-white px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-gray-50 disabled:opacity-50"
                        style={{ borderColor: C.border, color: C.primary }}
                      >
                        <Sparkles size={14} />
                        {isGenerating ? "Generating..." : "Auto-Generate"}
                      </button>
                    </div>
                    <textarea
                      value={coverLetter || app.coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-shadow duration-150 focus:ring-2"
                      style={{ borderColor: C.border, color: C.text }}
                      placeholder="Your cover letter will appear here..."
                    />
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

  const pendingApps = apps.filter(a => a.status === "pending");

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
              {pendingApps.map((app) => {
                const request = REQUESTS.find(r => r.id === app.requestId) || {};
                return (
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
                        {(Array.isArray(app.subjects) ? app.subjects : []).join(", ") || "Subjects not listed"} · {app.experience || "Experience not listed"} experience
                      </p>
                      <div className="mt-2 flex gap-4 text-sm font-semibold" style={{ color: C.text }}>
                        <p>Expected Salary: ৳{request.budget}</p>
                        <p>Time: {request.preferredTime}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <SecondaryButton size="sm" onClick={() => onNavigate("chat")}>
                        <MessageCircle size={14} className="mr-1.5 inline" />
                        Message
                      </SecondaryButton>
                      <PrimaryButton size="sm" onClick={() => { setHiringApp(app); setOfferAmount(""); }}>Hire</PrimaryButton>
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

                  {(app.cvUrl || app.certificateUrl) && (
                    <div className="mt-4 rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                      <p className="mb-3 text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>
                        Documents & Certificates
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {app.cvUrl && (
                          <a
                            href={app.cvUrl}
                            download
                            className="flex items-center gap-1.5 rounded-md border bg-white px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-gray-50 shadow-sm"
                            style={{ borderColor: C.border, color: C.primary }}
                          >
                            <FileText size={16} /> Download CV
                          </a>
                        )}
                        {app.certificateUrl && (
                          <a
                            href={app.certificateUrl}
                            download
                            className="flex items-center gap-1.5 rounded-md border bg-white px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-gray-50 shadow-sm"
                            style={{ borderColor: C.border, color: C.primary }}
                          >
                            <FileText size={16} /> Download Certificate
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-xs" style={{ color: C.textSecondary }}>
                    <span>Applied on {app.appliedDate}</span>
                    <span>Request ID: {app.requestId}</span>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>

      {hiringApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold" style={{ color: C.text }}>Send Offer to {hiringApp.tutorName}</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter the salary you are willing to offer. The tutor will review this offer and decide whether to accept or reject it.
            </p>
            <div className="my-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: C.text }}>Offer Amount (৳/hour)</label>
              <input 
                type="number"
                placeholder="e.g. 1000"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="w-full rounded-lg border p-3 text-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                style={{ borderColor: C.border }}
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <SecondaryButton onClick={() => setHiringApp(null)}>Cancel</SecondaryButton>
              <PrimaryButton 
                onClick={() => {
                  if(!offerAmount) return alert("Please enter an offer amount.");
                  handleHire(hiringApp);
                  setHiringApp(null);
                }}
              >
                Send Offer
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
