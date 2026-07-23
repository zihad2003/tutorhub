import { C } from "../../constants/tokens";
import { 
  LayoutDashboard, User, UserPlus, FileText, Calendar, DollarSign, 
  MessageSquare, Star, Settings, GraduationCap, Shield, Users,
  CheckCircle, LogOut, Menu, X
} from "lucide-react";
import { useState } from "react";

const PARENT_LINKS = [
  { key: "parent-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "post-request", label: "Post Request", icon: UserPlus },
  { key: "applications", label: "Applications", icon: FileText },
  { key: "hired-tutors", label: "Hired Tutors", icon: Users },
  { key: "lessons", label: "Lessons", icon: Calendar },
  { key: "payments", label: "Payments", icon: DollarSign },
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "reviews", label: "Summary & Reviews", icon: Star },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = role === "tutor" ? TUTOR_LINKS : role === "admin" ? ADMIN_LINKS : PARENT_LINKS;

  const handleNav = (key) => {
    onNavigate(key);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden" style={{ borderColor: C.border }}>
        <button onClick={() => handleNav(role === "tutor" ? "tutor-dashboard" : role === "admin" ? "admin-dashboard" : "parent-dashboard")} className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: C.primary }}>
            <GraduationCap size={16} color="#fff" />
          </div>
          <span className="text-sm font-semibold" style={{ color: C.text }}>TutorHub</span>
        </button>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-600">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/40 lg:hidden" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed bottom-0 top-0 z-40 flex w-64 flex-col justify-between border-r bg-white transition-transform duration-200 lg:left-0 lg:z-20 ${
          mobileOpen ? "left-0" : "-left-64 lg:left-0"
        }`} 
        style={{ borderColor: C.border }}
      >
        <div>
          <div className="flex h-16 items-center gap-2 border-b px-6" style={{ borderColor: C.border }}>
            <button onClick={() => handleNav("home")} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: C.primary }}>
                <GraduationCap size={18} color="#fff" />
              </div>
              <span className="text-base font-semibold" style={{ color: C.text }}>TutorHub</span>
            </button>
          </div>

          <nav className="p-4 overflow-y-auto max-h-[calc(100vh-130px)]">
            <ul className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = activePage === link.key;
                return (
                  <li key={link.key}>
                    <button
                      onClick={() => handleNav(link.key)}
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
        </div>

        <div className="border-t p-4" style={{ borderColor: C.border }}>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
