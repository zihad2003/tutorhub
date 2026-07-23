import { C } from "../../constants/tokens";

export function StatCard({ label, value, icon: Icon, trend }) {
  return (
    <div className="rounded-lg border bg-white p-5" style={{ borderColor: C.border }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm" style={{ color: C.textSecondary }}>{label}</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: C.text }}>{value}</p>
          {trend && (
            <p className="mt-1 text-xs" style={{ color: trend.positive ? C.success : C.error }}>
              {trend.positive ? "+" : ""}{trend.value} from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: C.surface }}>
            <Icon size={20} color={C.primary} />
          </div>
        )}
      </div>
    </div>
  );
}
