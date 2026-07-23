import { C } from "../../constants/tokens";
import { 
  LayoutDashboard, User, UserPlus, FileText, Calendar, DollarSign, 
  MessageSquare, Star, Settings, GraduationCap, Shield, Users,
  CheckCircle
} from "lucide-react";

const PARENT_LINKS = [
  { key: "parent-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "post-request", label: "Post Request", icon: UserPlus },
  { key: "applications", label: "Applications", icon: FileText },
  { key: "hired-tutors", label: "Hired Tutors", icon: Users },
  { key: "lessons", label: "Lessons", icon: Calendar },
  { key: "payments", label: "Payments", icon: DollarSign },
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "settings", label: "Settings", icon: Settings },
];

const TUTOR_LINKS = [
  { key: "tutor-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "tutor-profile", label: "Profile", icon: User },
  { key: "certificates", label: "Certificates", icon: FileText },
  { key: "availability", label: "Availability", icon: Calendar },
  { key: "requests", label: "Requests", icon: UserPlus },
  { key: "tutor-applications", label: "Applications", icon: FileText },
  { key: "tutor-lessons", label: "Lessons", icon: Calendar },
  { key: "earnings", label: "Earnings", icon: DollarSign },
  { key: "tutor-chat", label: "Chat", icon: MessageSquare },
  { key: "tutor-settings", label: "Settings", icon: Settings },
];

const ADMIN_LINKS = [
  { key: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "tutor-approvals", label: "Tutor Approvals", icon: CheckCircle },
  { key: "parent-approvals", label: "Parent Approvals", icon: CheckCircle },
  { key: "categories", label: "Categories", icon: FileText },
  { key: "reports", label: "Reports", icon: Shield },
  { key: "admin-payments", label: "Payments", icon: DollarSign },
  { key: "users", label: "Users", icon: Users },
  { key: "support", label: "Support", icon: MessageSquare },
  { key: "admin-settings", label: "Settings", icon: Settings },
];

export function Sidebar({ role, activePage, onNavigate, onLogout }) {
  const links = role === "tutor" ? TUTOR_LINKS : role === "admin" ? ADMIN_LINKS : PARENT_LINKS;

  return (
    <aside className="hidden w-64 border-r bg-white lg:block" style={{ borderColor: C.border }}>
      <div className="flex h-16 items-center gap-2 border-b px-6" style={{ borderColor: C.border }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: C.primary }}>
          <GraduationCap size={18} color="#fff" />
        </div>
        <span className="text-base font-semibold" style={{ color: C.text }}>TutorHub</span>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = activePage === link.key;
            return (
              <li key={link.key}>
                <button
                  onClick={() => onNavigate(link.key)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
                    isActive ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  style={{
                    color: isActive ? C.primary : C.textSecondary,
                    borderLeft: isActive ? `3px solid ${C.primary}` : "3px solid transparent",
                  }}
                >
                  <Icon size={18} />
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 w-64 border-t p-4" style={{ borderColor: C.border }}>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
