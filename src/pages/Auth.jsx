import { Input } from "../components/ui/Input";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { TextButton } from "../components/ui/TextButton";
import { C } from "../constants/tokens";
import { useState } from "react";

export function Auth({ tab, setTab, onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === "login") {
      // For demo, default to parent role on login
      onLogin("parent");
    } else if (tab === "signup" && selectedRole) {
      onLogin(selectedRole === "Parent / Student" ? "parent" : "tutor");
    }
  };
  return (
    <div className="mx-auto flex max-w-[1200px] justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex rounded-lg border p-1" style={{ borderColor: C.border, background: C.surface }}>
          {["login", "signup"].map((k) => (
            <button
              key={k}
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
          {tab === "signup" && <Input label="Full name" placeholder="Your name" />}
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" helper={tab === "signup" ? "At least 8 characters." : undefined} />
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
