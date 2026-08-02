import { C } from "../constants/tokens";
import { Badge, PrimaryButton, SecondaryButton, Input } from "../components/ui";
import { useState } from "react";
import { Search, CheckCircle2, ShieldAlert, UserCheck } from "lucide-react";
import { TUTORS } from "../data/tutors";
import { ADMIN_APPROVALS } from "../data/mockData";

export function Users({ onNavigate }) {
  const [filterRole, setFilterRole] = useState("all");
  const [search, setSearch] = useState("");

  const allUsers = [
    ...TUTORS.map(t => ({ id: `tutor-${t.id}`, name: t.name, role: "Tutor", email: `${t.name.toLowerCase().replace(/\s+/g, '')}@tutorhub.com`, subjects: t.subjects.join(", "), status: "active", verified: t.verified })),
    ...ADMIN_APPROVALS.parents.map(p => ({ id: `parent-${p.id}`, name: p.name, role: "Parent", email: p.email, subjects: "Parent User", status: p.status, verified: true })),
  ];

  const filteredUsers = allUsers.filter(u => {
    const matchesRole = filterRole === "all" || u.role.toLowerCase() === filterRole.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-[1200px]">
          <button
            onClick={() => onNavigate("admin-dashboard")}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: C.text }}>User Directory & Management</h1>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                View and manage registered tutors and parents on TutorHub.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search user name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["all", "tutor", "parent"].map((roleTab) => (
                <button
                  key={roleTab}
                  type="button"
                  onClick={() => setFilterRole(roleTab)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase transition-colors ${
                    filterRole === roleTab ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {roleTab === "all" ? "All Users" : `${roleTab}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-lg border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                style={{ borderColor: C.border }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold" style={{ color: C.text }}>{user.name}</h3>
                    <Badge tone={user.role === "Tutor" ? "accent" : "neutral"}>{user.role}</Badge>
                    {user.verified && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
                        <CheckCircle2 size={14} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs" style={{ color: C.textSecondary }}>
                    {user.email} · {user.subjects}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge tone={user.status === "active" ? "success" : "warning"}>
                    {user.status === "active" ? "Active" : "Pending"}
                  </Badge>
                  <SecondaryButton size="sm">Manage User</SecondaryButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
