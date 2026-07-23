import { useState } from "react";
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

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [authTab, setAuthTab] = useState("login");
  const [userRole, setUserRole] = useState(null); // null, 'parent', 'tutor', 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "instant" }); };
  const openTutor = (t) => { setSelectedTutor(t); go("profile"); };
  const openAuth = (tab) => { setAuthTab(tab); go("auth"); };
  const handleLogin = (role) => { setUserRole(role); setIsAuthenticated(true); go(role === "parent" ? "parent-dashboard" : role === "tutor" ? "tutor-dashboard" : "admin-dashboard"); };
  const handleLogout = () => { setUserRole(null); setIsAuthenticated(false); go("home"); };

  const isDashboardPage = [
    "parent-dashboard", "post-request", "applications", "hired-tutors", "lessons", "payments", "chat", "reviews", "settings",
    "tutor-dashboard", "tutor-profile", "certificates", "availability", "requests", "tutor-applications", "tutor-lessons", "earnings", "tutor-chat", "tutor-settings",
    "admin-dashboard", "tutor-approvals", "parent-approvals", "categories", "reports", "admin-payments", "users", "support", "admin-settings"
  ].includes(page);

  const getRoleFromPage = (p) => {
    if (p.startsWith("parent-")) return "parent";
    if (p.startsWith("tutor-") || p === "requests" || p === "availability" || p === "certificates") return "tutor";
    if (p.startsWith("admin-")) return "admin";
    return userRole;
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: C.bg, color: C.text }} className="min-h-screen text-base">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');`}</style>

      {!isDashboardPage && <Header page={page} go={go} openAuth={openAuth} />}

      {isDashboardPage && (
        <Sidebar 
          role={getRoleFromPage(page)} 
          activePage={page} 
          onNavigate={go} 
          onLogout={handleLogout} 
        />
      )}

      {page === "home" && <Home go={go} openTutor={openTutor} />}
      {page === "tutors" && <TutorList openTutor={openTutor} />}
      {page === "profile" && <TutorProfile tutor={selectedTutor} go={go} />}
      {page === "auth" && <Auth tab={authTab} setTab={setAuthTab} onLogin={handleLogin} />}
      
      {/* Parent Pages */}
      {page === "parent-dashboard" && <ParentDashboard onNavigate={go} />}
      {page === "post-request" && <PostRequest onNavigate={go} />}
      {page === "applications" && <TutorApplications onNavigate={go} />}
      {page === "chat" && <Chat onNavigate={go} />}
      {page === "lesson-log" && <LessonLog onNavigate={go} />}
      {page === "lesson-confirm" && <LessonConfirm onNavigate={go} />}
      {page === "payments" && <Payment onNavigate={go} />}
      {page === "summary" && <MonthlySummary onNavigate={go} />}
      
      {/* Tutor Pages */}
      {page === "tutor-dashboard" && <TutorDashboard onNavigate={go} />}
      
      {/* Admin Pages */}
      {page === "admin-dashboard" && <AdminDashboard onNavigate={go} />}
      {page === "tutor-approvals" && <ApprovalQueues onNavigate={go} />}
      {page === "parent-approvals" && <ApprovalQueues onNavigate={go} />}

      {!isDashboardPage && <Footer />}
    </div>
  );
}
