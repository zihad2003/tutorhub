import { useState, useEffect } from "react";
import { C } from "./constants/tokens";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Sidebar } from "./components/layout/Sidebar";
import { Home } from "./pages/Home";
import { TutorList } from "./pages/TutorList";
import { TutorProfile } from "./pages/TutorProfile";
import { Auth } from "./pages/Auth";
import { ParentDashboard } from "./pages/ParentDashboard";
import { PostRequest } from "./pages/PostRequest";
import { TutorApplications } from "./pages/TutorApplications";
import { Chat } from "./pages/Chat";
import { LessonLog } from "./pages/LessonLog";
import { LessonConfirm } from "./pages/LessonConfirm";
import { Payment } from "./pages/Payment";
import { MonthlySummary } from "./pages/MonthlySummary";
import { TutorDashboard } from "./pages/TutorDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ApprovalQueues } from "./pages/ApprovalQueues";
import { Availability } from "./pages/Availability";
import { Certificates } from "./pages/Certificates";
import { Settings } from "./pages/Settings";
import { Categories } from "./pages/Categories";
import { Reports } from "./pages/Reports";
import { Users } from "./pages/Users";
import { LessonHistory } from "./pages/LessonHistory";
import { TUTORS } from "./data/tutors";

import { About } from "./pages/About";
import { FAQ } from "./pages/FAQ";
import { Contact } from "./pages/Contact";
import { Careers } from "./pages/Careers";

export default function App() {
  const getInitialPage = () => {
    const path = window.location.pathname.replace(/^\/+/, '');
    if (!path) return "home";
    const validPages = [
      "home", "tutors", "profile", "auth", "login", "signup", "register", "about", "faq", "contact", "careers",
      "parent-dashboard", "post-request", "applications", "hired-tutors", "lessons", "lesson-confirm", "payments", "chat", "reviews", "summary", "settings",
      "tutor-dashboard", "tutor-profile", "certificates", "availability", "requests", "tutor-applications", "tutor-lessons", "earnings", "tutor-chat", "tutor-settings",
      "admin-dashboard", "admin-tutor-approvals", "admin-parent-approvals", "admin-categories", "admin-reports", "admin-payments", "admin-users", "admin-support", "admin-settings",
      "tutor-approvals", "parent-approvals", "categories", "reports", "users", "support",
      "lesson-log", "lesson-history"
    ];
    return validPages.includes(path) ? path : "home";
  };

  const initialPath = getInitialPage();
  const isAuthRoute = initialPath === "auth" || initialPath === "signup" || initialPath === "login" || initialPath === "register";

  const [page, setPage] = useState(isAuthRoute ? "auth" : initialPath);
  const [activeNav, setActiveNav] = useState(initialPath);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [authTab, setAuthTab] = useState(initialPath === "signup" || initialPath === "register" ? "signup" : "login");
  const [userRole, setUserRole] = useState(() => localStorage.getItem("tutorhub_role") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("tutorhub_role"));

  useEffect(() => {
    const handlePopState = () => {
      const p = getInitialPage();
      if (p === "signup" || p === "register") {
        setAuthTab("signup");
        setPage("auth");
        setActiveNav(p);
      } else if (p === "login" || p === "auth") {
        setAuthTab("login");
        setPage("auth");
        setActiveNav(p);
      } else {
        setPage(p);
        setActiveNav(p);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const go = (p, section) => {
    let targetPage = p;
    if (p === "signup" || p === "register") {
      setAuthTab("signup");
      targetPage = "auth";
    } else if (p === "login") {
      setAuthTab("login");
      targetPage = "auth";
    }

    setPage(targetPage);
    
    const url = p === "home" ? "/" : `/${p}`;
    if (window.location.pathname !== url) {
      window.history.pushState(null, "", url);
    }

    if (section) {
      setActiveNav(section);
      setTimeout(() => {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      }, 120);
    } else {
      setActiveNav(p);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const openTutor = (t) => { setSelectedTutor(t); go("profile"); };
  const openAuth = (tab) => { setAuthTab(tab); go(tab === "signup" ? "signup" : "login"); };
  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem("tutorhub_role", role);
    go(role === "parent" ? "parent-dashboard" : role === "tutor" ? "tutor-dashboard" : "admin-dashboard");
  };
  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("tutorhub_role");
    go("home");
  };

  const isDashboardPage = [
    "parent-dashboard", "post-request", "applications", "hired-tutors", "lessons", "lesson-confirm", "payments", "chat", "reviews", "summary", "settings",
    "tutor-dashboard", "tutor-profile", "certificates", "availability", "requests", "tutor-applications", "tutor-lessons", "earnings", "tutor-chat", "tutor-settings",
    "admin-dashboard", "admin-tutor-approvals", "admin-parent-approvals", "admin-categories", "admin-reports", "admin-payments", "admin-users", "admin-support", "admin-settings",
    "tutor-approvals", "parent-approvals", "categories", "reports", "users", "support",
    "lesson-log", "lesson-history"
  ].includes(page);

  const getRoleFromPage = (p) => {
    if (p.startsWith("admin-")) return "admin";
    if (p.startsWith("parent-")) return "parent";
    if (p.startsWith("tutor-")) return "tutor";
    if (p === "certificates" || p === "availability" || p === "requests" || p === "earnings") return "tutor";
    if (p === "categories" || p === "reports" || p === "users" || p === "support") return "admin";
    return userRole || localStorage.getItem("tutorhub_role") || "parent";
  };

  const activeRole = getRoleFromPage(page);

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: C.bg, color: C.text }} className="min-h-screen text-base">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');`}</style>

      {!isDashboardPage && (
        <Header 
          page={page} 
          activeNav={activeNav}
          go={go} 
          openAuth={openAuth} 
          isAuthenticated={isAuthenticated} 
          userRole={activeRole} 
          handleLogout={handleLogout} 
        />
      )}

      {isDashboardPage && (
        <Sidebar 
          role={activeRole} 
          activePage={page} 
          onNavigate={go} 
          onLogout={handleLogout} 
        />
      )}

      {/* Main Content Area */}
      <main className="w-full">
        {/* Public Pages */}
        {page === "home" && <Home go={go} openTutor={openTutor} openAuth={openAuth} />}
        {page === "tutors" && <TutorList openTutor={openTutor} />}
        {page === "profile" && <TutorProfile tutor={selectedTutor || TUTORS[0]} go={go} />}
        {page === "auth" && (
          <Auth 
            tab={authTab} 
            setTab={(t) => {
              setAuthTab(t);
              const url = `/${t}`;
              if (window.location.pathname !== url) {
                window.history.pushState(null, "", url);
              }
            }} 
            onLogin={handleLogin} 
          />
        )}
        
        {/* Company Pages */}
        {page === "about" && <About />}
        {page === "faq" && <FAQ />}
        {page === "contact" && <Contact />}
        {page === "careers" && <Careers />}

        {/* Parent & General Dashboard Pages */}
        {page === "parent-dashboard" && <ParentDashboard onNavigate={go} />}
        {page === "post-request" && <PostRequest onNavigate={go} mode="create" />}
        {page === "applications" && <TutorApplications onNavigate={go} />}
        {page === "hired-tutors" && <TutorList openTutor={openTutor} hiredOnly={true} />}
        {page === "lessons" && <LessonHistory onNavigate={go} />}
        {page === "lesson-log" && <LessonLog onNavigate={go} />}
        {page === "lesson-confirm" && <LessonConfirm onNavigate={go} />}
        {page === "payments" && <Payment onNavigate={go} />}
        {page === "chat" && <Chat onNavigate={go} />}
        {["reviews", "summary", "rate-tutor", "review", "tutor-reviews", "summary-reviews"].includes(page) && <MonthlySummary onNavigate={go} role={activeRole} />}
        {page === "settings" && <Settings role={activeRole} onNavigate={go} />}
        
        {/* Tutor Dashboard Pages */}
        {page === "tutor-dashboard" && <TutorDashboard onNavigate={go} />}
        {page === "tutor-profile" && <TutorProfile tutor={selectedTutor || TUTORS[0]} go={go} isDashboard={true} />}
        {page === "certificates" && <Certificates onNavigate={go} />}
        {page === "availability" && <Availability onNavigate={go} />}
        {page === "requests" && <PostRequest onNavigate={go} mode="browse" />}
        {page === "tutor-applications" && <TutorApplications onNavigate={go} role="tutor" />}
        {page === "tutor-lessons" && <LessonLog onNavigate={go} role="tutor" />}
        {page === "earnings" && <MonthlySummary onNavigate={go} role="tutor" />}
        {page === "tutor-chat" && <Chat onNavigate={go} role="tutor" />}
        {page === "tutor-settings" && <Settings role="tutor" onNavigate={go} />}

        {/* Admin Dashboard Pages */}
        {page === "admin-dashboard" && <AdminDashboard onNavigate={go} />}
        {(page === "admin-tutor-approvals" || page === "tutor-approvals") && <ApprovalQueues onNavigate={go} initialTab="tutors" />}
        {(page === "admin-parent-approvals" || page === "parent-approvals") && <ApprovalQueues onNavigate={go} initialTab="parents" />}
        {(page === "admin-categories" || page === "categories") && <Categories onNavigate={go} />}
        {(page === "admin-reports" || page === "reports") && <Reports onNavigate={go} />}
        {page === "admin-payments" && <Payment onNavigate={go} role="admin" />}
        {(page === "admin-users" || page === "users") && <Users onNavigate={go} />}
        {(page === "admin-support" || page === "support") && <Chat onNavigate={go} role="admin" />}
        {page === "admin-settings" && <Settings role="admin" onNavigate={go} />}
      </main>

      {!isDashboardPage && <Footer go={go} openAuth={openAuth} userRole={activeRole} />}
    </div>
  );
}