import { useState } from "react";
import { GraduationCap, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { C } from "../../constants/tokens";
import { TextButton } from "../ui/TextButton";
import { PrimaryButton } from "../ui/PrimaryButton";

export function Header({ page, go, openAuth, isAuthenticated, userRole, handleLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { key: "home", label: "Home" },
    { key: "tutors", label: "Tutors" },
    { key: "subjects", label: "Subjects" },
    { key: "how", label: "How it works" },
  ];

  const getDashboardPage = () => {
    if (userRole === "tutor") return "tutor-dashboard";
    if (userRole === "admin") return "admin-dashboard";
    return "parent-dashboard";
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-white" style={{ borderColor: C.border }}>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
        <button onClick={() => go("home")} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: C.primary }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <span className="text-base font-semibold" style={{ color: C.text }}>TutorHub</span>
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <button
              key={l.key}
              onClick={() => go(l.key === "subjects" || l.key === "how" ? "tutors" : l.key)}
              className="text-sm font-semibold transition-colors duration-150 hover:text-blue-600"
              style={{ color: page === l.key ? C.primary : C.textSecondary }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <PrimaryButton size="sm" onClick={() => go(getDashboardPage())}>
                <LayoutDashboard size={16} className="mr-1.5 inline" />
                Dashboard
              </PrimaryButton>
              <TextButton onClick={handleLogout}>
                <LogOut size={16} className="inline" />
              </TextButton>
            </>
          ) : (
            <>
              <TextButton onClick={() => openAuth("login")}>Log in</TextButton>
              <PrimaryButton size="sm" onClick={() => openAuth("signup")}>Sign up</PrimaryButton>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t px-4 py-3 md:hidden" style={{ borderColor: C.border }}>
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <button
                key={l.key}
                onClick={() => { go(l.key === "subjects" || l.key === "how" ? "tutors" : l.key); setMobileOpen(false); }}
                className="text-left text-sm font-semibold"
                style={{ color: C.text }}
              >
                {l.label}
              </button>
            ))}
            <div className="my-1 h-px" style={{ background: C.border }} />
            {isAuthenticated ? (
              <>
                <PrimaryButton onClick={() => { go(getDashboardPage()); setMobileOpen(false); }}>
                  Dashboard ({userRole})
                </PrimaryButton>
                <TextButton onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  Log out
                </TextButton>
              </>
            ) : (
              <>
                <TextButton onClick={() => { openAuth("login"); setMobileOpen(false); }}>Log in</TextButton>
                <PrimaryButton onClick={() => { openAuth("signup"); setMobileOpen(false); }}>Sign up</PrimaryButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
