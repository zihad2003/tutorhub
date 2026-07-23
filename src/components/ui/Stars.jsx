import { Star } from "lucide-react";
import { C } from "../../constants/tokens";

export function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={14} fill={C.warning} color={C.warning} />
      <span className="text-sm font-semibold" style={{ color: C.text }}>{rating.toFixed(1)}</span>
    </span>
  );
}
