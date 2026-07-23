import { C } from "../../constants/tokens";

export function TextButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-sm font-semibold transition-all duration-150 text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
    >
      {children}
    </button>
  );
}
