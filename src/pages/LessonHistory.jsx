import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton } from "../components/ui";
import { LESSONS, HIRED_TUTORS } from "../data/mockData";
import { Calendar, Clock, DollarSign, BookOpen, FileText, ChevronRight, X, Eye, Check } from "lucide-react";
import { useState } from "react";

export function LessonHistory({ onNavigate, role = "parent" }) {
  const isTutor = role === "tutor";
  const backLink = isTutor ? "tutor-dashboard" : "parent-dashboard";
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessons, setLessons] = useState(LESSONS);

  const handleConfirmLesson = (lessonId) => {
    setLessons(lessons.map(l => 
      l.id === lessonId ? { ...l, status: "confirmed" } : l
    ));
    setSelectedLesson(null);
  };

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

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>
            {isTutor ? "My Lesson History" : "Lesson History"}
          </h1>
          <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
            {isTutor 
              ? "View all your completed lessons with detailed logs and homework assignments."
              : "View all completed lessons with tutor notes and homework assignments."}
          </p>

          <div className="mt-8 overflow-x-auto rounded-lg border" style={{ borderColor: C.border }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/80" style={{ borderColor: C.border }}>
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Subject</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Class</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Lesson Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Time Slot</th>
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-xs" style={{ color: C.textSecondary }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson.id} className="border-b hover:bg-gray-50/50" style={{ borderColor: C.border }}>
                    <td className="px-4 py-3 font-medium" style={{ color: C.text }}>{lesson.subject}</td>
                    <td className="px-4 py-3" style={{ color: C.text }}>{lesson.classLevel}</td>
                    <td className="px-4 py-3" style={{ color: C.text }}>{lesson.date}</td>
                    <td className="px-4 py-3" style={{ color: C.text }}>{lesson.timeSlot}</td>
                    <td className="px-4 py-3">
                      <Badge tone={lesson.status === "confirmed" ? "success" : "warning"}>
                        {lesson.status === "confirmed" ? "Confirmed" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-gray-50"
                        style={{ borderColor: C.border, color: C.primary }}
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-center">
            <PrimaryButton onClick={() => onNavigate("lesson-log")}>
              <ChevronRight size={16} className="mr-1.5 inline" />
              Log New Lesson
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Lesson Detail Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-6" style={{ borderColor: C.border }}>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: C.text }}>
                  Lesson {LESSONS.findIndex(l => l.id === selectedLesson.id) + 1} Details
                </h2>
                <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                  {selectedLesson.topic}
                </p>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={20} color={C.textSecondary} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} color={C.primary} />
                    <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>Subject</p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>{selectedLesson.subject}</p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} color={C.primary} />
                    <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>Class Level</p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>{selectedLesson.classLevel}</p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} color={C.primary} />
                    <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>Date</p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>{selectedLesson.date}</p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} color={C.primary} />
                    <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>Time Slot</p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>{selectedLesson.timeSlot}</p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} color={C.primary} />
                    <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>Duration</p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>{selectedLesson.duration}</p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={16} color={C.primary} />
                    <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>Fee</p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>৳{selectedLesson.fee}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                <div className="mb-2 flex items-center gap-2">
                  <BookOpen size={16} color={C.primary} />
                  <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>Homework Assigned</p>
                </div>
                <p className="text-sm" style={{ color: C.text }}>{selectedLesson.homework}</p>
              </div>

              {selectedLesson.notes && (
                <div className="rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                  <div className="mb-2 flex items-center gap-2">
                    <FileText size={16} color={C.primary} />
                    <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>Tutor Notes</p>
                  </div>
                  <p className="text-sm" style={{ color: C.text }}>{selectedLesson.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: C.border }}>
                <span className="text-sm" style={{ color: C.textSecondary }}>
                  {isTutor ? "Student" : "Tutor"}: {isTutor ? "Abdul Rahman's Son" : selectedLesson.tutorName}
                </span>
                <Badge tone={selectedLesson.status === "confirmed" ? "success" : "warning"}>
                  {selectedLesson.status === "confirmed" ? "Confirmed" : "Pending"}
                </Badge>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t p-6" style={{ borderColor: C.border }}>
              <SecondaryButton onClick={() => setSelectedLesson(null)}>Close</SecondaryButton>
              {!isTutor && selectedLesson.status === "pending" && (
                <PrimaryButton onClick={() => handleConfirmLesson(selectedLesson.id)}>
                  <Check size={16} className="mr-1.5 inline" />
                  Confirm Lesson
                </PrimaryButton>
              )}
              <PrimaryButton onClick={() => { setSelectedLesson(null); onNavigate("lesson-log"); }}>
                Log New Lesson
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
