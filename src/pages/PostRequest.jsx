import { C } from "../constants/tokens";
import { Input, PrimaryButton, SecondaryButton, Badge } from "../components/ui";
import { MapPin, Calendar, DollarSign, Send, CheckCircle2, ChevronDown, Clock, Sparkles, X } from "lucide-react";
import { REQUESTS } from "../data/mockData";
import { fetchFromAPI, postToAPI } from "../api";
import { useLiveList } from "../lib/records";
import { getStoredCategories } from "../data/categoriesData";
import { useState, useEffect } from "react";

export function PostRequest({ onNavigate, mode = "create", account }) {
  const [appliedIds, setAppliedIds] = useState([]);
  const [categories, setCategories] = useState(() => getStoredCategories());
  const own = account && !account.demo && account.id;
  const [requestRows, setRequests] = useLiveList("/requests", own ? [] : REQUESTS);
  const [dbSubjects, setDbSubjects] = useState([]);
  const requests = !own
    ? requestRows.filter((row) => !row.status || row.status === "open")
    : mode === "browse"
      ? requestRows.filter((row) => row.parentId && row.status === "open")
      : requestRows.filter((row) => Number(row.parentId) === Number(account.id));
  const [saveError, setSaveError] = useState("");
  
  // Form Fields
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || "Science & Math");
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [selectedDay, setSelectedDay] = useState("Weekdays");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Apply Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyRequestId, setApplyRequestId] = useState(null);
  const [applyFee, setApplyFee] = useState("");
  const [applyCoverLetter, setApplyCoverLetter] = useState("");
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    fetchFromAPI("/subjects")
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) return;
        setDbSubjects(data);
        setSelectedCategory(data[0].name);
        setSubject(data[0].name);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleUpdate = () => setCategories(getStoredCategories());
    window.addEventListener("tutorhub_categories_updated", handleUpdate);
    return () => window.removeEventListener("tutorhub_categories_updated", handleUpdate);
  }, []);

  const openApplyModal = (req) => {
    setApplyRequestId(req.id);
    setApplyFee(req.budget);
    setApplyCoverLetter(`I would like to apply for the ${req.subject} tutor position. As an experienced educator specializing in ${req.classLevel}, I can help the student achieve their academic goals.`);
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
      } catch (error) {
        setApplyError(error.message || "The application could not be saved. Please try again.");
        return;
      }
    }
    if (!appliedIds.includes(applyRequestId)) {
      setAppliedIds([...appliedIds, applyRequestId]);
    }
    setApplyModalOpen(false);
  };

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    const found = categories.find(c => c.name === catName);
    if (found && found.subjects && found.subjects.length > 0) {
      setSubject(found.subjects[0]);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    const newReq = {
      subject: subject || selectedCategory,
      classLevel: classLevel || "Class 9-10",
      location: location || "Dhanmondi, Dhaka",
      budget: budget || "8000",
      preferredTime: preferredTime || "Evening 7:00 PM",
      preferredDays: selectedDay,
      status: "open",
      description: description || `Looking for an experienced tutor for ${selectedCategory} (${subject || "General"}).`,
      postedDate: new Date().toISOString().slice(0, 10),
    };

    setSaveError("");
    try {
      const saved = await postToAPI("/requests", {
        ...newReq,
        parentId: account?.role === "parent" ? account.id : null,
      });
      setRequests((current) => [{ ...newReq, id: saved.id }, ...current]);
      setSubmitted(true);
    } catch {
      setSaveError("The request could not be saved. Please try again.");
    }
  };

  const backLink = mode === "browse" ? "tutor-dashboard" : "parent-dashboard";

  if (mode === "browse") {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-4 sm:p-6 lg:ml-64">
          <div className="mx-auto max-w-[1200px]">
            <button
              onClick={() => onNavigate("tutor-dashboard")}
              className="mb-6 text-sm font-semibold"
              style={{ color: C.primary }}
            >
              &larr; Back to dashboard
            </button>

            <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Tuition Requests</h1>
            <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
              Browse active tuition requests posted by parents and apply for teaching jobs.
            </p>

            <div className="mt-6">
              <div className="overflow-x-auto rounded-lg border" style={{ borderColor: C.border }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50/80" style={{ borderColor: C.border }}>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Subject</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Class</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Location</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Preferred Days</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Time Slot</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Budget</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Status</th>
                      <th className="px-4 py-3 text-center font-semibold text-xs" style={{ color: C.textSecondary }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: C.textSecondary }}>
                          No open tuition requests.
                        </td>
                      </tr>
                    )}
                    {requests.map((req) => {
                      const isApplied = appliedIds.includes(req.id);
                      return (
                        <tr key={req.id} className="border-b hover:bg-gray-50/50" style={{ borderColor: C.border }}>
                          <td className="px-4 py-3 font-medium" style={{ color: C.text }}>{req.subject}</td>
                          <td className="px-4 py-3" style={{ color: C.text }}>{req.classLevel}</td>
                          <td className="px-4 py-3" style={{ color: C.text }}>{req.location}</td>
                          <td className="px-4 py-3" style={{ color: C.text }}>{req.preferredDays || "N/A"}</td>
                          <td className="px-4 py-3 font-semibold text-blue-600" style={{ color: C.text }}>{req.preferredTime || "Anytime"}</td>
                          <td className="px-4 py-3 font-bold" style={{ color: C.text }}>৳{req.budget}/mo</td>
                          <td className="px-4 py-3">
                            <Badge tone={req.status === "open" ? "accent" : "neutral"}>
                              {req.status === "open" ? "Active" : "Closed"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {req.status !== "open" ? (
                              <span className="text-xs font-semibold" style={{ color: C.textSecondary }}>Closed</span>
                            ) : isApplied ? (
                              <span className="flex items-center justify-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                <CheckCircle2 size={14} /> Applied
                              </span>
                            ) : (
                              <PrimaryButton size="sm" onClick={() => openApplyModal(req)}>
                                <Send size={14} className="mr-1 inline" /> Apply
                              </PrimaryButton>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Application Modal */}
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
                  <label className="mb-1 block text-sm font-semibold" style={{ color: C.text }}>Proposed monthly salary (৳5,000–৳10,000)</label>
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

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => onNavigate(backLink)}
            className="mb-6 text-sm font-semibold hover:underline"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Post Tuition Request</h1>
          <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
            Fill in the details below to find the right tutor for your child.
          </p>

          {saveError && (
            <p className="mt-4 text-sm font-semibold" style={{ color: C.error }}>{saveError}</p>
          )}

          {submitted ? (
            <div className="mt-8 rounded-2xl border p-8 text-center bg-blue-50/50 shadow-sm" style={{ borderColor: C.border }}>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Tuition Request Posted!</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your request for <strong>{subject || selectedCategory}</strong> has been published. Verified tutors will start applying soon!
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <SecondaryButton onClick={() => setSubmitted(false)}>Post Another Request</SecondaryButton>
                <PrimaryButton onClick={() => onNavigate("parent-dashboard")}>Go to Dashboard</PrimaryButton>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmitRequest}>
              
              {/* Category Dropdown */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                  Select Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full appearance-none rounded-lg border px-3.5 py-2.5 text-sm font-semibold outline-none transition-shadow duration-150 focus:ring-2 bg-white"
                    style={{ borderColor: C.border, color: C.text }}
                  >
                    {(dbSubjects.length ? dbSubjects.map((item) => ({ id: item.id, name: item.name, description: item.description })) : categories.filter((c) => c.status === "active")).map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}{c.description ? ` (${c.description})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input 
                  label="Subject / Topic" 
                  placeholder="e.g., Physics, Calculus" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
                <Input 
                  label="Class Level" 
                  placeholder="e.g., Class 9-10, HSC, University" 
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input 
                  label="Location" 
                  placeholder="e.g., Dhanmondi, Dhaka" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <Input 
                  label="Monthly budget (৳5,000–৳10,000)" 
                  placeholder="e.g., 1000" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input 
                  label="Preferred Time" 
                  placeholder="e.g., 7:00 PM - 8:30 PM" 
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                  Preferred Days
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {["Weekdays", "Weekends", "Evening", "Flexible"].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`rounded-lg border py-2 text-sm font-semibold transition-all ${
                        selectedDay === day 
                          ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm" 
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                  Description & Requirements
                </label>
                <textarea
                  placeholder="Describe your requirements, student's current level, and learning goals..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2"
                  style={{ borderColor: C.border, color: C.text }}
                />
              </div>

              <div className="flex gap-3">
                <SecondaryButton type="button" onClick={() => onNavigate("parent-dashboard")}>Cancel</SecondaryButton>
                <PrimaryButton full type="submit">Post Request</PrimaryButton>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
