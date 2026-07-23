import { C } from "../../constants/tokens";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: C.text }}>{title}</h2>
          <button
            onClick={onClose}
            className="rounded p-1 transition-colors duration-150 hover:bg-gray-100"
          >
            <X size={20} color={C.textSecondary} />
          </button>
        </div>
        <div className="mt-4">
          {children}
        </div>
        {footer && (
          <div className="mt-6 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
