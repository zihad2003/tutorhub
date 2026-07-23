import { useState } from "react";
import { GraduationCap, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { C } from "../../constants/tokens";
import { TextButton } from "../ui/TextButton";
import { PrimaryButton } from "../ui/PrimaryButton";

export function Header({ page, activeNav, go, openAuth, isAuthenticated, userRole, handleLogout }) {
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

  const handleNavClick = (key) => {
    setMobileOpen(false);
    if (key === "home") {
      go("home");
    } else if (key === "tutors") {
      go("tutors");
    } else if (key === "subjects") {
      go("home", "subjects");
    } else if (key === "how") {
      go("home", "how");
    }
  };

  const isLinkActive = (key) => {
    if (activeNav) return activeNav === key;
    if (key === "home") return page === "home";
    if (key === "tutors") return page === "tutors" || page === "profile";
    return page === key;
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur-sm" style={{ borderColor: C.border }}>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
        <button onClick={() => handleNavClick("home")} className="flex items-center gap-2 text-left">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg shadow-sm" style={{ background: C.primary }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <span className="text-base font-semibold tracking-tight" style={{ color: C.text }}>TutorHub</span>
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => {
            const active = isLinkActive(l.key);
            return (
              <button
                key={l.key}
                onClick={() => handleNavClick(l.key)}
                className={`text-sm font-semibold transition-colors duration-150 relative py-1 ${
                  active ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"
                }`}
                style={{ color: active ? C.primary : C.textSecondary }}
              >
                {l.label}
                {active && (
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" 
                    style={{ background: C.primary }} 
                  />
                )}
              </button>
            );
          })}
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

        <button 
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 md:hidden" 
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white px-4 py-3 shadow-lg md:hidden" style={{ borderColor: C.border }}>
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <button
                key={l.key}
                onClick={() => handleNavClick(l.key)}
                className="text-left text-sm font-semibold py-1.5 transition-colors hover:text-blue-600"
                style={{ color: isLinkActive(l.key) ? C.primary : C.text }}
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
