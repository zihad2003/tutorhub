import { C } from "../constants/tokens";
import { Input, PrimaryButton, SecondaryButton } from "../components/ui";
import { MapPin, Calendar, DollarSign } from "lucide-react";

export function PostRequest({ onNavigate }) {
  return (
    <div className="flex min-h-screen bg-white lg:block">
      <div className="flex-1 p-6 lg:ml-64">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => onNavigate("parent-dashboard")}
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
