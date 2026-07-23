import { Mail, Phone } from "lucide-react";
import { C } from "../../constants/tokens";

export function Footer() {
  const col = (title, items) => (
    <div>
      <h4 className="mb-3 text-sm font-semibold" style={{ color: C.text }}>{title}</h4>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="text-sm" style={{ color: C.textSecondary }}>{i}</li>
        ))}
      </ul>
    </div>
  );
  return (
    <footer className="border-t" style={{ borderColor: C.border, background: C.surface }}>
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {col("Platform", ["Find tutors", "Post a request", "How it works", "Pricing"])}
          {col("Company", ["About", "FAQ", "Contact", "Careers"])}
          {col("Roles", ["For parents", "For tutors", "For admins"])}
          <div>
            <h4 className="mb-3 text-sm font-semibold" style={{ color: C.text }}>Contact</h4>
            <p className="flex items-center gap-2 text-sm" style={{ color: C.textSecondary }}><Mail size={14} /> support@tutorhub.bd</p>
            <p className="mt-2 flex items-center gap-2 text-sm" style={{ color: C.textSecondary }}><Phone size={14} /> +880 1XXX-XXXXXX</p>
          </div>
        </div>
        <div className="mt-10 h-px" style={{ background: C.border }} />
        <p className="mt-6 text-xs" style={{ color: C.textSecondary }}>&copy; 2026 TutorHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
