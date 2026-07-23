import { Mail, Phone } from "lucide-react";
import { C } from "../../constants/tokens";

export function Footer({ go, userRole }) {
  const handleNav = (target) => {
    if (typeof go === "function") {
      go(target);
    }
  };

  return (
    <footer className="border-t" style={{ borderColor: C.border, background: C.surface }}>
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          
          {/* Platform */}
          <div>
            <h4 className="mb-3 text-sm font-semibold" style={{ color: C.text }}>Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav("tutors")} className="transition-colors hover:text-blue-600" style={{ color: C.textSecondary }}>
                  Find tutors
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("post-request")} className="transition-colors hover:text-blue-600" style={{ color: C.textSecondary }}>
                  Post a request
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("home")} className="transition-colors hover:text-blue-600" style={{ color: C.textSecondary }}>
                  How it works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("tutors")} className="transition-colors hover:text-blue-600" style={{ color: C.textSecondary }}>
                  Pricing & Tutors
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold" style={{ color: C.text }}>Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav("about")} className="transition-colors hover:text-blue-600" style={{ color: C.textSecondary }}>
                  About TutorHub
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("faq")} className="transition-colors hover:text-blue-600" style={{ color: C.textSecondary }}>
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("contact")} className="transition-colors hover:text-blue-600" style={{ color: C.textSecondary }}>
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("careers")} className="transition-colors hover:text-blue-600" style={{ color: C.textSecondary }}>
                  Careers
                </button>
              </li>
            </ul>
          </div>

          {/* Roles & Portals */}
          <div>
            <h4 className="mb-3 text-sm font-semibold" style={{ color: C.text }}>Roles & Portals</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav(userRole === "parent" ? "parent-dashboard" : "auth")} className="transition-colors hover:text-blue-600" style={{ color: C.textSecondary }}>
                  For Parents / Students
                </button>
              </li>
              <li>
                <button onClick={() => handleNav(userRole === "tutor" ? "tutor-dashboard" : "auth")} className="transition-colors hover:text-blue-600" style={{ color: C.textSecondary }}>
                  For Tutors
                </button>
              </li>
              <li>
                <button onClick={() => handleNav(userRole === "admin" ? "admin-dashboard" : "auth")} className="transition-colors hover:text-blue-600" style={{ color: C.textSecondary }}>
                  For Admins
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
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