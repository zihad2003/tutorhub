import { C } from "../constants/tokens";
import { PrimaryButton, SecondaryButton } from "../components/ui";
import { LESSONS, PAYMENTS } from "../data/mockData";
import { Download, FileText, Calendar, Clock, DollarSign } from "lucide-react";

export function MonthlySummary({ onNavigate, role = "parent" }) {
  const isTutor = role === "tutor";
  const backLink = isTutor ? "tutor-dashboard" : "parent-dashboard";

  const monthLessons = isTutor ? [
    { id: 1, date: "2026-07-02", studentName: "Abdul Rahman (Class 10)", subject: "Physics", topic: "Kinematics & Motion", duration: "1.5 hrs", fee: 1000 },
    { id: 2, date: "2026-07-05", studentName: "Abdul Rahman (Class 10)", subject: "Physics", topic: "Newton's Laws", duration: "1.5 hrs", fee: 1000 },
    { id: 3, date: "2026-07-10", studentName: "Tanvir R. (Class 8)", subject: "English", topic: "Grammar & Composition", duration: "1.0 hrs", fee: 500 },
  ] : LESSONS.filter(l => l.date.startsWith("2026-07"));

  const monthTotal = monthLessons.reduce((acc, l) => acc + l.fee, 0);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => onNavigate(backLink)}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: C.text }}>
                {isTutor ? "My Earnings & Summary" : "Monthly Summary"}
              </h1>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                July 2026 · {isTutor ? "Tutor Earnings Statement" : "Lesson Report"}
              </p>
            </div>
            <PrimaryButton>
              <Download size={16} className="mr-1.5 inline" />
              Download PDF Statement
            </PrimaryButton>
          </div>

          <div className="rounded-lg border p-4 sm:p-8" style={{ borderColor: C.border }}>
            <div className="mb-8 border-b pb-6" style={{ borderColor: C.border }}>
              <h2 className="text-xl font-semibold" style={{ color: C.text }}>TutorHub</h2>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                {isTutor ? "Tutor Monthly Earnings Statement" : "Monthly Lesson Summary Report"}
              </p>
              <p className="mt-2 text-xs" style={{ color: C.textSecondary }}>
                Generated on July 24, 2026
              </p>
            </div>

            <div className="mb-8 grid grid-cols-3 gap-2 rounded-lg p-4 sm:gap-4" style={{ background: C.surface }}>
              <div className="text-center">
                <p className="text-xs uppercase" style={{ color: C.textSecondary }}>Total Lessons</p>
                <p className="mt-2 text-xl font-semibold sm:text-2xl" style={{ color: C.text }}>
                  {monthLessons.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase" style={{ color: C.textSecondary }}>Total Hours</p>
                <p className="mt-2 text-xl font-semibold sm:text-2xl" style={{ color: C.text }}>
                  4.0 hrs
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase" style={{ color: C.textSecondary }}>{isTutor ? "Net Earnings" : "Total Amount"}</p>
                <p className="mt-2 text-xl font-semibold sm:text-2xl" style={{ color: C.text }}>
                  ৳{monthTotal}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-base font-semibold" style={{ color: C.text }}>
                {isTutor ? "Taught Lesson Breakdown" : "Lesson Details"}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: C.border }}>
                      <th className="px-3 py-2 text-left font-semibold" style={{ color: C.textSecondary }}>
                        Date
                      </th>
                      <th className="px-3 py-2 text-left font-semibold" style={{ color: C.textSecondary }}>
                        {isTutor ? "Student / Class" : "Tutor"}
                      </th>
                      <th className="px-3 py-2 text-left font-semibold" style={{ color: C.textSecondary }}>
                        Subject
                      </th>
                      <th className="px-3 py-2 text-left font-semibold" style={{ color: C.textSecondary }}>
                        Topic
                      </th>
                      <th className="px-3 py-2 text-left font-semibold" style={{ color: C.textSecondary }}>
                        Duration
                      </th>
                      <th className="px-3 py-2 text-right font-semibold" style={{ color: C.textSecondary }}>
                        {isTutor ? "Earnings" : "Fee"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthLessons.map((lesson) => (
                      <tr key={lesson.id} className="border-b" style={{ borderColor: C.border }}>
                        <td className="px-3 py-3" style={{ color: C.text }}>{lesson.date}</td>
                        <td className="px-3 py-3" style={{ color: C.text }}>{isTutor ? lesson.studentName : lesson.tutorName}</td>
                        <td className="px-3 py-3" style={{ color: C.text }}>{lesson.subject}</td>
                        <td className="px-3 py-3" style={{ color: C.text }}>{lesson.topic}</td>
                        <td className="px-3 py-3" style={{ color: C.text }}>{lesson.duration}</td>
                        <td className="px-3 py-3 text-right font-semibold" style={{ color: C.text }}>
                          ৳{lesson.fee}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2" style={{ borderColor: C.border }}>
                      <td colSpan={5} className="px-3 py-3 text-right font-semibold" style={{ color: C.text }}>
                        Total Net Earnings
                      </td>
                      <td className="px-3 py-3 text-right text-lg font-semibold" style={{ color: C.text }}>
                        ৳{monthTotal}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="rounded-lg border p-4" style={{ borderColor: C.border, background: C.surface }}>
              <div className="flex items-start gap-3">
                <FileText size={20} color={C.textSecondary} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>Payout Notice</p>
                  <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                    {isTutor 
                      ? "Earnings are automatically transferred to your registered bank / bKash account at the end of each month after parent confirmation."
                      : "All lessons have been confirmed by the parent. This summary includes all completed lessons for the billing period."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <SecondaryButton onClick={() => onNavigate(backLink)}>Close</SecondaryButton>
            <PrimaryButton>
              <Download size={16} className="mr-1.5 inline" />
              Download Statement
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
