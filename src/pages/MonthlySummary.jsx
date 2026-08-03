import { C } from "../constants/tokens";
import { Input, PrimaryButton, SecondaryButton, Badge } from "../components/ui";
import { LESSONS, PAYMENTS, HIRED_TUTORS, TUTOR_EARNINGS, WITHDRAWAL_REQUESTS } from "../data/mockData";
import { 
  Download, FileText, Calendar, Clock, DollarSign, Star, 
  ThumbsUp, CheckCircle, MessageSquare, Trash2, UserCheck, Award,
  Wallet, ArrowRight, CheckCircle2, XCircle
} from "lucide-react";
import { useState } from "react";

const DEFAULT_REVIEWS = [
  {
    id: 1,
    tutorId: 1,
    tutorName: "Rafiq Ahmed",
    tutorImg: "https://i.pravatar.cc/150?img=12",
    subject: "Physics & Math",
    overallRating: 5,
    punctualityRating: 5,
    knowledgeRating: 5,
    communicationRating: 5,
    comment: "Rafiq Sir is an exceptional tutor. He broke down complex Newton's laws of motion into simple real-world examples. My son's Physics score jumped from 65% to 88% in the mid-term exams!",
    recommend: true,
    date: "2026-07-22",
    status: "Published"
  },
  {
    id: 2,
    tutorId: 2,
    tutorName: "Farhana Islam",
    tutorImg: "https://i.pravatar.cc/150?img=32",
    subject: "English & Bangla",
    overallRating: 5,
    punctualityRating: 5,
    knowledgeRating: 4,
    communicationRating: 5,
    comment: "Farhana Miss has helped my daughter build great confidence in English essay writing and grammar. She is always punctual and polite.",
    recommend: true,
    date: "2026-07-15",
    status: "Published"
  }
];

export function MonthlySummary({ onNavigate, role = "parent" }) {
  const isTutor = role === "tutor";
  const backLink = isTutor ? "tutor-dashboard" : "parent-dashboard";

  const [reviewsList, setReviewsList] = useState(DEFAULT_REVIEWS);

  // Safe tutor list fallback
  const tutorOptions = Array.isArray(HIRED_TUTORS) && HIRED_TUTORS.length > 0 
    ? HIRED_TUTORS 
    : [
        { id: 1, tutorId: 1, tutorName: "Rafiq Ahmed", tutorImg: "https://i.pravatar.cc/150?img=12", subjects: ["Physics", "Math"], fee: 900, totalLessons: 18 },
        { id: 2, tutorId: 2, tutorName: "Farhana Islam", tutorImg: "https://i.pravatar.cc/150?img=32", subjects: ["English", "Bangla"], fee: 700, totalLessons: 8 }
      ];

  // Form State for Rating a Tutor
  const [selectedTutorId, setSelectedTutorId] = useState(tutorOptions[0]?.tutorId || 1);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [punctuality, setPunctuality] = useState(5);
  const [knowledge, setKnowledge] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Withdrawal logic merged
  const [activeTab, setActiveTab] = useState("earnings"); // "earnings" or "withdrawal"
  const [withdrawals, setWithdrawals] = useState(WITHDRAWAL_REQUESTS);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bKash");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

  const rawLessons = Array.isArray(LESSONS) ? LESSONS : [];
  const monthLessons = isTutor ? [
    { id: 1, date: "2026-07-02", studentName: "Abdul Rahman (Class 10)", tutorName: "Rafiq Ahmed", subject: "Physics", topic: "Kinematics & Motion", duration: "1.5 hrs", fee: 1000 },
    { id: 2, date: "2026-07-05", studentName: "Abdul Rahman (Class 10)", tutorName: "Rafiq Ahmed", subject: "Physics", topic: "Newton's Laws", duration: "1.5 hrs", fee: 1000 },
    { id: 3, date: "2026-07-10", studentName: "Tanvir R. (Class 8)", tutorName: "Farhana Islam", subject: "English", topic: "Grammar & Composition", duration: "1.0 hrs", fee: 500 },
  ] : rawLessons.filter(l => l && l.date && l.date.startsWith("2026-07"));

  const monthTotal = monthLessons.reduce((acc, l) => acc + (l.fee || 0), 0);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const targetTutor = tutorOptions.find(t => t.tutorId === Number(selectedTutorId)) || tutorOptions[0];
    const tutorSubjects = Array.isArray(targetTutor.subjects) ? targetTutor.subjects.join(" & ") : (targetTutor.subjects || "Tuition");

    const newRev = {
      id: Date.now(),
      tutorId: targetTutor.tutorId || 1,
      tutorName: targetTutor.tutorName || "Tutor",
      tutorImg: targetTutor.tutorImg || "https://i.pravatar.cc/150?img=12",
      subject: tutorSubjects,
      overallRating: rating || 5,
      punctualityRating: punctuality || 5,
      knowledgeRating: knowledge || 5,
      communicationRating: communication || 5,
      comment: comment.trim() || "Great teaching performance and very helpful overall.",
      recommend: recommend,
      date: new Date().toISOString().split("T")[0],
      status: "Published"
    };

    setReviewsList([newRev, ...reviewsList]);
    setComment("");
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const handleDeleteReview = (id) => {
    setReviewsList(reviewsList.filter(r => r.id !== id));
  };

  const handleNavBack = () => {
    if (typeof onNavigate === "function") {
      onNavigate(backLink);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const avgRating = reviewsList.length > 0 
    ? (reviewsList.reduce((a, b) => a + (b.overallRating || 0), 0) / reviewsList.length).toFixed(1) 
    : "0.0";

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Back button & Page Header */}
          <div>
            <button
              onClick={handleNavBack}
              className="mb-4 text-sm font-semibold transition-colors hover:underline"
              style={{ color: C.primary }}
            >
              &larr; Back to dashboard
            </button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5" style={{ borderColor: C.border }}>
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: C.text }}>
                  {isTutor ? "My Earnings, Summary & Reviews" : "Monthly Summary & Tutor Ratings"}
                </h1>
                <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                  {isTutor 
                    ? "View student reviews, overall rating metrics, and monthly financial summaries."
                    : "Complete lesson summary, rate your active tutors, and view submitted feedback history."}
                </p>
              </div>
              <PrimaryButton onClick={handleDownloadPDF}>
                <Download size={16} className="mr-1.5 inline" />
                Download Statement
              </PrimaryButton>
            </div>
          </div>

          {isTutor && (
            <div className="flex gap-4 border-b pb-px" style={{ borderColor: C.border }}>
              <button
                onClick={() => setActiveTab("earnings")}
                className={`pb-3 text-sm font-semibold border-b-2 px-1 transition-all ${
                  activeTab === "earnings"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-600"
                }`}
                style={{ borderColor: activeTab === "earnings" ? C.primary : "transparent", color: activeTab === "earnings" ? C.primary : undefined }}
              >
                Earnings Statement & Reviews
              </button>
              <button
                onClick={() => setActiveTab("withdrawal")}
                className={`pb-3 text-sm font-semibold border-b-2 px-1 transition-all ${
                  activeTab === "withdrawal"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-600"
                }`}
                style={{ borderColor: activeTab === "withdrawal" ? C.primary : "transparent", color: activeTab === "withdrawal" ? C.primary : undefined }}
              >
                Withdraw Funds
              </button>
            </div>
          )}

          {isTutor && activeTab === "withdrawal" ? (
            <div className="space-y-6 animate-fade-in">
              {submitted ? (
                <div className="rounded-2xl border p-8 text-center bg-green-50/50 shadow-sm" style={{ borderColor: C.border }}>
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
                  <div className="rounded-xl border p-6 shadow-sm bg-white" style={{ borderColor: C.border }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.textSecondary }}>Available Balance</p>
                        <p className="mt-1 text-3xl font-bold text-blue-600">৳{availableBalance.toLocaleString()}</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Wallet size={24} />
                      </div>
                    </div>
                  </div>

                  <form className="rounded-xl border bg-white p-5 sm:p-8 shadow-sm space-y-6" style={{ borderColor: C.border }} onSubmit={handleWithdrawSubmit}>
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
                            className={`rounded-lg border py-3 text-sm font-semibold transition-all ${
                              method === m ? "border-blue-600 bg-blue-50 text-blue-600 shadow-sm" : "hover:bg-gray-50 border-gray-200"
                            }`}
                            style={{ borderColor: method === m ? C.primary : undefined }}
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
                      <div className="space-y-6">
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
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                        Notes (Optional)
                      </label>
                      <textarea
                        placeholder="Any additional notes about this withdrawal request..."
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2 focus:ring-blue-100"
                        style={{ borderColor: C.border, color: C.text }}
                      />
                    </div>

                    <div className="flex gap-3 pt-3 border-t" style={{ borderColor: C.border }}>
                      <SecondaryButton type="button" onClick={() => onNavigate("tutor-dashboard")}>Cancel</SecondaryButton>
                      <PrimaryButton full type="submit">
                        <ArrowRight size={16} className="mr-1.5 inline" />
                        Submit Withdrawal Request
                      </PrimaryButton>
                    </div>
                  </form>

                  <div className="rounded-xl border bg-white p-5 sm:p-8 shadow-sm" style={{ borderColor: C.border }}>
                    <h3 className="mb-4 text-sm font-semibold" style={{ color: C.text }}>Recent Withdrawal History</h3>
                    <div className="space-y-3">
                      {withdrawals.filter(w => w.tutorId === 1).map((w) => (
                        <div key={w.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50/50 transition-colors" style={{ borderColor: C.border }}>
                          <div>
                            <p className="text-sm font-bold" style={{ color: C.text }}>৳{w.amount.toLocaleString()}</p>
                            <p className="text-xs mt-0.5" style={{ color: C.textSecondary }}>{w.method} · {w.requestedDate}</p>
                          </div>
                          <Badge 
                            tone={
                              w.status === "approved" ? "success" : 
                              w.status === "rejected" ? "error" : "warning"
                            }
                          >
                            {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              {/* SECTION 1: MONTHLY LESSON SUMMARY & STATEMENT */}
          <div className="rounded-xl border bg-white p-5 sm:p-8 shadow-sm" style={{ borderColor: C.border }}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2" style={{ borderColor: C.border }}>
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: C.text }}>
                  <FileText size={20} className="text-blue-600" />
                  Monthly Lesson Summary Report
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textSecondary }}>
                  July 2026 · {isTutor ? "Tutor Earnings Statement" : "Parent Lesson Statement"}
                </p>
              </div>
              <Badge tone="info">July 2026</Badge>
            </div>

            {/* Summary Totals Cards */}
            <div className="mb-6 grid grid-cols-3 gap-2 rounded-xl p-4 sm:gap-4" style={{ background: C.surface }}>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>Total Lessons</p>
                <p className="mt-1 text-xl font-bold sm:text-2xl" style={{ color: C.text }}>
                  {monthLessons.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>Total Hours</p>
                <p className="mt-1 text-xl font-bold sm:text-2xl" style={{ color: C.text }}>
                  4.0 hrs
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>{isTutor ? "Net Earnings" : "Total Tuition Fee"}</p>
                <p className="mt-1 text-xl font-bold sm:text-2xl text-blue-600">
                  ৳{monthTotal}
                </p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold" style={{ color: C.text }}>
                {isTutor ? "Completed Lessons Log" : "Itemized Completed Lessons"}
              </h3>
              <div className="overflow-x-auto rounded-lg border" style={{ borderColor: C.border }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50/80" style={{ borderColor: C.border }}>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>{isTutor ? "Student" : "Tutor"}</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Subject</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Topic</th>
                      <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: C.textSecondary }}>Duration</th>
                      <th className="px-4 py-3 text-right font-semibold text-xs" style={{ color: C.textSecondary }}>{isTutor ? "Earnings" : "Fee"}</th>
                      <th className="px-4 py-3 text-center font-semibold text-xs" style={{ color: C.textSecondary }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthLessons.map((lesson) => (
                      <tr key={lesson.id || Math.random()} className="border-b hover:bg-gray-50/50" style={{ borderColor: C.border }}>
                        <td className="px-4 py-3 font-medium" style={{ color: C.text }}>{lesson.date || "2026-07-20"}</td>
                        <td className="px-4 py-3" style={{ color: C.text }}>{isTutor ? (lesson.studentName || "Student") : (lesson.tutorName || "Tutor")}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: C.text }}>{lesson.subject || "Subject"}</td>
                        <td className="px-4 py-3 text-gray-600" style={{ color: C.textSecondary }}>{lesson.topic || "General"}</td>
                        <td className="px-4 py-3" style={{ color: C.textSecondary }}>{lesson.duration || "1 hour"}</td>
                        <td className="px-4 py-3 text-right font-bold" style={{ color: C.text }}>
                          ৳{lesson.fee || 0}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => alert(`Viewing details for lesson on ${lesson.date || "2026-07-20"}`)}
                            className="rounded-md border px-3 py-1 text-xs font-semibold transition-colors hover:bg-gray-50"
                            style={{ borderColor: C.border, color: C.primary }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50/90 font-bold">
                      <td colSpan={6} className="px-4 py-3 text-right" style={{ color: C.text }}>
                        Total Billing Amount
                      </td>
                      <td className="px-4 py-3 text-right text-base text-blue-600">
                        ৳{monthTotal}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Policy Box */}
            <div className="rounded-lg border p-4 bg-blue-50/40" style={{ borderColor: C.border }}>
              <div className="flex items-start gap-3">
                <FileText size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold" style={{ color: C.text }}>Verification & Payout Policy</p>
                  <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">
                    {isTutor 
                      ? "Earnings are automatically calculated based on confirmed lesson logs. Payouts are transferred to your bKash/Bank account at month end."
                      : "Lessons are logged by tutors and verified by parents. Payments are processed securely with automated monthly invoice generation."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: RATE A TUTOR FORM (For Parent Role) */}
          {!isTutor && (
            <div className="rounded-xl border bg-white p-5 sm:p-8 shadow-sm" style={{ borderColor: C.border }}>
              <div className="mb-6 border-b pb-4" style={{ borderColor: C.border }}>
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: C.text }}>
                  <Star size={20} className="text-amber-500" fill={C.warning} />
                  Rate Your Hired Tutor
                </h2>
                <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                  Evaluate performance, punctuality, subject knowledge, and teaching quality.
                </p>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* Select Tutor */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: C.text }}>
                    Select Hired Tutor
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tutorOptions.map((tutor) => {
                      const selected = Number(selectedTutorId) === tutor.tutorId;
                      const subjectsStr = Array.isArray(tutor.subjects) ? tutor.subjects.join(", ") : (tutor.subjects || "Subjects");
                      return (
                        <div
                          key={tutor.id || tutor.tutorId}
                          onClick={() => setSelectedTutorId(tutor.tutorId)}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            selected ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20" : "hover:bg-gray-50"
                          }`}
                          style={{ borderColor: selected ? C.primary : C.border }}
                        >
                          <img src={tutor.tutorImg || "https://i.pravatar.cc/150?img=12"} alt={tutor.tutorName} className="h-11 w-11 rounded-full object-cover border" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: C.text }}>{tutor.tutorName}</p>
                            <p className="text-xs truncate" style={{ color: C.textSecondary }}>{subjectsStr}</p>
                            <p className="text-[11px] text-green-600 font-medium">৳{tutor.fee || 0}/hr · {tutor.totalLessons || 0} lessons</p>
                          </div>
                          {selected && <CheckCircle size={18} className="text-blue-600 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Overall Rating Stars */}
                <div className="rounded-lg border p-4" style={{ background: C.surface, borderColor: C.border }}>
                  <label className="block text-sm font-semibold mb-2" style={{ color: C.text }}>
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            fill={active ? C.warning : "none"}
                            color={active ? C.warning : "#cbd5e1"}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-3 text-sm font-bold" style={{ color: C.text }}>
                      {rating === 5 ? "5.0 - Excellent" : rating === 4 ? "4.0 - Good" : rating === 3 ? "3.0 - Average" : rating === 2 ? "2.0 - Poor" : "1.0 - Very Poor"}
                    </span>
                  </div>
                </div>

                {/* Detailed Criteria Scores */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3" style={{ borderColor: C.border }}>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Punctuality</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setPunctuality(val)}
                          className={`flex-1 py-1 rounded text-xs font-semibold border ${
                            punctuality >= val ? "bg-amber-500 text-white border-amber-500" : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {val}★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border p-3" style={{ borderColor: C.border }}>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Subject Mastery</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setKnowledge(val)}
                          className={`flex-1 py-1 rounded text-xs font-semibold border ${
                            knowledge >= val ? "bg-amber-500 text-white border-amber-500" : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {val}★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border p-3" style={{ borderColor: C.border }}>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Communication</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCommunication(val)}
                          className={`flex-1 py-1 rounded text-xs font-semibold border ${
                            communication >= val ? "bg-amber-500 text-white border-amber-500" : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {val}★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: C.text }}>
                    Detailed Comments & Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe how the tutor teaches, student's academic progress, punctuality, and overall satisfaction..."
                    className="w-full rounded-lg border p-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                    style={{ borderColor: C.border }}
                    required
                  />
                </div>

                {/* Recommendation Checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recommend}
                    onChange={(e) => setRecommend(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium" style={{ color: C.text }}>
                    I recommend this tutor to other parents and students
                  </span>
                </label>

                {/* Submit Action */}
                <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: C.border }}>
                  <PrimaryButton type="submit">
                    <Star size={16} className="mr-1.5 inline" fill="white" />
                    Submit Review
                  </PrimaryButton>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 3: REVIEWS & FEEDBACK HISTORY */}
          <div className="rounded-xl border bg-white p-5 sm:p-8 shadow-sm space-y-6" style={{ borderColor: C.border }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2" style={{ borderColor: C.border }}>
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: C.text }}>
                  <MessageSquare size={20} className="text-blue-600" />
                  {isTutor ? "Student & Parent Reviews" : "Submitted Reviews & Ratings"}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.textSecondary }}>
                  {isTutor 
                    ? "Feedback and rating history received from your assigned students and parents."
                    : "History of reviews and evaluation scores you have published for your tutors."}
                </p>
              </div>
            </div>

            {/* Summary Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border p-4 text-center bg-gray-50/50" style={{ borderColor: C.border }}>
                <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: C.textSecondary }}>Total Reviews</p>
                <p className="mt-1 text-2xl font-bold" style={{ color: C.text }}>{reviewsList.length}</p>
              </div>
              <div className="rounded-xl border p-4 text-center bg-gray-50/50" style={{ borderColor: C.border }}>
                <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: C.textSecondary }}>Avg Rating</p>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <Star size={20} fill={C.warning} color={C.warning} />
                  <span className="text-2xl font-bold" style={{ color: C.text }}>
                    {avgRating}
                  </span>
                </div>
              </div>
              <div className="rounded-xl border p-4 text-center bg-gray-50/50" style={{ borderColor: C.border }}>
                <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: C.textSecondary }}>Recommendation Rate</p>
                <div className="mt-1 flex items-center justify-center gap-1.5 text-green-600">
                  <ThumbsUp size={18} />
                  <span className="text-2xl font-bold">100%</span>
                </div>
              </div>
            </div>

            {/* Review Cards List */}
            <div className="space-y-4">
              {reviewsList.length === 0 ? (
                <div className="rounded-xl border p-8 text-center bg-white" style={{ borderColor: C.border }}>
                  <MessageSquare size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-semibold" style={{ color: C.text }}>No reviews submitted yet</p>
                  <p className="text-xs mt-1" style={{ color: C.textSecondary }}>Use the evaluation form above to rate your tutors.</p>
                </div>
              ) : (
                reviewsList.map((rev) => (
                  <div key={rev.id || Math.random()} className="rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md" style={{ borderColor: C.border }}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={rev.tutorImg || "https://i.pravatar.cc/150?img=12"} alt={rev.tutorName} className="h-11 w-11 rounded-full object-cover border" />
                        <div>
                          <h3 className="text-base font-semibold" style={{ color: C.text }}>{rev.tutorName || "Tutor"}</h3>
                          <p className="text-xs" style={{ color: C.textSecondary }}>{rev.subject || "Subject"}</p>
                          <div className="mt-1 flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < (rev.overallRating || 5) ? C.warning : "none"}
                                color={i < (rev.overallRating || 5) ? C.warning : "#cbd5e1"}
                              />
                            ))}
                            <span className="ml-1 text-xs font-bold" style={{ color: C.text }}>
                              {(rev.overallRating || 5)}.0
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge tone="success">
                          <CheckCircle size={12} className="mr-1 inline" /> Verified Review
                        </Badge>
                        {!isTutor && (
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete review"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed" style={{ color: C.text }}>
                      "{rev.comment || ""}"
                    </p>

                    {/* Criteria breakdown tags */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t text-xs" style={{ borderColor: C.border, color: C.textSecondary }}>
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium">Punctuality: {rev.punctualityRating || 5}/5 ★</span>
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium">Knowledge: {rev.knowledgeRating || 5}/5 ★</span>
                      <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium">Communication: {rev.communicationRating || 5}/5 ★</span>
                      <span className="ml-auto text-[11px] text-gray-400">Reviewed on {rev.date || "2026-07-22"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

            {/* Bottom Action Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: C.border }}>
              <SecondaryButton onClick={handleNavBack}>
                Back to Dashboard
              </SecondaryButton>
              <PrimaryButton onClick={handleDownloadPDF}>
                <Download size={16} className="mr-1.5 inline" />
                Download Statement
              </PrimaryButton>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
  );
}
