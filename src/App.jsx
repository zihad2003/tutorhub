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
import { PaymentCallback } from "./pages/PaymentCallback";
import { ApprovalQueues } from "./pages/ApprovalQueues";
import { Availability } from "./pages/Availability";
import { Certificates } from "./pages/Certificates";
import { Settings } from "./pages/Settings";
import { Categories } from "./pages/Categories";
import { Reports } from "./pages/Reports";
import { Users } from "./pages/Users";
import { LessonHistory } from "./pages/LessonHistory";
import { authUrl } from "./api";

import { About } from "./pages/About";
import { FAQ } from "./pages/FAQ";
import { Contact } from "./pages/Contact";
import { Careers } from "./pages/Careers";
import { Subjects } from "./pages/Subjects";
import { SuperAdmin } from "./pages/SuperAdmin";
import { SupportInbox } from "./pages/SupportInbox";

const SESSION_KEY = "tutorhub_session";
const TUTOR_LOCKED_PAGES = [
  "tutor-profile", "certificates", "availability", "requests", "tutor-applications", "tutor-lessons",
  "earnings", "tutor-chat", "tutor-settings", "lesson-log",
];
const PARENT_LOCKED_PAGES = [
  "post-request", "applications", "hired-tutors", "lessons", "lesson-confirm", "payments", "chat",
  "reviews", "summary", "settings", "lesson-history", "rate-tutor", "review", "tutor-reviews", "summary-reviews",
];

function dashboardKind(p) {
  return {
    superPage: p.startsWith("superadmin"),
    adminPage: p.startsWith("admin-") || ["categories", "reports", "users", "support", "tutor-approvals", "parent-approvals"].includes(p),
    tutorPage: p.startsWith("tutor-") || ["certificates", "availability", "requests", "earnings", "lesson-log"].includes(p),
    parentPage: p.startsWith("parent-") || ["post-request", "applications", "hired-tutors", "lessons", "payments", "chat", "reviews", "summary", "settings", "lesson-history", "lesson-confirm"].includes(p),
  };
}

function roleGuardedPage(p, activeSession) {
  if (isOwnTutorLocked(activeSession) && TUTOR_LOCKED_PAGES.includes(p)) return "tutor-dashboard";
  if (isOwnParentLocked(activeSession) && PARENT_LOCKED_PAGES.includes(p)) return "parent-dashboard";
  if (activeSession && !activeSession.demo) {
    const { adminPage, tutorPage, parentPage, superPage } = dashboardKind(p);
    if (activeSession.role === "superadmin" && (adminPage || tutorPage || parentPage)) return "superadmin-dashboard";
    if (activeSession.role === "tutor" && (adminPage || parentPage || superPage)) return "tutor-dashboard";
    if (activeSession.role === "parent" && (adminPage || tutorPage || superPage)) return "parent-dashboard";
    if (activeSession.role === "admin" && (tutorPage || parentPage || superPage)) return "admin-dashboard";
  }
  return p;
}

function readStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.role) return null;
    return session;
  } catch {
    return null;
  }
}

function demoSession(role) {
  const names = { parent: "Demo Parent", tutor: "Demo Tutor", admin: "Demo Admin" };
  return { role, name: names[role] || "Demo", status: "approved", demo: true };
}

function isOwnTutorLocked(session) {
  return Boolean(session && session.role === "tutor" && !session.demo && session.status !== "approved");
}

function isOwnParentLocked(session) {
  return Boolean(session && session.role === "parent" && !session.demo && session.status !== "approved");
}

export default function App() {
  const getInitialPage = () => {
    const path = window.location.pathname.replace(/^\/+/, '');
    if (!path) return "home";
    const validPages = [
      "home", "tutors", "subjects", "profile", "auth", "login", "signup", "register", "about", "faq", "contact", "careers",
      "parent-dashboard", "post-request", "applications", "hired-tutors", "lessons", "lesson-confirm", "payments", "chat", "reviews", "summary", "settings",
      "tutor-dashboard", "tutor-profile", "certificates", "availability", "requests", "tutor-applications", "tutor-lessons", "earnings", "tutor-chat", "tutor-settings",
      "admin-dashboard", "admin-tutor-approvals", "admin-parent-approvals", "admin-categories", "admin-reports", "admin-payments", "admin-users", "admin-support", "admin-settings",
      "superadmin-dashboard",
      "tutor-approvals", "parent-approvals", "categories", "reports", "users", "support",
      "lesson-log", "bkash-callback", "lesson-history"
    ];
    return validPages.includes(path) ? path : "home";
  };

  const initialPath = getInitialPage();
  const isAuthRoute = initialPath === "auth" || initialPath === "signup" || initialPath === "login" || initialPath === "register";

  const [page, setPage] = useState(isAuthRoute ? "auth" : initialPath);
  const [activeNav, setActiveNav] = useState(initialPath);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [browse, setBrowse] = useState({ text: "", subject: "" });
  const [authTab, setAuthTab] = useState(initialPath === "signup" || initialPath === "register" ? "signup" : "login");
  const [session, setSession] = useState(readStoredSession);
  const [userRole, setUserRole] = useState(() => readStoredSession()?.role || localStorage.getItem("tutorhub_role") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!readStoredSession() || !!localStorage.getItem("tutorhub_role"));

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

  const go = (p, section, activeSession = session) => {
    let scrollTarget = section;
    if (p === "tutors" && section && typeof section === "object") {
      setBrowse(section);
      scrollTarget = undefined;
    } else if (p === "tutors") {
      setBrowse({ text: "", subject: "" });
    }
    p = roleGuardedPage(p, activeSession);
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

    if (typeof scrollTarget === "string" && scrollTarget) {
      setActiveNav(scrollTarget);
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
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
  const saveSession = (next) => {
    setSession(next);
    setUserRole(next.role);
    setIsAuthenticated(true);
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    localStorage.setItem("tutorhub_role", next.role);
  };
  const handleLogin = (account) => {
    const next = typeof account === "string" ? demoSession(account) : { ...account, demo: false };
    saveSession(next);
    const destination = next.role === "parent"
      ? "parent-dashboard"
      : next.role === "tutor"
        ? "tutor-dashboard"
        : next.role === "superadmin"
          ? "superadmin-dashboard"
          : "admin-dashboard";
    go(destination, undefined, next);
  };
  const handleLogout = () => {
    setSession(null);
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("tutorhub_role");
    go("home");
  };
  const startReapply = () => {
    setSession(null);
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("tutorhub_role");
    setAuthTab("signup");
    go("signup");
  };

  useEffect(() => {
    if (!session?.id || session.demo || session.role === "admin" || session.role === "superadmin") return undefined;
    let stopped = false;
    const refresh = async () => {
      try {
        const response = await fetch(authUrl(`/api/auth/me?role=${session.role}&id=${session.id}`));
        if (!response.ok) return;
        const data = await response.json();
        if (stopped || !data?.status || data.status === session.status) return;
        saveSession({ ...session, ...data, demo: false });
      } catch {
        // Keep the last known account if the API is briefly unavailable.
      }
    };
    refresh();
    const timer = session.status !== "approved" ? window.setInterval(refresh, 4000) : null;
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      stopped = true;
      if (timer) window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [session?.id, session?.role, session?.status]);

  useEffect(() => {
    const guarded = roleGuardedPage(page, session);
    if (guarded !== page) go(guarded);
  }, [page, session]);

  const isDashboardPage = [
    "parent-dashboard", "post-request", "applications", "hired-tutors", "lessons", "lesson-confirm", "payments", "chat", "reviews", "summary", "settings",
    "tutor-dashboard", "tutor-profile", "certificates", "availability", "requests", "tutor-applications", "tutor-lessons", "earnings", "tutor-chat", "tutor-settings",
    "admin-dashboard", "admin-tutor-approvals", "admin-parent-approvals", "admin-categories", "admin-reports", "admin-payments", "admin-users", "admin-support", "admin-settings",
    "superadmin-dashboard",
    "tutor-approvals", "parent-approvals", "categories", "reports", "users", "support",
    "lesson-log", "lesson-history"
  ].includes(page);

  const getRoleFromPage = (p) => {
    if (p.startsWith("superadmin")) return "superadmin";
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
          account={session}
          locked={isOwnTutorLocked(session) || isOwnParentLocked(session)}
        />
      )}

      {/* Main Content Area */}
      <main className="w-full">
        {/* Public Pages */}
        {page === "home" && <Home go={go} openTutor={openTutor} openAuth={openAuth} />}
        {page === "tutors" && <TutorList openTutor={openTutor} browse={browse} account={session} />}
        {page === "subjects" && <Subjects go={go} />}
        {page === "profile" && <TutorProfile tutor={selectedTutor} go={go} />}
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
        {(page === "parent-dashboard" || (isOwnParentLocked(session) && PARENT_LOCKED_PAGES.includes(page))) && (
          <ParentDashboard onNavigate={go} account={session} onReapply={startReapply} />
        )}
        {page === "post-request" && !isOwnParentLocked(session) && <PostRequest onNavigate={go} mode="create" account={session} />}
        {page === "applications" && !isOwnParentLocked(session) && <TutorApplications onNavigate={go} account={session} />}
        {page === "hired-tutors" && !isOwnParentLocked(session) && <TutorList openTutor={openTutor} hiredOnly={true} account={session} />}
        {page === "lessons" && !isOwnParentLocked(session) && <LessonHistory onNavigate={go} account={session} />}
        {page === "lesson-log" && !isOwnTutorLocked(session) && <LessonLog onNavigate={go} account={session} />}
        {page === "lesson-confirm" && !isOwnParentLocked(session) && <LessonConfirm onNavigate={go} account={session} />}
        {page === "payments" && !isOwnParentLocked(session) && <Payment onNavigate={go} account={session} />}
        {page === "chat" && !isOwnParentLocked(session) && <Chat onNavigate={go} account={session} />}
        {["reviews", "summary", "rate-tutor", "review", "tutor-reviews", "summary-reviews"].includes(page) && !isOwnParentLocked(session) && <MonthlySummary onNavigate={go} role={activeRole} account={session} />}
        {page === "settings" && !isOwnParentLocked(session) && <Settings role={activeRole} onNavigate={go} />}
        
        {/* Tutor Dashboard Pages */}
        {(page === "tutor-dashboard" || (isOwnTutorLocked(session) && TUTOR_LOCKED_PAGES.includes(page))) && (
          <TutorDashboard onNavigate={go} account={session} onReapply={startReapply} />
        )}
        {page === "tutor-profile" && !isOwnTutorLocked(session) && <TutorProfile tutor={selectedTutor} go={go} isDashboard={true} account={session} />}
        {page === "certificates" && !isOwnTutorLocked(session) && <Certificates onNavigate={go} account={session} />}
        {page === "availability" && !isOwnTutorLocked(session) && <Availability onNavigate={go} account={session} />}
        {page === "requests" && !isOwnTutorLocked(session) && <PostRequest onNavigate={go} mode="browse" account={session} />}
        {page === "tutor-applications" && !isOwnTutorLocked(session) && <TutorApplications onNavigate={go} role="tutor" account={session} />}
        {page === "tutor-lessons" && !isOwnTutorLocked(session) && <LessonLog onNavigate={go} role="tutor" account={session} />}
        {page === "earnings" && !isOwnTutorLocked(session) && <MonthlySummary onNavigate={go} role="tutor" account={session} />}
        {page === "tutor-chat" && !isOwnTutorLocked(session) && <Chat onNavigate={go} role="tutor" account={session} />}
        {page === "tutor-settings" && !isOwnTutorLocked(session) && <Settings role="tutor" onNavigate={go} />}

        {/* Admin Dashboard Pages */}
        {page === "admin-dashboard" && <AdminDashboard onNavigate={go} />}
        {(page === "admin-tutor-approvals" || page === "tutor-approvals") && <ApprovalQueues onNavigate={go} initialTab="tutors" />}
        {(page === "admin-parent-approvals" || page === "parent-approvals") && <ApprovalQueues onNavigate={go} initialTab="parents" />}
        {(page === "admin-categories" || page === "categories") && <Categories onNavigate={go} />}
        {(page === "admin-reports" || page === "reports") && <Reports onNavigate={go} />}
        {page === "admin-payments" && <Payment onNavigate={go} role="admin" />}
        {(page === "admin-users" || page === "users") && <Users onNavigate={go} />}
        {(page === "admin-support" || page === "support") && <SupportInbox />}
        {page === "superadmin-dashboard" && <SuperAdmin />}
        {page === "admin-settings" && <Settings role="admin" onNavigate={go} />}
      </main>

      {!isDashboardPage && <Footer go={go} openAuth={openAuth} userRole={activeRole} />}
    </div>
  );
}