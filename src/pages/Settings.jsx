import { C } from "../constants/tokens";
import { PrimaryButton, SecondaryButton, Input } from "../components/ui";
import { User, Lock, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { authUrl } from "../api";

export function Settings({ role, onNavigate, account = null, onSaved }) {
  const own = account && !account.demo && account.id;
  const [name, setName] = useState(own ? account.name || "" : "");
  const [email, setEmail] = useState(own ? account.email || "" : "");
  const [phone, setPhone] = useState(own ? account.phone || "" : "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!own) return undefined;
    let cancelled = false;
    fetch(authUrl(`/api/auth/me?role=${account.role}&id=${account.id}`))
      .then((response) => response.json())
      .then((data) => {
        if (cancelled || !data?.email) return;
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [own, account?.id, account?.role]);

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    if (!own) {
      setError("Log in with your account to update these details.");
      return;
    }
    const response = await fetch(authUrl("/api/auth/profile"), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: account.id,
        role: account.role,
        name,
        phone,
        currentPassword,
        newPassword,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not update the account.");
      return;
    }
    if (typeof onSaved === "function") onSaved({ ...account, ...data, demo: false });
    setCurrentPassword("");
    setNewPassword("");
    setSaved(true);
  };

  const backLink = role === "tutor" ? "tutor-dashboard" : role === "admin" ? "admin-dashboard" : "parent-dashboard";

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => onNavigate(backLink)}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Account Settings</h1>
          <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
            These details come from your account.
          </p>

          {saved && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle size={18} />
              Account settings updated.
            </div>
          )}
          {error && <p className="mt-4 text-sm font-semibold" style={{ color: C.error }}>{error}</p>}

          <form onSubmit={handleSave} className="mt-6 space-y-6">
            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold" style={{ color: C.text }}>
                <User size={18} color={C.primary} /> Personal Information
              </h2>
              <div className="space-y-4">
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Email Address" type="email" value={email} readOnly />
                <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold" style={{ color: C.text }}>
                <Lock size={18} color={C.primary} /> Change Password
              </h2>
              <div className="space-y-4">
                <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Leave blank to keep your password" />
                <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters with a letter and a number" />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <SecondaryButton onClick={() => onNavigate(backLink)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit">Save Changes</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
