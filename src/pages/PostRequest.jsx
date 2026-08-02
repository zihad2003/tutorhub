import { C } from "../constants/tokens";
import { Input, PrimaryButton, SecondaryButton, Badge } from "../components/ui";
import { MapPin, Calendar, DollarSign, Send, CheckCircle2 } from "lucide-react";
import { REQUESTS } from "../data/mockData";
import { useState } from "react";

export function PostRequest({ onNavigate, mode = "create" }) {
  const [appliedIds, setAppliedIds] = useState([]);

  const handleApply = (id) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds([...appliedIds, id]);
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
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Post Tuition Request</h1>
          <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
            Fill in the details to find the right tutor for your needs.
          </p>

          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input label="Subject" placeholder="e.g., Physics" />
              <Input label="Class Level" placeholder="e.g., Class 9-10, HSC" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input label="Location" placeholder="e.g., Dhanmondi, Dhaka" />
              <Input label="Budget (per hour)" placeholder="e.g., 1000" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input label="Preferred Time" placeholder="e.g., 9.00 P.M" />
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
                    className="rounded-lg border py-2 text-sm font-semibold transition-colors duration-150 hover:bg-gray-50"
                    style={{ borderColor: C.border, color: C.text }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                Description
              </label>
              <textarea
                placeholder="Describe your requirements, student's current level, and goals..."
                rows={4}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2"
                style={{ borderColor: C.border, color: C.text }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primary}33`)}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
            </div>

            <div className="flex gap-3">
              <SecondaryButton onClick={() => onNavigate("parent-dashboard")}>Cancel</SecondaryButton>
              <PrimaryButton full>Post Request</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
