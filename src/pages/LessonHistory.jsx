import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton } from "../components/ui";
import { LESSONS, HIRED_TUTORS } from "../data/mockData";
import { Calendar, Clock, DollarSign, BookOpen, FileText, ChevronRight } from "lucide-react";

export function LessonHistory({ onNavigate, role = "parent" }) {
  const isTutor = role === "tutor";
  const backLink = isTutor ? "tutor-dashboard" : "parent-dashboard";

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

          <div className="mt-8 space-y-6">
            {LESSONS.map((lesson, index) => (
              <div
                key={lesson.id}
                className="rounded-lg border p-6 shadow-sm transition-all duration-150 hover:border-blue-200"
                style={{ borderColor: C.border }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: C.text }}>
                          Lesson {index + 1}: {lesson.topic}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <Badge tone="neutral">{lesson.subject}</Badge>
                          <Badge tone={lesson.status === "confirmed" ? "success" : "warning"}>
                            {lesson.status === "confirmed" ? "Confirmed" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} color={C.textSecondary} />
                        <span className="text-sm" style={{ color: C.text }}>{lesson.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} color={C.textSecondary} />
                        <span className="text-sm" style={{ color: C.text }}>{lesson.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} color={C.textSecondary} />
                        <span className="text-sm font-bold" style={{ color: C.text }}>৳{lesson.fee}</span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                      <div className="mb-2 flex items-center gap-2">
                        <BookOpen size={16} color={C.primary} />
                        <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>
                          Homework Assigned
                        </p>
                      </div>
                      <p className="text-sm" style={{ color: C.text }}>{lesson.homework}</p>
                    </div>

                    {lesson.notes && (
                      <div className="mt-4 rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                        <div className="mb-2 flex items-center gap-2">
                          <FileText size={16} color={C.primary} />
                          <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>
                            Tutor Notes
                          </p>
                        </div>
                        <p className="text-sm" style={{ color: C.text }}>{lesson.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm" style={{ color: C.textSecondary }}>
                      {isTutor ? "Student" : "Tutor"}: {isTutor ? "Abdul Rahman's Son" : lesson.tutorName}
                    </span>
                    <SecondaryButton size="sm" onClick={() => onNavigate("lesson-log")}>
                      Log New Lesson
                    </SecondaryButton>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <PrimaryButton onClick={() => onNavigate("lesson-log")}>
              <ChevronRight size={16} className="mr-1.5 inline" />
              Log New Lesson
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
