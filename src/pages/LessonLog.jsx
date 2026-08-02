import { C } from "../constants/tokens";
import { Input, PrimaryButton, SecondaryButton } from "../components/ui";
import { HIRED_TUTORS } from "../data/mockData";
import { useState } from "react";
import { UserCheck } from "lucide-react";

export function LessonLog({ onNavigate, role = "parent" }) {
  const isTutor = role === "tutor";
  const [selectedTutor, setSelectedTutor] = useState(HIRED_TUTORS[0]);
  const [selectedStudent, setSelectedStudent] = useState("1");
  const [submitted, setSubmitted] = useState(false);

  const studentsList = [
    { id: "1", name: "Abdul Rahman's Son", classLevel: "Class 10", subject: "Physics" },
    { id: "2", name: "Tanvir R.", classLevel: "Class 8", subject: "English" },
  ];

  const backLink = isTutor ? "tutor-dashboard" : "lessons";

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onNavigate(backLink);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => onNavigate(backLink)}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to {isTutor ? "dashboard" : "lessons"}
          </button>

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>
            {isTutor ? "Log Completed Lesson" : "Log Lesson"}
          </h1>
          <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
            {isTutor 
              ? "Record taught lesson details to request parent confirmation and payout."
              : "Record lesson details for tracking and payment."}
          </p>

          {submitted && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              Lesson logged successfully! Redirecting...
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {isTutor ? (
              <div>
                <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                  Select Student / Batch
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {studentsList.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => setSelectedStudent(student.id)}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors duration-150 ${
                        selectedStudent === student.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      style={{
                        borderColor: selectedStudent === student.id ? C.primary : C.border,
                      }}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <UserCheck size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.text }}>
                          {student.name}
                        </p>
                        <p className="text-xs" style={{ color: C.textSecondary }}>
                          {student.classLevel} · {student.subject}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
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
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input label="Subject" placeholder="e.g., Physics" required />
              <Input label="Topic Covered" placeholder="e.g., Newton's Laws" required />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input label="Date" type="date" required />
              <Input label="Duration (hours)" placeholder="e.g., 1.5" required />
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
                Notes for Parent
              </label>
              <textarea
                placeholder="Any additional notes about student's performance..."
                rows={2}
                className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2"
                style={{ borderColor: C.border, color: C.text }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primary}33`)}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
            </div>

            <div className="flex gap-3">
              <SecondaryButton type="button" onClick={() => onNavigate(backLink)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" full>Submit Lesson</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
