import { C } from "../../constants/tokens";

export function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: C.surface, color: C.textSecondary },
    accent: { bg: "#EDE9FE", color: C.accent },
    success: { bg: "#D1FAE5", color: "#047857" },
    warning: { bg: "#FEF3C7", color: "#B45309" },
    info: { bg: "#E0F2FE", color: "#0369A1" },
    danger: { bg: "#FEE2E2", color: "#B91C1C" },
    error: { bg: "#FEE2E2", color: "#B91C1C" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span
      style={{ background: t.bg, color: t.color }}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
    >
      {children}
    </span>
  );
}
