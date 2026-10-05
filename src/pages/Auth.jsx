import { Input } from "../components/ui/Input";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { C } from "../constants/tokens";
import { useRef, useState } from "react";
import { UserCheck, Shield, GraduationCap } from "lucide-react";

const NAME_MAX = 60;
const EMAIL_MAX = 254;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;
const FILE_MAX_BYTES = 5 * 1024 * 1024;

const CV_EXTENSIONS = ["pdf", "doc", "docx"];
const ID_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "webp", "gif"];

function fileToPayload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result || "").split(",")[1] || "";
      resolve({ name: file.name, type: file.type, base64 });
    };
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

function validateName(raw) {
  const name = raw.trim().replace(/\s+/g, " ");
  if (!name) return "Full name is required.";
  if (/\d/.test(name)) return "Name cannot contain numbers.";
  if (name.length < 2) return "Name must be at least 2 characters.";
  if (name.length > NAME_MAX) return `Name must be ${NAME_MAX} characters or fewer.`;
  if (!/^[\p{L}][\p{L} .'-]*$/u.test(name)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes.";
  }
  if (/[.'-]{2,}/.test(name) || /[.'-]$/.test(name) || /\s[.'-]/.test(name)) {
    return "Name has invalid punctuation.";
  }
  if (name.replace(/[^\p{L}]/gu, "").length < 2) return "Enter your name using letters.";
  return "";
}

function validateEmail(raw) {
  const email = raw.trim();
  if (!email) return "Email is required.";
  if (email.length > EMAIL_MAX) return "Email is too long.";
  if (/\s/.test(email)) return "Email cannot contain spaces.";

  const at = email.indexOf("@");
  if (at <= 0 || email.lastIndexOf("@") !== at) {
    return "Enter a valid email like name@gmail.com.";
  }

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const localOk =
    local.length <= 64 &&
    /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?$/.test(local) &&
    !local.includes("..");
  const domainOk = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(domain);
  const tld = domain.split(".").pop() || "";

  if (!localOk || !domainOk || !/^[A-Za-z]{2,}$/.test(tld)) {
    return "Enter a valid email like name@gmail.com.";
  }
  return "";
}

function validatePassword(raw, { signup, email, name }) {
  if (!raw) return "Password is required.";
  if (!raw.trim()) return "Password cannot be only spaces.";
  if (!signup) return "";
  if (raw.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (raw.length > PASSWORD_MAX) return `Password must be ${PASSWORD_MAX} characters or fewer.`;
  if (!/[A-Za-z]/.test(raw) || !/\d/.test(raw)) {
    return "Password must include at least one letter and one number.";
  }
  const normalized = raw.trim().toLowerCase();
  if (email && normalized === email.trim().toLowerCase()) return "Password cannot be the same as your email.";
  if (name && normalized === name.trim().replace(/\s+/g, " ").toLowerCase()) {
    return "Password cannot be the same as your name.";
  }
  return "";
}

function fileExtension(fileName) {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() : "";
}

function validateFile(file, role) {
  const isTutor = role === "Tutor";
  const label = isTutor ? "CV" : "student ID";
  if (!file) return isTutor ? "Upload your CV as a PDF or Word document." : "Upload a student ID as an image or PDF.";
  if (!file.name || !file.name.trim()) return `Choose a ${label} file.`;
  if (file.size === 0) return "The selected file is empty.";
  if (file.size > FILE_MAX_BYTES) return "File must be 5 MB or smaller.";

  const extension = fileExtension(file.name);
  const allowed = isTutor ? CV_EXTENSIONS : ID_EXTENSIONS;
  if (!allowed.includes(extension)) {
    return isTutor
      ? "CV must be a PDF or Word file (.pdf, .doc, .docx)."
      : "Student ID must be an image or PDF (.jpg, .png, .webp, .gif, .pdf).";
  }
  return "";
}

export function Auth({ tab, setTab, onLogin }) {
  const [selectedRole, setSelectedRole] = useState("Parent / Student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setFormError("");
  };

  const switchTab = (nextTab) => {
    setErrors({});
    setFormError("");
    setTab(nextTab);
  };

  const changeRole = (role) => {
    setSelectedRole(role);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    clearError("file");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const nextErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, { signup: tab === "signup", email, name });
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;

    if (tab === "signup") {
      const nameError = validateName(name);
      const fileError = validateFile(file, selectedRole);
      if (nameError) nextErrors.name = nameError;
      if (fileError) nextErrors.file = fileError;
      if (selectedRole !== "Parent / Student" && selectedRole !== "Tutor") {
        nextErrors.role = "Choose whether you are a parent or a tutor.";
      }
    }

    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) {
      const first = ["name", "email", "password", "file"].find((field) => nextErrors[field]);
      if (first) document.getElementById(`auth-${first}`)?.focus();
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setSubmitting(true);
    try {
      if (tab === "login") {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, password }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (data.fields) setErrors(data.fields);
          setFormError(data.error || "Could not log in. Please try again.");
          setSubmitting(false);
          return;
        }
        onLogin(data);
        return;
      }

      const role = selectedRole === "Parent / Student" ? "parent" : "tutor";
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim().replace(/\s+/g, " "),
          email: normalizedEmail,
          password,
          role,
          file: await fileToPayload(file),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data.fields) setErrors(data.fields);
        setFormError(data.error || "Could not create the account. Please try again.");
        setSubmitting(false);
        return;
      }
      onLogin(data);
    } catch {
      setFormError("Could not reach the server. Start the TutorHub API and try again.");
      setSubmitting(false);
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
              onClick={() => switchTab(k)}
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

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          {tab === "signup" && (
            <Input
              id="auth-name"
              label="Full name"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              maxLength={NAME_MAX}
              error={errors.name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              onBlur={() => {
                const message = validateName(name);
                if (message && name.trim()) setErrors((prev) => ({ ...prev, name: message }));
              }}
            />
          )}
          <Input
            id="auth-email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="name@gmail.com"
            value={email}
            maxLength={EMAIL_MAX}
            error={errors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            onBlur={() => {
              const message = validateEmail(email);
              if (message && email.trim()) setErrors((prev) => ({ ...prev, email: message }));
            }}
          />
          <Input
            id="auth-password"
            label="Password"
            name="password"
            type="password"
            autoComplete={tab === "signup" ? "new-password" : "current-password"}
            placeholder="••••••••"
            value={password}
            maxLength={PASSWORD_MAX}
            error={errors.password}
            helper={tab === "signup" ? "At least 8 characters, with a letter and a number." : undefined}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError("password");
            }}
            onBlur={() => {
              if (tab !== "signup" || !password) return;
              const message = validatePassword(password, { signup: true, email, name });
              if (message) setErrors((prev) => ({ ...prev, password: message }));
            }}
          />
          {tab === "signup" && (
            <div>
              <span className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>I am a</span>
              <div className="grid grid-cols-2 gap-2">
                {["Parent / Student", "Tutor"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => changeRole(r)}
                    className="rounded-lg border py-2 text-sm font-semibold transition-colors duration-150"
                    style={{
                      borderColor: selectedRole === r ? C.primary : C.border,
                      background: selectedRole === r ? "#EFF6FF" : "transparent",
                      color: selectedRole === r ? C.primary : C.text,
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {errors.role && <span className="mt-1 block text-xs" style={{ color: C.error }}>{errors.role}</span>}
            </div>
          )}
          {tab === "signup" && selectedRole === "Tutor" && (
            <div>
              <span className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>Upload CV (PDF/Doc)</span>
              <input
                id="auth-file"
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => {
                  const nextFile = e.target.files?.[0] || null;
                  setFile(nextFile);
                  const message = validateFile(nextFile, "Tutor");
                  setErrors((prev) => {
                    const next = { ...prev };
                    if (message) next.file = message;
                    else delete next.file;
                    return next;
                  });
                }}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {errors.file && <span className="mt-1 block text-xs" style={{ color: C.error }}>{errors.file}</span>}
            </div>
          )}
          {tab === "signup" && selectedRole === "Parent / Student" && (
            <div>
              <span className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>Upload Student ID (Image/PDF)</span>
              <input
                id="auth-file"
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,.pdf,application/pdf"
                onChange={(e) => {
                  const nextFile = e.target.files?.[0] || null;
                  setFile(nextFile);
                  const message = validateFile(nextFile, "Parent / Student");
                  setErrors((prev) => {
                    const next = { ...prev };
                    if (message) next.file = message;
                    else delete next.file;
                    return next;
                  });
                }}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {errors.file && <span className="mt-1 block text-xs" style={{ color: C.error }}>{errors.file}</span>}
            </div>
          )}
          {formError && <p className="text-sm" style={{ color: C.error }}>{formError}</p>}
          <PrimaryButton full type="submit" disabled={submitting}>
            {tab === "login" ? "Log in" : submitting ? "Creating account..." : "Create account"}
          </PrimaryButton>
        </form>

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
          <button type="button" onClick={() => switchTab(tab === "login" ? "signup" : "login")} className="font-semibold" style={{ color: C.primary }}>
            {tab === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
