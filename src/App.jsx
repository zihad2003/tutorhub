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
import { TUTORS } from "./data/tutors";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [authTab, setAuthTab] = useState("login");
  const [userRole, setUserRole] = useState(null); // null, 'parent', 'tutor', 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "instant" }); };
  const openTutor = (t) => { setSelectedTutor(t); go("profile"); };
  const openAuth = (tab) => { setAuthTab(tab); go("auth"); };
  const handleLogin = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
    go(role === "parent" ? "parent-dashboard" : role === "tutor" ? "tutor-dashboard" : "admin-dashboard");
  };
  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    go("home");
  };

  const isDashboardPage = [
    "parent-dashboard", "post-request", "applications", "hired-tutors", "lessons", "payments", "chat", "reviews", "settings",
    "tutor-dashboard", "tutor-profile", "certificates", "availability", "requests", "tutor-applications", "tutor-lessons", "earnings", "tutor-chat", "tutor-settings",
    "admin-dashboard", "tutor-approvals", "parent-approvals", "categories", "reports", "admin-payments", "users", "support", "admin-settings",
    "lesson-log", "lesson-confirm", "summary"
  ].includes(page);

  const getRoleFromPage = (p) => {
    if (p.startsWith("parent-")) return "parent";
    if (p.startsWith("tutor-") || p === "requests" || p === "availability" || p === "certificates") return "tutor";
    if (p.startsWith("admin-") || p === "categories" || p === "reports" || p === "users") return "admin";
    return userRole || "parent";
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: C.bg, color: C.text }} className="min-h-screen text-base">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');`}</style>

      {!isDashboardPage && (
        <Header 
          page={page} 
          go={go} 
          openAuth={openAuth} 
          isAuthenticated={isAuthenticated} 
          userRole={userRole} 
          handleLogout={handleLogout} 
        />
      )}

      {isDashboardPage && (
        <Sidebar 
          role={getRoleFromPage(page)} 
          activePage={page} 
          onNavigate={go} 
          onLogout={handleLogout} 
        />
      )}

      {/* Main Content Area */}
      <main className="w-full">
        {page === "home" && <Home go={go} openTutor={openTutor} />}
        {page === "tutors" && <TutorList openTutor={openTutor} />}
        {page === "profile" && <TutorProfile tutor={selectedTutor || TUTORS[0]} go={go} />}
        {page === "auth" && <Auth tab={authTab} setTab={setAuthTab} onLogin={handleLogin} />}
        
        {/* Parent & General Dashboard Pages */}
        {page === "parent-dashboard" && <ParentDashboard onNavigate={go} />}
        {page === "post-request" && <PostRequest onNavigate={go} />}
        {page === "applications" && <TutorApplications onNavigate={go} />}
        {page === "hired-tutors" && <TutorList openTutor={openTutor} hiredOnly={true} />}
        {(page === "lessons" || page === "lesson-log") && <LessonLog onNavigate={go} />}
        {page === "lesson-confirm" && <LessonConfirm onNavigate={go} />}
        {page === "payments" && <Payment onNavigate={go} />}
        {page === "chat" && <Chat onNavigate={go} />}
        {(page === "reviews" || page === "summary") && <MonthlySummary onNavigate={go} />}
        {page === "settings" && <TutorProfile tutor={selectedTutor || TUTORS[0]} go={go} />}
        
        {/* Tutor Dashboard Pages */}
        {page === "tutor-dashboard" && <TutorDashboard onNavigate={go} />}
        {page === "tutor-profile" && <TutorProfile tutor={selectedTutor || TUTORS[0]} go={go} />}
        {page === "certificates" && <ApprovalQueues onNavigate={go} />}
        {page === "availability" && <LessonConfirm onNavigate={go} />}
        {page === "requests" && <PostRequest onNavigate={go} />}
        {page === "tutor-applications" && <TutorApplications onNavigate={go} />}
        {page === "tutor-lessons" && <LessonLog onNavigate={go} />}
        {page === "earnings" && <MonthlySummary onNavigate={go} />}
        {page === "tutor-chat" && <Chat onNavigate={go} />}
        {page === "tutor-settings" && <TutorProfile tutor={selectedTutor || TUTORS[0]} go={go} />}

        {/* Admin Dashboard Pages */}
        {page === "admin-dashboard" && <AdminDashboard onNavigate={go} />}
        {page === "tutor-approvals" && <ApprovalQueues onNavigate={go} />}
        {page === "parent-approvals" && <ApprovalQueues onNavigate={go} />}
        {page === "categories" && <AdminDashboard onNavigate={go} />}
        {page === "reports" && <MonthlySummary onNavigate={go} />}
        {page === "admin-payments" && <Payment onNavigate={go} />}
        {page === "users" && <ApprovalQueues onNavigate={go} />}
        {page === "support" && <Chat onNavigate={go} />}
        {page === "admin-settings" && <AdminDashboard onNavigate={go} />}
      </main>

      {!isDashboardPage && <Footer />}
    </div>
  );
}
