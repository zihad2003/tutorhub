import { C } from "../constants/tokens";
import { StatCard } from "../components/ui/StatCard";
import { Table } from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { TrendingUp, Users, DollarSign, BookOpen } from "lucide-react";
import { PAYMENTS } from "../data/mockData";

export function Reports({ onNavigate }) {
  const totalRevenue = PAYMENTS.filter(p => p.status === "paid").reduce((acc, p) => acc + p.totalAmount, 0);

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
              label="Gross Revenue"
              value={`৳${totalRevenue}`}
              icon={DollarSign}
              trend={{ value: "+18%", positive: true }}
            />
            <StatCard
              label="Platform Commission (10%)"
              value={`৳${Math.round(totalRevenue * 0.1)}`}
              icon={TrendingUp}
              trend={{ value: "+15%", positive: true }}
            />
            <StatCard
              label="Completed Lessons"
              value="142"
              icon={BookOpen}
              trend={{ value: "+24", positive: true }}
            />
            <StatCard
              label="Active Users"
              value="498"
              icon={Users}
              trend={{ value: "+40", positive: true }}
            />
          </div>

          <div className="mt-8 rounded-lg border p-6 shadow-sm" style={{ borderColor: C.border }}>
            <h2 className="text-lg font-semibold" style={{ color: C.text }}>Monthly Revenue & Payout Logs</h2>
            <p className="mt-1 text-xs" style={{ color: C.textSecondary }}>Audited financial records across all tutors and parents</p>
            <div className="mt-4">
              <Table
                columns={[
                  { key: "id", label: "Transaction ID", render: (id) => `#TXN-${id}` },
                  { key: "month", label: "Billing Month" },
                  { key: "totalLessons", label: "Lessons Taught" },
                  { key: "totalAmount", label: "Gross Volume", render: (val) => `৳${val}` },
                  { key: "status", label: "Payout Status", render: (status) => (
                    <Badge tone={status === "paid" ? "success" : "warning"}>{status}</Badge>
                  )},
                ]}
                data={PAYMENTS}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
