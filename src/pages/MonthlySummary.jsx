import { C } from "../constants/tokens";
import { PrimaryButton, SecondaryButton } from "../components/ui";
import { LESSONS, PAYMENTS } from "../data/mockData";
import { Download, FileText, Calendar, Clock, DollarSign } from "lucide-react";

export function MonthlySummary({ onNavigate }) {
  const currentPayment = PAYMENTS.find(p => p.month === "July 2026");
  const monthLessons = LESSONS.filter(l => l.date.startsWith("2026-07"));

  return (
    <div className="flex min-h-screen bg-white lg:block">
      <div className="flex-1 p-6 lg:ml-64">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => onNavigate("payments")}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to payments
          </button>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Monthly Summary</h1>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                July 2026 · Lesson Report
              </p>
            </div>
            <PrimaryButton>
              <Download size={16} className="mr-1.5 inline" />
              Download PDF
            </PrimaryButton>
          </div>

          <div className="rounded-lg border p-8" style={{ borderColor: C.border }}>
            <div className="mb-8 border-b pb-6" style={{ borderColor: C.border }}>
              <h2 className="text-xl font-semibold" style={{ color: C.text }}>TutorHub</h2>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                Monthly Lesson Summary Report
              </p>
              <p className="mt-2 text-xs" style={{ color: C.textSecondary }}>
                Generated on July 24, 2026
              </p>
            </div>

            <div className="mb-8 grid grid-cols-3 gap-4 rounded-lg p-4" style={{ background: C.surface }}>
              <div className="text-center">
                <p className="text-xs uppercase" style={{ color: C.textSecondary }}>Total Lessons</p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: C.text }}>
                  {monthLessons.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase" style={{ color: C.textSecondary }}>Total Hours</p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: C.text }}>
                  {monthLessons.reduce((acc, l) => acc + parseFloat(l.duration), 0).toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase" style={{ color: C.textSecondary }}>Total Amount</p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: C.text }}>
                  ৳{currentPayment?.totalAmount || 0}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-base font-semibold" style={{ color: C.text }}>
                Lesson Details
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ borderColor: C.border }}>
                      <th className="px-3 py-2 text-left font-semibold" style={{ color: C.textSecondary }}>
                        Date
                      </th>
                      <th className="px-3 py-2 text-left font-semibold" style={{ color: C.textSecondary }}>
                        Tutor
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
                        Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthLessons.map((lesson) => (
                      <tr key={lesson.id} className="border-b" style={{ borderColor: C.border }}>
                        <td className="px-3 py-3" style={{ color: C.text }}>{lesson.date}</td>
                        <td className="px-3 py-3" style={{ color: C.text }}>{lesson.tutorName}</td>
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
                        Total
                      </td>
                      <td className="px-3 py-3 text-right text-lg font-semibold" style={{ color: C.text }}>
                        ৳{currentPayment?.totalAmount || 0}
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
                  <p className="text-sm font-semibold" style={{ color: C.text }}>Notes</p>
                  <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                    All lessons have been confirmed by the parent. This summary includes all completed lessons for the billing period.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <SecondaryButton onClick={() => onNavigate("payments")}>Close</SecondaryButton>
            <PrimaryButton>
              <Download size={16} className="mr-1.5 inline" />
              Download PDF
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
