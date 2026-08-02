import { C } from "../../constants/tokens";

export function PrimaryButton({ children, onClick, full, size = "md", type = "button", ...props }) {
  const pad = size === "sm" ? "px-3.5 py-1.5 text-sm" : "px-5 py-2.5 text-sm";
  return (
    <button
      type={type}
      onClick={onClick}
      {...props}
      className={`rounded-lg font-semibold text-white transition-colors duration-150 ${pad} ${full ? "w-full" : ""} ${props.className || ""}`}
      style={{ background: C.primary, ...props.style }}
      onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
    >
      {children}
    </button>
  );
}
