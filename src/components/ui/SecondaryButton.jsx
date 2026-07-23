import { C } from "../../constants/tokens";

export function SecondaryButton({ children, onClick, full, size = "md" }) {
  const pad = size === "sm" ? "px-3.5 py-1.5 text-sm" : "px-5 py-2.5 text-sm";
  return (
    <button
      onClick={onClick}
      className={`rounded-lg font-semibold border transition-colors duration-150 ${pad} ${full ? "w-full" : ""}`}
      style={{ borderColor: C.border, color: C.text, background: C.bg }}
      onMouseEnter={(e) => (e.currentTarget.style.background = C.surface)}
      onMouseLeave={(e) => (e.currentTarget.style.background = C.bg)}
    >
      {children}
    </button>
  );
}
