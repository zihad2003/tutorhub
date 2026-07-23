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
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur-md shadow-sm" style={{ borderColor: C.border }}>
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
        <button onClick={() => handleNavClick("home")} className="group flex items-center gap-2 text-left">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105" style={{ background: C.primary }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <span className="text-base font-semibold tracking-tight transition-colors duration-150 group-hover:text-blue-600" style={{ color: C.text }}>TutorHub</span>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => {
            const active = isLinkActive(l.key);
            return (
              <button
                key={l.key}
                onClick={() => handleNavClick(l.key)}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                  active 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-gray-600 hover:bg-blue-50/70 hover:text-blue-600"
                }`}
              >
                {l.label}
                {active && (
                  <span 
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full" 
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
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors md:hidden" 
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white px-4 py-3 shadow-lg md:hidden" style={{ borderColor: C.border }}>
          <div className="flex flex-col gap-1.5">
            {links.map((l) => {
              const active = isLinkActive(l.key);
              return (
                <button
                  key={l.key}
                  onClick={() => handleNavClick(l.key)}
                  className={`text-left text-sm font-semibold px-3 py-2.5 rounded-lg transition-colors ${
                    active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  {l.label}
                </button>
              );
            })}
            <div className="my-1.5 h-px" style={{ background: C.border }} />
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
