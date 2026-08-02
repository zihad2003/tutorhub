import { C } from "../constants/tokens";
import { PrimaryButton, SecondaryButton, Badge } from "../components/ui";
import { Award, Upload, CheckCircle2, Trash2, Plus } from "lucide-react";
import { useState } from "react";

export function Certificates({ onNavigate }) {
  const [certs, setCerts] = useState([
    { id: 1, title: "BSc in Physics, Dhaka University", status: "verified", date: "2024-05-15" },
    { id: 2, title: "Certified Physics Olympiad Trainer", status: "verified", date: "2025-02-10" },
    { id: 3, title: "HSC Academic Excellence Certificate", status: "pending", date: "2026-07-01" },
  ]);

  const [newCertTitle, setNewCertTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCert = (e) => {
    e.preventDefault();
    if (newCertTitle.trim()) {
      setCerts([
        ...certs,
        {
          id: Date.now(),
          title: newCertTitle.trim(),
          status: "pending",
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewCertTitle("");
      setShowAddForm(false);
    }
  };

  const handleDelete = (id) => {
    setCerts(certs.filter(c => c.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-4 sm:p-6 lg:ml-64">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => onNavigate("tutor-dashboard")}
            className="mb-6 text-sm font-semibold"
            style={{ color: C.primary }}
          >
            &larr; Back to dashboard
          </button>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Certificates & Credentials</h1>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
                Upload and manage your degrees, certifications, and teaching verification documents.
              </p>
            </div>
            <PrimaryButton onClick={() => setShowAddForm(!showAddForm)}>
              <Plus size={16} className="mr-1.5 inline" /> Upload Certificate
            </PrimaryButton>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddCert} className="mb-8 rounded-lg border p-6 shadow-sm" style={{ borderColor: C.border }}>
              <h2 className="text-base font-semibold" style={{ color: C.text }}>Upload New Certificate</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.text }}>
                    Certificate Title / Degree Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MSc in Mathematics, BUET"
                    value={newCertTitle}
                    onChange={(e) => setNewCertTitle(e.target.value)}
                    className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none"
                    style={{ borderColor: C.border, color: C.text }}
                  />
                </div>

                <div className="rounded-lg border-2 border-dashed p-6 text-center" style={{ borderColor: C.border }}>
                  <Upload size={24} className="mx-auto text-gray-400" />
                  <p className="mt-2 text-sm font-semibold" style={{ color: C.text }}>Click to upload document (PDF, PNG, JPG)</p>
                  <p className="mt-1 text-xs" style={{ color: C.textSecondary }}>Max file size: 5MB</p>
                </div>

                <div className="flex justify-end gap-2">
                  <SecondaryButton type="button" onClick={() => setShowAddForm(false)}>Cancel</SecondaryButton>
                  <PrimaryButton type="submit">Submit for Review</PrimaryButton>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors duration-150 hover:bg-gray-50"
                style={{ borderColor: C.border }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Award size={20} color={C.primary} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold" style={{ color: C.text }}>{cert.title}</p>
                      <Badge tone={cert.status === "verified" ? "accent" : "warning"}>
                        {cert.status === "verified" ? (
                          <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Verified</span>
                        ) : (
                          "Pending Review"
                        )}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs" style={{ color: C.textSecondary }}>Uploaded on {cert.date}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(cert.id)}
                  className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
