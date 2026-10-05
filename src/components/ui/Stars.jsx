import { Star } from "lucide-react";
import { C } from "../../constants/tokens";

export function Stars({ rating }) {
  const value = Number(rating);
  const shown = Number.isFinite(value) ? value.toFixed(1) : "0.0";
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={14} fill={C.warning} color={C.warning} />
      <span className="text-sm font-semibold" style={{ color: C.text }}>{shown}</span>
    </span>
  );
}
