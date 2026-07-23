import { C } from "../../constants/tokens";

export function TextButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-sm font-semibold transition-colors duration-150"
      style={{ color: C.primary }}
    >
      {children}
    </button>
  );
}
