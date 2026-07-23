import { C } from "../../constants/tokens";

export function Input({ label, type = "text", placeholder, helper }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2"
        style={{ borderColor: C.border, color: C.text }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primary}33`)}
        onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
      />
      {helper && <span className="mt-1 block text-xs" style={{ color: C.textSecondary }}>{helper}</span>}
    </label>
  );
}
