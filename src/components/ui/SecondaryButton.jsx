import { C } from "../../constants/tokens";

export function SecondaryButton({ children, onClick, full, size = "md", type = "button", ...props }) {
  const pad = size === "sm" ? "px-3.5 py-1.5 text-sm" : "px-5 py-2.5 text-sm";
  return (
    <button
      type={type}
      onClick={onClick}
      {...props}
      className={`rounded-lg font-semibold border transition-colors duration-150 ${pad} ${full ? "w-full" : ""} ${props.className || ""}`}
      style={{ borderColor: C.border, color: C.text, background: C.bg, ...props.style }}
      onMouseEnter={(e) => (e.currentTarget.style.background = C.surface)}
      onMouseLeave={(e) => (e.currentTarget.style.background = C.bg)}
    >
      {children}
    </button>
  );
}
