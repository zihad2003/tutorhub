import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton } from "../components/ui";
import { PAYMENTS } from "../data/mockData";
import { CreditCard, Download, Calendar } from "lucide-react";

export function Payment({ onNavigate }) {
  const pendingPayment = PAYMENTS.find(p => p.status === "pending");

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

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Payment</h1>
          <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
            Review and pay for completed lessons.
          </p>

          {pendingPayment ? (
            <div className="mt-8 rounded-lg border p-6" style={{ borderColor: C.border }}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: C.text }}>
                    {pendingPayment.month}
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                    Due by {pendingPayment.dueDate}
                  </p>
                </div>
                <Badge tone="warning">Pending</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: C.textSecondary }}>Total Lessons</span>
                  <span className="font-semibold" style={{ color: C.text }}>
                    {pendingPayment.totalLessons}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: C.textSecondary }}>Subtotal</span>
                  <span className="font-semibold" style={{ color: C.text }}>
                    ৳{pendingPayment.totalAmount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: C.textSecondary }}>Platform Fee</span>
                  <span className="font-semibold" style={{ color: C.text }}>৳0</span>
                </div>
                <div className="my-4 h-px" style={{ background: C.border }} />
                <div className="flex justify-between">
                  <span className="text-base font-semibold" style={{ color: C.text }}>Total</span>
                  <span className="text-xl font-semibold" style={{ color: C.text }}>
                    ৳{pendingPayment.totalAmount}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold" style={{ color: C.text }}>
                  Payment Method
                </label>
                <div className="space-y-2">
                  <button className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors duration-150 hover:bg-gray-50" style={{ borderColor: C.border }}>
                    <CreditCard size={20} color={C.primary} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: C.text }}>Credit/Debit Card</p>
                      <p className="text-xs" style={{ color: C.textSecondary }}>Visa, Mastercard, Amex</p>
                    </div>
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors duration-150 hover:bg-gray-50" style={{ borderColor: C.border }}>
                    <div className="flex h-5 w-5 items-center justify-center rounded" style={{ background: C.primary }}>
                      <span className="text-xs font-semibold text-white">bKash</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: C.text }}>bKash</p>
                      <p className="text-xs" style={{ color: C.textSecondary }}>Mobile banking</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <SecondaryButton full onClick={() => onNavigate("summary")}>
                  <Download size={16} className="mr-1.5 inline" />
                  View Summary
                </SecondaryButton>
                <PrimaryButton full>Pay ৳{pendingPayment.totalAmount}</PrimaryButton>
              </div>
            </div>
          ) : (
            <div className="mt-10 rounded-lg border p-10 text-center" style={{ borderColor: C.border }}>
              <Calendar size={48} color={C.textSecondary} className="mx-auto" />
              <p className="mt-4 text-sm font-semibold" style={{ color: C.text }}>No pending payments</p>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                All payments are up to date.
              </p>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-semibold" style={{ color: C.text }}>Payment History</h2>
            <div className="mt-4 space-y-3">
              {PAYMENTS.filter(p => p.status === "paid").map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                  style={{ borderColor: C.border }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: C.text }}>
                      {payment.month}
                    </p>
                    <p className="text-xs" style={{ color: C.textSecondary }}>
                      Paid on {payment.paidDate} · {payment.totalLessons} lessons
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: C.text }}>
                      ৳{payment.totalAmount}
                    </p>
                    <Badge tone="success">Paid</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
