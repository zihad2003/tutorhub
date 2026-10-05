import { useEffect, useState } from "react";
import { C } from "../constants/tokens";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { authUrl } from "../api";

export function SuperAdmin() {
  const [admins, setAdmins] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadAdmins = () => {
    fetch(authUrl("/api/auth/admins"), { headers: { "x-actor-role": "superadmin" } })
      .then((response) => response.json())
      .then((data) => setAdmins(Array.isArray(data) ? data : []))
      .catch(() => setAdmins([]));
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const createAdmin = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const response = await fetch(authUrl("/api/auth/admins"), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-actor-role": "superadmin" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not create the admin.");
      return;
    }
    setNotice(`Admin ${data.email} can now log in with the password you set.`);
    setName("");
    setEmail("");
    setPassword("");
    loadAdmins();
  };

  const deleteAdmin = async (admin) => {
    setError("");
    setNotice("");
    const response = await fetch(authUrl(`/api/auth/admins/${admin.id}`), {
      method: "DELETE",
      headers: { "x-actor-role": "superadmin" },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not delete the admin.");
      return;
    }
    setNotice(`${admin.email} was removed.`);
    loadAdmins();
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:ml-64">
      <div className="mx-auto max-w-[900px]">
        <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Manage admins</h1>
        <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>Create an admin email and password. Admin emails must end with @gmail.com.</p>

        <form onSubmit={createAdmin} className="mt-6 grid gap-4 rounded-xl border bg-white p-5 sm:grid-cols-2" style={{ borderColor: C.border }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Admin name" className="rounded-lg border p-3 text-sm outline-none" style={{ borderColor: C.border }} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gmail.com" className="rounded-lg border p-3 text-sm outline-none" style={{ borderColor: C.border }} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" placeholder="Password" className="rounded-lg border p-3 text-sm outline-none sm:col-span-2" style={{ borderColor: C.border }} />
          {error && <p className="text-sm sm:col-span-2" style={{ color: C.error }}>{error}</p>}
          {notice && <p className="text-sm sm:col-span-2" style={{ color: C.primary }}>{notice}</p>}
          <PrimaryButton type="submit">Create admin</PrimaryButton>
        </form>

        <div className="mt-8 space-y-3">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between gap-4 rounded-xl border bg-white p-4" style={{ borderColor: C.border }}>
              <div>
                <p className="font-semibold" style={{ color: C.text }}>{admin.name}</p>
                <p className="text-sm" style={{ color: C.textSecondary }}>{admin.email}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteAdmin(admin)}
                className="rounded-lg border px-3 py-1.5 text-sm font-semibold"
                style={{ borderColor: "#FECACA", color: C.error }}
              >
                Delete
              </button>
            </div>
          ))}
          {admins.length === 0 && <p className="text-sm" style={{ color: C.textSecondary }}>No admins yet.</p>}
        </div>
      </div>
    </div>
  );
}
