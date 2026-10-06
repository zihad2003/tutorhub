import { C } from "../constants/tokens";
import { Input, PrimaryButton, SecondaryButton } from "../components/ui";
import { HIRED_TUTORS } from "../data/mockData";
import { postToAPI, fetchFromAPI } from "../api";
import { useEffect, useState } from "react";

export function LessonLog({ onNavigate, role = "parent", account }) {
  const isTutor = role === "tutor";
  const [selectedTutor, setSelectedTutor] = useState(HIRED_TUTORS[0]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [subject, setSubject] = useState("");
  const ownTutor = account && !account.demo && account.role === "tutor" && account.id;
  const [studentsList, setStudentsList] = useState(ownTutor ? [] : [
    { id: "1", name: "Abdul Rahman's Son", classLevel: "Class 10", subject: "Physics" },
    { id: "2", name: "Tanvir R.", classLevel: "Class 8", subject: "English" },
  ]);
  const [studentsReady, setStudentsReady] = useState(!ownTutor);
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [duration, setDuration] = useState("1");
  const [lessonHistory, setLessonHistory] = useState([]);

  useEffect(() => {
    if (!isTutor) return undefined;
    let cancelled = false;
    const load = ownTutor
      ? fetchFromAPI("/hired_tutors").then((rows) => (Array.isArray(rows) ? rows : [])
          .filter((row) => Number(row.tutorId) === Number(account.id) && row.status === "active")
          .map((row) => {
            const subjects = Array.isArray(row.subjects) ? row.subjects : [];
            return {
              id: String(row.parentId),
              hiredId: row.id,
              parentId: row.parentId,
              name: row.parentName || "Student",
              classLevel: "Hired student",
              subject: subjects[0] || "Tuition",
              fee: Number(row.fee) || 0,
            };
          }))
      : Promise.resolve(studentsList);
    load
      .then((rows) => {
        if (cancelled || !Array.isArray(rows)) return;
        setStudentsList(rows);
        if (rows[0]) {
          setSelectedStudent(String(rows[0].id));
          setSubject(rows[0].subject || "");
        }
      })
      .catch(() => {
        if (!cancelled) setSaveError("Hired students could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) setStudentsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isTutor, ownTutor, account?.id]);

  useEffect(() => {
    if (!ownTutor) return undefined;
    let cancelled = false;
    fetchFromAPI("/lessons")
      .then((rows) => {
        if (cancelled || !Array.isArray(rows)) return;
        setLessonHistory(rows.filter((row) => Number(row.tutorId) === Number(account.id)));
      })
      .catch(() => {
        if (!cancelled) setLessonHistory([]);
      });
    return () => {
      cancelled = true;
    };
  }, [ownTutor, account?.id]);

  const backLink = isTutor ? "tutor-dashboard" : "lessons";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const student = studentsList.find((item) => item.id === selectedStudent);
    if (isTutor && ownTutor && !student) {
      setSaveError("Select the hired student for this lesson.");
      return;
    }
    setSaveError("");
    try {
      const saved = await postToAPI("/lessons", {
        tutorId: account?.role === "tutor" ? account.id : selectedTutor?.tutorId,
        parentId: student?.parentId || null,
        hiredTutorId: student?.hiredId || null,
        subject: isTutor ? subject : form.get("subject"),
        topic: form.get("topic"),
        date: form.get("date"),
        classLevel: student?.subject || student?.classLevel || null,
        duration: isTutor ? duration : (form.get("duration") || "1"),
        homework: form.get("homework") || null,
        notes: form.get("notes") || null,
        fee: student?.fee || selectedTutor?.fee || null,
      });
      if (saved && saved.id) {
        setLessonHistory((rows) => [saved, ...rows.filter((row) => row.id !== saved.id)]);
      }
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
    } catch {
      setSaveError("The lesson could not be saved. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className={`mx-auto ${isTutor ? "max-w-4xl" : "max-w-2xl"}`}>
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
              Lesson saved. It is now in your lesson history.
            </div>
          )}

          {isTutor && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold" style={{ color: C.text }}>Lesson history</h2>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                Lessons you have logged for your hired students.
              </p>
              {lessonHistory.length === 0 ? (
                <p className="mt-4 rounded-lg border p-4 text-sm" style={{ borderColor: C.border, color: C.textSecondary }}>
                  No lessons logged yet.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto rounded-lg border" style={{ borderColor: C.border }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50" style={{ borderColor: C.border }}>
                        <th className="px-4 py-3 text-left font-semibold">Date</th>
                        <th className="px-4 py-3 text-left font-semibold">Student</th>
                        <th className="px-4 py-3 text-left font-semibold">Subject</th>
                        <th className="px-4 py-3 text-left font-semibold">Topic</th>
                        <th className="px-4 py-3 text-left font-semibold">Hours</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lessonHistory.map((lesson) => (
                        <tr key={lesson.id} className="border-b" style={{ borderColor: C.border }}>
                          <td className="px-4 py-3">{lesson.date}</td>
                          <td className="px-4 py-3">{lesson.parentName || lesson.studentName || "Student"}</td>
                          <td className="px-4 py-3">{lesson.subject}</td>
                          <td className="px-4 py-3">{lesson.topic}</td>
                          <td className="px-4 py-3">{lesson.hours || 1}</td>
                          <td className="px-4 py-3 capitalize">{lesson.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setSelectedStudent(nextId);
                    const nextStudent = studentsList.find((item) => item.id === nextId);
                    if (nextStudent?.subject) setSubject(nextStudent.subject);
                  }}
                  className="w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2"
                  style={{ borderColor: C.border, color: C.text }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primary}33`)}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <option value="" disabled>Select a student</option>
                  {studentsList.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} · {student.subject}{student.fee ? ` · ৳${Number(student.fee).toLocaleString("en-US")}/mo` : ""}
                    </option>
                  ))}
                </select>
                {studentsReady && studentsList.length === 0 && (
                  <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
                    No hired student yet. A parent has to hire you before a lesson can be logged.
                  </p>
                )}
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
              <Input name="subject" label="Subject" placeholder="e.g., Physics" required value={isTutor ? subject : undefined} onChange={isTutor ? (e) => setSubject(e.target.value) : undefined} />
              <Input name="topic" label="Topic Covered" placeholder="e.g., Newton's Laws" required />
            </div>

            {isTutor ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input name="date" label="Date" type="date" required />
                <Input
                  name="duration"
                  label="Duration (hours)"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
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
              <PrimaryButton type="submit" full disabled={isTutor && ownTutor && studentsList.length === 0}>Submit Lesson</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
