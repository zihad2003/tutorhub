import { C } from "../constants/tokens";
import { Input, PrimaryButton, SecondaryButton } from "../components/ui";
import { HIRED_TUTORS } from "../data/mockData";
import { useState } from "react";

export function LessonLog({ onNavigate }) {
  const [selectedTutor, setSelectedTutor] = useState(HIRED_TUTORS[0]);

  return (
    <div className="flex min-h-screen bg-white lg:block">
      <div className="flex-1 p-6 lg:ml-64">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => onNavigate("lessons")}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to lessons
          </button>

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Log Lesson</h1>
          <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
            Record lesson details for tracking and payment.
          </p>

          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                Select Tutor
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {HIRED_TUTORS.map((tutor) => (
                  <button
                    key={tutor.id}
                    type="button"
                    onClick={() => setSelectedTutor(tutor)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors duration-150 ${
                      selectedTutor.id === tutor.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    style={{
                      borderColor: selectedTutor.id === tutor.id ? C.primary : C.border,
                    }}
                  >
                    <img
                      src={tutor.tutorImg}
                      alt={tutor.tutorName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: C.text }}>
                        {tutor.tutorName}
                      </p>
                      <p className="text-xs" style={{ color: C.textSecondary }}>
                        {tutor.subjects.join(", ")} · ৳{tutor.fee}/hr
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input label="Subject" placeholder="e.g., Physics" />
              <Input label="Topic Covered" placeholder="e.g., Newton's Laws" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input label="Date" type="date" />
              <Input label="Duration (hours)" placeholder="e.g., 1.5" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                Homework Assigned
              </label>
              <textarea
                placeholder="Describe the homework assignment..."
                rows={3}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2"
                style={{ borderColor: C.border, color: C.text }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primary}33`)}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                Notes
              </label>
              <textarea
                placeholder="Any additional notes about the lesson..."
                rows={2}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2"
                style={{ borderColor: C.border, color: C.text }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primary}33`)}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
            </div>

            <div className="flex gap-3">
              <SecondaryButton onClick={() => onNavigate("lessons")}>Cancel</SecondaryButton>
              <PrimaryButton full>Submit Lesson</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
