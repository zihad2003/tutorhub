import { useEffect, useState } from "react";
import { C } from "../constants/tokens";
import { StatCard } from "../components/ui/StatCard";
import { Table } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { TrendingUp, Users, DollarSign, BookOpen } from "lucide-react";
import { fetchFromAPI } from "../api";

export function Reports({ onNavigate }) {
  const [filterType, setFilterType] = useState("single");
  const [singleMonth, setSingleMonth] = useState("All");
  const [startMonth, setStartMonth] = useState("All");
  const [endMonth, setEndMonth] = useState("All");
  const [payments, setPayments] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [realLessons, setRealLessons] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchFromAPI("/payments").catch(() => null),
      fetchFromAPI("/withdrawal_requests").catch(() => null),
      fetchFromAPI("/lessons").catch(() => null),
    ]).then(([paymentRows, withdrawalRows, lessonRows]) => {
      if (cancelled) return;
      if (Array.isArray(paymentRows)) {
        setPayments(paymentRows.map((row) => ({
          ...row,
          totalAmount: Number(row.totalAmount) || 0,
        })));
      }
      if (Array.isArray(withdrawalRows)) {
        setPayouts(withdrawalRows.filter((row) => row.status === "approved"));
      }
      if (Array.isArray(lessonRows)) {
        setRealLessons(lessonRows.filter((row) => row.parentId && ["confirmed", "completed"].includes(row.status)).length);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const getMonthValue = (monthStr) => {
    if (!monthStr || monthStr === "All") return -1;
    const [m, y] = monthStr.split(" ");
    return parseInt(y) * 12 + monthNames.indexOf(m);
  };

  const filteredPayments = payments.filter(p => {
    if (filterType === "single") {
      return singleMonth === "All" || p.month === singleMonth;
    } else {
      const pVal = getMonthValue(p.month);
      const fromVal = getMonthValue(startMonth);
      const toVal = getMonthValue(endMonth);
      
      if (fromVal !== -1 && pVal < fromVal) return false;
      if (toVal !== -1 && pVal > toVal) return false;
      return true;
    }
  });

  const paidTotal = filteredPayments.filter(p => p.status === "paid").reduce((acc, p) => acc + (Number(p.totalAmount) || 0), 0);
  const pendingTotal = filteredPayments.filter(p => p.status === "pending").reduce((acc, p) => acc + (Number(p.totalAmount) || 0), 0);
  const tutorPayouts = payouts.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const platformBalance = paidTotal - tutorPayouts;
  const ledgerAccounts = new Set(payments.flatMap((row) => [row.parentName, row.tutorName].filter(Boolean))).size;
  const uniqueMonths = ["All", ...new Set(payments.map(p => p.month).filter(Boolean))];

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

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Platform Reports & Analytics</h1>
          <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
            Detailed breakdown of revenue, lesson metrics, user growth, and performance logs.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Parent Payments Received"
              value={`৳${paidTotal}`}
              icon={DollarSign}
            />
            <StatCard
              label="Awaiting Parent Payment"
              value={`৳${pendingTotal}`}
              icon={DollarSign}
            />
            <StatCard
              label="Tutor Payouts"
              value={`৳${tutorPayouts}`}
              icon={TrendingUp}
            />
            <StatCard
              label="Platform Balance"
              value={`৳${platformBalance}`}
              icon={DollarSign}
            />
            <StatCard
              label="Completed Lessons"
              value={String(realLessons)}
              icon={BookOpen}
            />
            <StatCard
              label="Active Users"
              value={String(ledgerAccounts)}
              icon={Users}
            />
          </div>

          <div className="mt-8 rounded-lg border p-6 shadow-sm" style={{ borderColor: C.border }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: C.text }}>Monthly Revenue & Payout Logs</h2>
                <p className="mt-1 text-xs" style={{ color: C.textSecondary }}>Audited financial records across all tutors and parents</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded-lg border py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium"
                  style={{ borderColor: C.border, color: C.textSecondary }}
                >
                  <option value="single">Single Month</option>
                  <option value="range">Month Range</option>
                </select>

                {filterType === "single" ? (
                  <select
                    value={singleMonth}
                    onChange={(e) => setSingleMonth(e.target.value)}
                    className="rounded-lg border py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    style={{ borderColor: C.border, color: C.text }}
                  >
                    <option value="All">All Months</option>
                    {uniqueMonths.filter(m => m !== "All").map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                ) : (
                  <>
                    <select
                      value={startMonth}
                      onChange={(e) => setStartMonth(e.target.value)}
                      className="rounded-lg border py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      style={{ borderColor: C.border, color: C.text }}
                    >
                      <option value="All">From: All</option>
                      {uniqueMonths.filter(m => m !== "All").map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <span className="text-gray-400 text-sm">to</span>
                    <select
                      value={endMonth}
                      onChange={(e) => setEndMonth(e.target.value)}
                      className="rounded-lg border py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      style={{ borderColor: C.border, color: C.text }}
                    >
                      <option value="All">To: All</option>
                      {uniqueMonths.filter(m => m !== "All").map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Table
                columns={[
                  { key: "parentName", label: "Parent" },
                  { key: "tutorName", label: "Tutor" },
                  { key: "month", label: "Billing Month" },
                  { key: "totalAmount", label: "Amount", render: (val) => `৳${Number(val || 0).toLocaleString("en-US")}` },
                  { key: "status", label: "Status", render: (status) => (
                    <Badge tone={status === "paid" ? "success" : "warning"}>{status}</Badge>
                  )},
                ]}
                data={filteredPayments}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
