import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton } from "../components/ui";
import { LESSONS } from "../data/mockData";
import { CheckCircle2, XCircle, Clock, BookOpen } from "lucide-react";

export function LessonConfirm({ onNavigate }) {
  const pendingLessons = LESSONS.filter(l => l.status === "pending");

  return (
    <div className="flex min-h-screen bg-white lg:block">
      <div className="flex-1 p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          <button
            onClick={() => onNavigate("lessons")}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to lessons
          </button>

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Confirm Lessons</h1>
          <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
            Review and confirm lessons logged by your tutors.
          </p>

          {pendingLessons.length === 0 ? (
            <div className="mt-10 rounded-lg border p-10 text-center" style={{ borderColor: C.border }}>
              <p className="text-sm font-semibold" style={{ color: C.text }}>No pending lessons</p>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                All lessons have been confirmed.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {pendingLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="rounded-lg border p-6"
                  style={{ borderColor: C.border }}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold" style={{ color: C.text }}>
                          {lesson.tutorName}
                        </h3>
                        <Badge tone="warning">Pending</Badge>
                      </div>
                      <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                        {lesson.subject} · {lesson.date}
                      </p>
                    </div>
                    <p className="text-lg font-semibold" style={{ color: C.text }}>
                      ৳{lesson.fee}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} color={C.textSecondary} />
                      <div>
                        <p className="text-xs" style={{ color: C.textSecondary }}>Duration</p>
                        <p className="text-sm font-semibold" style={{ color: C.text }}>{lesson.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} color={C.textSecondary} />
                      <div>
                        <p className="text-xs" style={{ color: C.textSecondary }}>Topic</p>
                        <p className="text-sm font-semibold" style={{ color: C.text }}>{lesson.topic}</p>
                      </div>
                    </div>
                  </div>

                  {lesson.homework && (
                    <div className="mt-4 rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
                      <p className="text-xs font-semibold uppercase" style={{ color: C.textSecondary }}>
                        Homework
                      </p>
                      <p className="mt-1 text-sm" style={{ color: C.text }}>{lesson.homework}</p>
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <SecondaryButton>
                      <XCircle size={16} className="mr-1.5 inline" />
                      Reject
                    </SecondaryButton>
                    <PrimaryButton>
                      <CheckCircle2 size={16} className="mr-1.5 inline" />
                      Confirm
                    </PrimaryButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
