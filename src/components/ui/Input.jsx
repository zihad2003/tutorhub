import { C } from "../../constants/tokens";

export function Input({ label, type = "text", placeholder, helper, error, value, onChange, required, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>{label}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? "true" : undefined}
        {...props}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2 ${props.className || ""}`}
        style={{ borderColor: error ? C.error : C.border, color: C.text, ...props.style, ...(error ? { borderColor: C.error } : {}) }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? C.error : C.primary}33`)}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
          props.onBlur?.(e);
        }}
      />
      {error ? (
        <span className="mt-1 block text-xs" style={{ color: C.error }}>{error}</span>
      ) : helper ? (
        <span className="mt-1 block text-xs" style={{ color: C.textSecondary }}>{helper}</span>
      ) : null}
    </label>
  );
}
