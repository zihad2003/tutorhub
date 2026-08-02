import { C } from "../constants/tokens";
import { Input, PrimaryButton, SecondaryButton, Badge } from "../components/ui";
import { MapPin, Calendar, DollarSign, Send, CheckCircle2, ChevronDown, Clock, Sparkles } from "lucide-react";
import { REQUESTS } from "../data/mockData";
import { getStoredCategories } from "../data/categoriesData";
import { useState, useEffect } from "react";

export function PostRequest({ onNavigate, mode = "create" }) {
  const [appliedIds, setAppliedIds] = useState([]);
  const [categories, setCategories] = useState(() => getStoredCategories());
  
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

  useEffect(() => {
    const handleUpdate = () => setCategories(getStoredCategories());
    window.addEventListener("tutorhub_categories_updated", handleUpdate);
    return () => window.removeEventListener("tutorhub_categories_updated", handleUpdate);
  }, []);

  const handleApply = (id) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds([...appliedIds, id]);
    }
  };

  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    const found = categories.find(c => c.name === catName);
    if (found && found.subjects && found.subjects.length > 0) {
      setSubject(found.subjects[0]);
    }
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    const newReq = {
      id: Date.now(),
      subject: subject || selectedCategory,
      classLevel: classLevel || "Class 9-10",
      location: location || "Dhanmondi, Dhaka",
      budget: budget || "800",
      preferredTime: preferredTime || "Evening 7:00 PM",
      preferredDays: selectedDay,
      status: "open",
      description: description || `Looking for an experienced tutor for ${selectedCategory} (${subject || "General"}).`,
      postedDate: "Just now"
    };

    REQUESTS.unshift(newReq);
    setSubmitted(true);
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

            <div className="mt-6 space-y-6">
              {REQUESTS.map((req) => {
                const isApplied = appliedIds.includes(req.id);
                return (
                  <div
                    key={req.id}
                    className="rounded-lg border p-6 shadow-sm transition-all duration-150 hover:border-blue-200"
                    style={{ borderColor: C.border }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold" style={{ color: C.text }}>
                            {req.subject} Tutor Needed
                          </h3>
                          <Badge tone="neutral">{req.classLevel}</Badge>
                          <Badge tone={req.status === "open" ? "accent" : "neutral"}>
                            {req.status === "open" ? "Active Request" : "Closed"}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed" style={{ color: C.textSecondary }}>
                          {req.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold" style={{ color: C.textSecondary }}>
                          <span className="flex items-center gap-1"><MapPin size={14} /> {req.location}</span>
                          <span className="flex items-center gap-1"><Calendar size={14} /> Preferred: {req.preferredDays}</span>
                          {req.preferredTime && (
                            <span className="flex items-center gap-1"><Clock size={14} /> Time: {req.preferredTime}</span>
                          )}
                          <span className="flex items-center gap-1"><DollarSign size={14} /> Budget: <strong className="text-blue-600">৳{req.budget}/hr</strong></span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {isApplied ? (
                          <span className="flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                            <CheckCircle2 size={16} /> Applied
                          </span>
                        ) : (
                          <PrimaryButton size="sm" onClick={() => handleApply(req.id)}>
                            <Send size={14} className="mr-1.5 inline" /> Apply Now
                          </PrimaryButton>
                        )}
                        <span className="text-xs" style={{ color: C.textSecondary }}>
                          Posted {req.postedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
                    {categories.filter(c => c.status === "active").map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.description || "Tuition Category"})
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
                  label="Budget (per hour in ৳)" 
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
