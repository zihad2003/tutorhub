import { C } from "../constants/tokens";
import { Input, PrimaryButton, SecondaryButton } from "../components/ui";
import { HIRED_TUTORS } from "../data/mockData";
import { postToAPI, fetchFromAPI } from "../api";
import { useEffect, useState } from "react";

export function LessonLog({ onNavigate, role = "parent", account }) {
  const isTutor = role === "tutor";
  const [selectedTutor, setSelectedTutor] = useState(HIRED_TUTORS[0]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const ownTutor = account && !account.demo && account.role === "tutor" && account.id;
  const [studentsList, setStudentsList] = useState(ownTutor ? [] : [
    { id: "1", name: "Abdul Rahman's Son", classLevel: "Class 10", subject: "Physics" },
    { id: "2", name: "Tanvir R.", classLevel: "Class 8", subject: "English" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = ownTutor
      ? fetchFromAPI("/hired_tutors").then((rows) => (Array.isArray(rows) ? rows : [])
          .filter((row) => Number(row.tutorId) === Number(account.id))
          .map((row) => ({
            id: String(row.parentId || row.id),
            name: row.parentName || "Student",
            classLevel: "Student",
            subject: "Tuition",
          })))
      : fetchFromAPI("/parents").then((rows) => (Array.isArray(rows) ? rows : []).map((parent) => ({
          id: String(parent.id),
          name: parent.name,
          classLevel: parent.location || "Student",
          subject: "Tuition",
        })));
    load
      .then((rows) => {
        if (cancelled || !Array.isArray(rows) || rows.length === 0) return;
        setStudentsList(rows);
        setSelectedStudent(String(rows[0].id));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const backLink = isTutor ? "tutor-dashboard" : "lessons";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const student = studentsList.find((item) => item.id === selectedStudent);
    setSaveError("");
    try {
      await postToAPI("/lessons", {
        tutorId: account?.role === "tutor" ? account.id : selectedTutor?.tutorId,
        subject: form.get("subject"),
        topic: form.get("topic"),
        date: form.get("date"),
        classLevel: student?.classLevel || null,
        duration: form.get("duration") || null,
        homework: form.get("homework") || null,
        notes: form.get("notes") || null,
        fee: selectedTutor?.fee || null,
      });
      setSubmitted(true);
      setTimeout(() => {
        onNavigate(backLink);
      }, 1500);
    } catch {
      setSaveError("The lesson could not be saved. Please try again.");
    }
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

          {saveError && (
            <p className="mt-4 text-sm font-semibold" style={{ color: C.error }}>{saveError}</p>
          )}

          {submitted && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
              Lesson logged successfully! Redirecting...
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {isTutor ? (
              <div>
                <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }} htmlFor="lesson-student">
                  Select Student / Batch
                </label>
                <select
                  id="lesson-student"
                  required
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2"
                  style={{ borderColor: C.border, color: C.text }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primary}33`)}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <option value="" disabled>Select a student</option>
                  {studentsList.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} · {student.classLevel} · {student.subject}
                    </option>
                  ))}
                </select>
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
                          {(Array.isArray(tutor.subjects) ? tutor.subjects : []).join(", ")} · ৳{Number(tutor.fee || 0).toLocaleString("en-US")}/mo
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input name="subject" label="Subject" placeholder="e.g., Physics" required />
              <Input name="topic" label="Topic Covered" placeholder="e.g., Newton's Laws" required />
            </div>

            {isTutor ? (
              <Input name="date" label="Date" type="date" required />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input name="date" label="Date" type="date" required />
                <Input name="duration" label="Duration (hours)" placeholder="e.g., 1.5" required />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                Homework Assigned
              </label>
              <textarea
                name="homework"
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
                name="notes"
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
