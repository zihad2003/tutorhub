import { Input } from "../components/ui/Input";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SecondaryButton } from "../components/ui/SecondaryButton";
import { C } from "../constants/tokens";
import { useState } from "react";
import { UserCheck, Shield, GraduationCap } from "lucide-react";

export function Auth({ tab, setTab, onLogin }) {
  const [selectedRole, setSelectedRole] = useState("Parent / Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === "login") {
      const lowerEmail = email.toLowerCase();
      if (lowerEmail.includes("admin")) {
        onLogin("admin");
      } else if (lowerEmail.includes("tutor")) {
        onLogin("tutor");
      } else {
        onLogin("parent");
      }
    } else if (tab === "signup") {
      onLogin(selectedRole === "Parent / Student" ? "parent" : "tutor");
    }
  };

  return (
    <div className="mx-auto flex max-w-[1200px] justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex rounded-lg border p-1" style={{ borderColor: C.border, background: C.surface }}>
          {["login", "signup"].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className="flex-1 rounded-md py-2 text-sm font-semibold transition-colors duration-150"
              style={{
                background: tab === k ? C.bg : "transparent",
                color: tab === k ? C.text : C.textSecondary,
                boxShadow: tab === k ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {k === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        <h1 className="text-xl font-semibold" style={{ color: C.text }}>
          {tab === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
          {tab === "login" ? "Log in to manage your lessons and payments." : "Join as a parent or a tutor in a few steps."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {tab === "signup" && <Input label="Full name" placeholder="Your name" required />}
          <Input 
            label="Email" 
            type="email" 
            placeholder="you@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            helper={tab === "signup" ? "At least 8 characters." : undefined} 
            required 
          />
          {tab === "signup" && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>I am a</span>
              <div className="grid grid-cols-2 gap-2">
                {["Parent / Student", "Tutor"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`rounded-lg border py-2 text-sm font-semibold transition-colors duration-150 ${
                      selectedRole === r ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    style={{
                      borderColor: selectedRole === r ? C.primary : C.border,
                      color: selectedRole === r ? C.primary : C.text,
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </label>
          )}
          <PrimaryButton full>{tab === "login" ? "Log in" : "Create account"}</PrimaryButton>
        </form>

        {/* Quick Demo Access Buttons */}
        <div className="mt-8 border-t pt-6" style={{ borderColor: C.border }}>
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
            Quick Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onLogin("parent")}
              className="flex flex-col items-center justify-center rounded-lg border p-2 text-xs font-semibold transition-colors hover:bg-gray-50"
              style={{ borderColor: C.border, color: C.text }}
            >
              <UserCheck size={16} className="mb-1 text-blue-600" />
              Parent
            </button>
            <button
              type="button"
              onClick={() => onLogin("tutor")}
              className="flex flex-col items-center justify-center rounded-lg border p-2 text-xs font-semibold transition-colors hover:bg-gray-50"
              style={{ borderColor: C.border, color: C.text }}
            >
              <GraduationCap size={16} className="mb-1 text-emerald-600" />
              Tutor
            </button>
            <button
              type="button"
              onClick={() => onLogin("admin")}
              className="flex flex-col items-center justify-center rounded-lg border p-2 text-xs font-semibold transition-colors hover:bg-gray-50"
              style={{ borderColor: C.border, color: C.text }}
            >
              <Shield size={16} className="mb-1 text-purple-600" />
              Admin
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-sm" style={{ color: C.textSecondary }}>
          {tab === "login" ? "New to TutorHub?" : "Already have an account?"}{" "}
          <button onClick={() => setTab(tab === "login" ? "signup" : "login")} className="font-semibold" style={{ color: C.primary }}>
            {tab === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
