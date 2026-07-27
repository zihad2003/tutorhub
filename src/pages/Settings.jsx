import { C } from "../constants/tokens";
import { PrimaryButton, SecondaryButton, Input } from "../components/ui";
import { User, Bell, Lock, Shield, CheckCircle } from "lucide-react";
import { useState } from "react";

export function Settings({ role, onNavigate }) {
  const [name, setName] = useState(role === "tutor" ? "Rafiq Ahmed" : role === "admin" ? "System Admin" : "Parent User");
  const [email, setEmail] = useState(role === "tutor" ? "rafiq@example.com" : role === "admin" ? "admin@tutorhub.com" : "parent@example.com");
  const [phone, setPhone] = useState("+880 1712-345678");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            Manage your personal info, account preferences, and password.
          </p>

          {saved && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle size={18} />
              Account settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="mt-6 space-y-6">
            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold" style={{ color: C.text }}>
                <User size={18} color={C.primary} /> Personal Information
              </h2>
              <div className="space-y-4">
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold" style={{ color: C.text }}>
                <Lock size={18} color={C.primary} /> Change Password
              </h2>
              <div className="space-y-4">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="••••••••" />
              </div>
            </div>

            <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold" style={{ color: C.text }}>
                <Bell size={18} color={C.primary} /> Notification Preferences
              </h2>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span style={{ color: C.text }}>Email alerts for new messages</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span style={{ color: C.text }}>SMS reminders for upcoming lessons</span>
                </label>
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
