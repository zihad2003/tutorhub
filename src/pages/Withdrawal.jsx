import { C } from "../constants/tokens";
import { Input, PrimaryButton, SecondaryButton, Badge } from "../components/ui";
import { WITHDRAWAL_REQUESTS, TUTOR_EARNINGS } from "../data/mockData";
import { DollarSign, Wallet, ArrowRight, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useState } from "react";

export function Withdrawal({ onNavigate, role = "tutor" }) {
  const isAdmin = role === "admin";
  const [withdrawals, setWithdrawals] = useState(WITHDRAWAL_REQUESTS);

  // Form state for tutor withdrawal
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bKash");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Calculate available balance from earnings
  const availableBalance = TUTOR_EARNINGS
    .filter(e => e.status === "pending")
    .reduce((acc, e) => acc + e.totalEarnings, 0);

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const newWithdrawal = {
      id: Date.now(),
      tutorId: 1,
      tutorName: "Rafiq Ahmed",
      tutorImg: "https://i.pravatar.cc/150?img=12",
      amount: parseInt(amount),
      method,
      accountNumber,
      bankName: method === "Bank Transfer" ? bankName : null,
      branch: method === "Bank Transfer" ? branch : null,
      requestedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      notes,
    };
    WITHDRAWAL_REQUESTS.unshift(newWithdrawal);
    setWithdrawals([newWithdrawal, ...withdrawals]);
    setSubmitted(true);
  };

  const handleApprove = (id) => {
    setWithdrawals(prev => prev.map(w => 
      w.id === id ? { ...w, status: "approved", processedDate: new Date().toISOString().split("T")[0] } : w
    ));
    const idx = WITHDRAWAL_REQUESTS.findIndex(w => w.id === id);
    if (idx !== -1) {
      WITHDRAWAL_REQUESTS[idx] = { ...WITHDRAWAL_REQUESTS[idx], status: "approved", processedDate: new Date().toISOString().split("T")[0] };
    }
  };

  const handleReject = (id) => {
    setWithdrawals(prev => prev.map(w => 
      w.id === id ? { ...w, status: "rejected" } : w
    ));
    const idx = WITHDRAWAL_REQUESTS.findIndex(w => w.id === id);
    if (idx !== -1) {
      WITHDRAWAL_REQUESTS[idx] = { ...WITHDRAWAL_REQUESTS[idx], status: "rejected" };
    }
  };

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-white">
        <div className="flex-1 p-4 sm:p-6 lg:ml-64">
          <div className="mx-auto max-w-[1200px]">
            <button
              onClick={() => onNavigate("admin-dashboard")}
              className="mb-6 text-sm font-semibold"
              style={{ color: C.primary }}
            >
              &larr; Back to dashboard
            </button>

            <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Withdrawal Requests</h1>
            <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
              Review and process tutor withdrawal requests.
            </p>

            <div className="mt-8 space-y-6">
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
                    className="rounded-lg border p-6"
                    style={{ borderColor: C.border }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <img
                          src={withdrawal.tutorImg}
                          alt={withdrawal.tutorName}
                          className="h-14 w-14 rounded-full object-cover"
                        />
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
                              {withdrawal.status === "approved" ? "Approved" : 
                               withdrawal.status === "rejected" ? "Rejected" : "Pending"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                            Requested on {withdrawal.requestedDate}
                          </p>
                          <div className="mt-2 space-y-1 text-sm" style={{ color: C.text }}>
                            <p className="flex items-center gap-2">
                              <DollarSign size={16} color={C.primary} />
                              <span className="font-semibold">৳{withdrawal.amount.toLocaleString()}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Wallet size={16} color={C.textSecondary} />
                              {withdrawal.method} · {withdrawal.accountNumber}
                            </p>
                            {withdrawal.bankName && (
                              <p className="flex items-center gap-2">
                                <Wallet size={16} color={C.textSecondary} />
                                {withdrawal.bankName} · {withdrawal.branch}
                              </p>
                            )}
                          </div>
                          {withdrawal.notes && (
                            <p className="mt-2 text-sm italic" style={{ color: C.textSecondary }}>
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
                        <div className="text-sm" style={{ color: C.textSecondary }}>
                          {withdrawal.status === "approved" && (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 size={16} />
                              Processed on {withdrawal.processedDate}
                            </span>
                          )}
                          {withdrawal.status === "rejected" && (
                            <span className="flex items-center gap-1 text-red-600">
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
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => onNavigate("tutor-dashboard")}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Withdraw Earnings</h1>
          <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>
            Request withdrawal of your pending earnings to your preferred payment method.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl border p-8 text-center bg-green-50/50 shadow-sm" style={{ borderColor: C.border }}>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Withdrawal Request Submitted!</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your request for <strong>৳{parseInt(amount).toLocaleString()}</strong> has been submitted and is pending admin approval.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <SecondaryButton onClick={() => setSubmitted(false)}>Submit Another Request</SecondaryButton>
                <PrimaryButton onClick={() => onNavigate("tutor-dashboard")}>Go to Dashboard</PrimaryButton>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 rounded-lg border p-6" style={{ borderColor: C.border, background: C.surface }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: C.textSecondary }}>Available Balance</p>
                    <p className="mt-1 text-3xl font-bold" style={{ color: C.text }}>৳{availableBalance.toLocaleString()}</p>
                  </div>
                  <Wallet size={48} color={C.primary} />
                </div>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleWithdrawSubmit}>
                <Input
                  label="Withdrawal Amount (৳)"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  max={availableBalance}
                  required
                  helper={`Maximum withdrawable: ৳${availableBalance.toLocaleString()}`}
                />

                <div>
                  <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                    Withdrawal Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["bKash", "Bank Transfer"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        className={`rounded-lg border py-3 text-sm font-semibold transition-colors ${
                          method === m ? "border-blue-600 bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                        }`}
                        style={{ borderColor: method === m ? C.primary : C.border }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Account Number"
                  placeholder={method === "bKash" ? "e.g., 01712345678" : "Bank Account Number"}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />

                {method === "Bank Transfer" && (
                  <>
                    <Input
                      label="Bank Name"
                      placeholder="e.g., Dutch-Bangla Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                    />
                    <Input
                      label="Branch Name"
                      placeholder="e.g., Dhanmondi Branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      required
                    />
                  </>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                    Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Any additional notes about this withdrawal..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2"
                    style={{ borderColor: C.border, color: C.text }}
                  />
                </div>

                <div className="flex gap-3">
                  <SecondaryButton type="button" onClick={() => onNavigate("tutor-dashboard")}>Cancel</SecondaryButton>
                  <PrimaryButton full type="submit">
                    <ArrowRight size={16} className="mr-1.5 inline" />
                    Submit Withdrawal Request
                  </PrimaryButton>
                </div>
              </form>

              <div className="mt-8 rounded-lg border p-6" style={{ borderColor: C.border }}>
                <h3 className="mb-4 text-sm font-semibold" style={{ color: C.text }}>Recent Withdrawal History</h3>
                <div className="space-y-3">
                  {withdrawals.filter(w => w.tutorId === 1).slice(0, 3).map((w) => (
                    <div key={w.id} className="flex items-center justify-between rounded-lg border p-3" style={{ borderColor: C.border }}>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.text }}>৳{w.amount.toLocaleString()}</p>
                        <p className="text-xs" style={{ color: C.textSecondary }}>{w.method} · {w.requestedDate}</p>
                      </div>
                      <Badge 
                        tone={
                          w.status === "approved" ? "success" : 
                          w.status === "rejected" ? "error" : "warning"
                        }
                      >
                        {w.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
