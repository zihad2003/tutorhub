import { C } from "../../constants/tokens";

export function PrimaryButton({ children, onClick, full, size = "md" }) {
  const pad = size === "sm" ? "px-3.5 py-1.5 text-sm" : "px-5 py-2.5 text-sm";
  return (
    <button
      onClick={onClick}
      className={`rounded-lg font-semibold text-white transition-colors duration-150 ${pad} ${full ? "w-full" : ""}`}
      style={{ background: C.primary }}
      onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
    >
      {children}
    </button>
  );
}
