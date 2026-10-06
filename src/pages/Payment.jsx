import { useEffect, useState } from "react";
import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton } from "../components/ui";
import { Table } from "../components/ui/Table";
import { PAYMENTS, WITHDRAWAL_REQUESTS } from "../data/mockData";
import { patchToAPI } from "../api";
import { useLiveList } from "../lib/records";
import { CreditCard, Download, Calendar, DollarSign, TrendingUp, Users, Wallet, CheckCircle2, XCircle, Clock } from "lucide-react";

import { PaymentGateway } from "../components/ui/PaymentGateway";

export function Payment({ onNavigate, role = "parent", account = null }) {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [showGateway, setShowGateway] = useState(false);
  const isAdmin = role === "admin";
  const backLink = isAdmin ? "admin-dashboard" : "parent-dashboard";

  const own = account && !account.demo && account.id && role !== "admin";
  const [paymentRows, setPaymentRows] = useLiveList("/payments", isAdmin || own ? [] : PAYMENTS);
  const [withdrawalRows, setWithdrawals] = useLiveList("/withdrawal_requests", isAdmin || own ? [] : WITHDRAWAL_REQUESTS);
  const payments = own ? paymentRows.filter((payment) => Number(payment.parentId) === Number(account.id)) : paymentRows;
  const withdrawals = own ? [] : withdrawalRows;
  const pendingPayment = payments.find((payment) => payment.status === "pending");
  const [customAmount, setCustomAmount] = useState(0);

  useEffect(() => {
    if (pendingPayment) setCustomAmount(Number(pendingPayment.totalAmount) || 0);
  }, [pendingPayment?.id, pendingPayment?.totalAmount]);

  const updateWithdrawal = async (id, status) => {
    const processedDate = new Date().toISOString().split("T")[0];
    const result = await patchToAPI(`/withdrawal_requests/${id}`, { status });
    setWithdrawals((prev) => prev.map((row) => (
      row.id === id ? { ...row, status, processedDate } : row
    )));
    if (Array.isArray(result.payments) && result.payments.length) {
      setPaymentRows((prev) => {
        const next = prev.map((row) => result.payments.find((item) => item.id === row.id) || row);
        for (const payment of result.payments) {
          if (!next.some((row) => row.id === payment.id)) next.unshift(payment);
        }
        return next;
      });
    }
  };

  const handleApprove = (id) => {
    updateWithdrawal(id, "approved").catch(() => {});
  };

  const handleReject = (id) => {
    updateWithdrawal(id, "rejected").catch(() => {});
  };

  if (isAdmin) {
    const totalVolume = payments
      .filter((payment) => payment.status === "paid")
      .reduce((acc, payment) => acc + (Number(payment.totalAmount) || 0), 0);
    const tutorPayouts = withdrawals
      .filter((row) => row.status === "approved")
      .reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
    const commission = totalVolume - tutorPayouts;

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

            <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Platform Financial Ledger</h1>
            <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
              Comprehensive audit log of parent payments, tutor payouts, and platform commission.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-5 shadow-sm" style={{ borderColor: C.border }}>
                <p className="text-xs uppercase font-semibold" style={{ color: C.textSecondary }}>Total received</p>
                <p className="mt-2 text-2xl font-semibold" style={{ color: C.text }}>৳{totalVolume}</p>
              </div>
              <div className="rounded-lg border p-5 shadow-sm" style={{ borderColor: C.border }}>
                <p className="text-xs uppercase font-semibold" style={{ color: C.textSecondary }}>Tutor payouts</p>
                <p className="mt-2 text-2xl font-semibold text-green-600">৳{tutorPayouts}</p>
              </div>
              <div className="rounded-lg border p-5 shadow-sm" style={{ borderColor: C.border }}>
                <p className="text-xs uppercase font-semibold" style={{ color: C.textSecondary }}>Platform balance</p>
                <p className="mt-2 text-2xl font-semibold text-blue-600">৳{commission}</p>
              </div>
            </div>

            <div className="mt-8 rounded-lg border p-6 shadow-sm" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: C.text }}>Transaction Audit History</h2>
                <PrimaryButton size="sm">
                  <Download size={14} className="mr-1.5 inline" /> Export CSV
                </PrimaryButton>
              </div>

              <div className="mt-4">
                <Table
                  columns={[
                    { key: "parentName", label: "Parent" },
                    { key: "tutorName", label: "Tutor" },
                    { key: "month", label: "Billing Period" },
                    { key: "totalAmount", label: "Amount", render: (amt) => `৳${Number(amt || 0).toLocaleString("en-US")}` },
                    { key: "status", label: "Status", render: (status) => (
                      <Badge tone={status === "paid" ? "success" : "warning"}>{status}</Badge>
                    )},
                  ]}
                  data={payments}
                />
              </div>
            </div>
            <div className="mt-8 rounded-lg border p-6 shadow-sm bg-white" style={{ borderColor: C.border }}>
              <div className="border-b pb-4">
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: C.text }}>
                  <Wallet size={20} className="text-blue-600" />
                  Tutor Withdrawal Requests
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textSecondary }}>
                  Review and process tutor withdrawal requests.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {withdrawals.length === 0 ? (
                  <div className="rounded-lg border p-10 text-center" style={{ borderColor: C.border }}>
                    <Wallet size={48} color={C.textSecondary} className="mx-auto" />
                    <p className="mt-4 text-sm font-semibold" style={{ color: C.text }}>No withdrawal requests</p>
                    <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                      No tutors have requested withdrawals yet.
                    </p>
                  </div>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="rounded-lg border p-6 bg-white hover:shadow-sm transition-shadow"
                      style={{ borderColor: C.border }}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                          {withdrawal.tutorImg ? (
                            <img
                              src={withdrawal.tutorImg}
                              alt={withdrawal.tutorName}
                              className="h-14 w-14 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold" style={{ color: C.primary }}>
                              {String(withdrawal.tutorName || "T").slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold" style={{ color: C.text }}>
                                {withdrawal.tutorName}
                              </h3>
                              <Badge 
                                tone={
                                  withdrawal.status === "approved" ? "success" : 
                                  withdrawal.status === "rejected" ? "error" : "warning"
                                }
                              >
                                {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                              Requested on {withdrawal.requestedDate}
                            </p>
                            <div className="mt-2 space-y-1 text-sm" style={{ color: C.text }}>
                              <p className="flex items-center gap-2 font-medium">
                                <span>৳{withdrawal.amount.toLocaleString()}</span>
                              </p>
                              <p className="flex items-center gap-2 text-xs" style={{ color: C.textSecondary }}>
                                Method: {withdrawal.method} · {withdrawal.accountNumber}
                              </p>
                              {withdrawal.bankName && (
                                <p className="flex items-center gap-2 text-xs" style={{ color: C.textSecondary }}>
                                  Bank: {withdrawal.bankName} · {withdrawal.branch}
                                </p>
                              )}
                            </div>
                            {withdrawal.notes && (
                              <p className="mt-2 text-sm italic bg-gray-50 p-2.5 rounded-md border" style={{ borderColor: C.border, color: C.textSecondary }}>
                                "{withdrawal.notes}"
                              </p>
                            )}
                          </div>
                        </div>

                        {withdrawal.status === "pending" ? (
                          <div className="flex gap-2">
                            <SecondaryButton onClick={() => handleReject(withdrawal.id)}>
                              <XCircle size={16} className="mr-1.5 inline" />
                              Reject
                            </SecondaryButton>
                            <PrimaryButton onClick={() => handleApprove(withdrawal.id)}>
                              <CheckCircle2 size={16} className="mr-1.5 inline" />
                              Approve
                            </PrimaryButton>
                          </div>
                        ) : (
                          <div className="text-sm">
                            {withdrawal.status === "approved" && (
                              <span className="flex items-center gap-1 text-green-600 font-semibold">
                                <CheckCircle2 size={16} />
                                Processed on {withdrawal.processedDate}
                              </span>
                            )}
                            {withdrawal.status === "rejected" && (
                              <span className="flex items-center gap-1 text-red-600 font-semibold">
                                <XCircle size={16} />
                                Request rejected
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setShowGateway(true);
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
                  <span style={{ color: C.textSecondary }}>Tutor</span>
                  <span className="font-semibold" style={{ color: C.text }}>
                    {pendingPayment.tutorName || "Tutor"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: C.textSecondary }}>Amount due</span>
                  <span className="font-semibold" style={{ color: C.text }}>
                    ৳{Number(pendingPayment.totalAmount || 0).toLocaleString("en-US")}
                  </span>
                </div>
                <div className="my-4 h-px" style={{ background: C.border }} />
                <div className="flex justify-between">
                  <span className="text-base font-semibold" style={{ color: C.text }}>Amount to pay</span>
                  <div className="flex items-center text-xl font-semibold" style={{ color: C.text }}>
                    ৳ <input 
                      type="number" 
                      value={customAmount} 
                      onChange={(e) => setCustomAmount(Number(e.target.value))}
                      className="ml-1 w-24 rounded border px-2 py-1 text-right outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold" style={{ color: C.text }}>
                  Payment Method
                </label>
                <div className="space-y-2">
                  <button 
                    onClick={() => setSelectedMethod("card")}
                    className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors duration-150 ${selectedMethod === 'card' ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}
                  >
                    <CreditCard size={20} color={C.primary} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: C.text }}>Credit/Debit Card</p>
                      <p className="text-xs" style={{ color: C.textSecondary }}>Visa, Mastercard, Amex</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => setSelectedMethod("bkash")}
                    className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-colors duration-150 ${selectedMethod === 'bkash' ? 'bg-pink-50 border-pink-500' : 'hover:bg-gray-50'}`}
                  >
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
                <PrimaryButton full onClick={handlePayment}>Pay ৳{customAmount}</PrimaryButton>
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
              {payments.filter(p => p.status === "paid").map((payment) => (
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
      
      {showGateway && pendingPayment && (
        <PaymentGateway
          method={selectedMethod}
          amount={customAmount}
          onComplete={async () => {
            if (own && pendingPayment) {
              try {
                const paid = await patchToAPI(`/payments/${pendingPayment.id}`, {
                  parentId: account.id,
                  status: "paid",
                  totalAmount: customAmount || pendingPayment.totalAmount,
                });
                const incoming = Array.isArray(paid.payments) ? paid.payments : [paid];
                setPaymentRows((rows) => {
                  const next = rows.map((row) => incoming.find((item) => item.id === row.id) || row);
                  for (const item of incoming) {
                    if (!next.some((row) => row.id === item.id)) next.unshift(item);
                  }
                  return next;
                });
              } catch (error) {
                setShowGateway(false);
                window.alert(error.message || "The payment could not be saved.");
                return;
              }
            }
            setShowGateway(false);
            onNavigate("summary");
          }}
          onCancel={() => setShowGateway(false)}
        />
      )}
    </div>
  );
}
