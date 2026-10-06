import { C } from "../constants/tokens";
import { PrimaryButton, SecondaryButton, Badge } from "../components/ui";
import { Award, Upload, CheckCircle2, Trash2, Plus, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteFromAPI, fetchFromAPI, fileUrl, postToAPI } from "../api";

const FILE_MAX_BYTES = 5 * 1024 * 1024;
const FILE_TYPES = ["pdf", "png", "jpg", "jpeg"];

function readFile(file) {
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

export function Certificates({ onNavigate, account = null }) {
  const own = account && !account.demo && account.id;
  const [certs, setCerts] = useState(own ? [] : [
    { id: 1, title: "BSc in Mathematics, University of Dhaka", status: "verified", date: "2024-05-15", url: "/certificate-karim.html" },
    { id: 3, title: "HSC Academic Excellence Certificate", status: "pending", date: "2026-07-01", url: "/certificate-karim.html" },
  ]);

  const [newCertTitle, setNewCertTitle] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!own) return undefined;
    let cancelled = false;
    fetchFromAPI("/certificates")
      .then((rows) => {
        if (cancelled || !Array.isArray(rows)) return;
        setCerts(rows.filter((row) => Number(row.tutorId) === Number(account.id) && row.status !== "rejected"));
      })
      .catch(() => {
        if (!cancelled) setCerts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [own, account?.id]);

  const handleFile = (file) => {
    setFormError("");
    if (!file) {
      setSelectedFile(null);
      return;
    }
    const extension = file.name.split(".").pop().toLowerCase();
    if (!FILE_TYPES.includes(extension)) {
      setSelectedFile(null);
      setFormError("Choose a PDF, PNG, or JPG file.");
      return;
    }
    if (file.size > FILE_MAX_BYTES) {
      setSelectedFile(null);
      setFormError("File must be 5 MB or smaller.");
      return;
    }
    setSelectedFile(file);
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!newCertTitle.trim()) return;
    if (own && !selectedFile) {
      setFormError("Choose the certificate file.");
      return;
    }
    setFormError("");
    if (!own) {
      setCerts([
        { id: Date.now(), title: newCertTitle.trim(), status: "pending", date: new Date().toISOString().split("T")[0] },
        ...certs,
      ]);
      setNewCertTitle("");
      setShowAddForm(false);
      return;
    }
    setSaving(true);
    try {
      const file = await readFile(selectedFile);
      const saved = await postToAPI("/certificates", {
        tutorId: account.id,
        title: newCertTitle.trim(),
        file,
      });
      setCerts((rows) => [saved, ...rows]);
      setNewCertTitle("");
      setSelectedFile(null);
      setShowAddForm(false);
    } catch (error) {
      setFormError(error.message || "The certificate could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (own) {
      try {
        await deleteFromAPI(`/certificates/${id}`, { tutorId: account.id });
      } catch (error) {
        setFormError(error.message || "The certificate could not be removed.");
        return;
      }
    }
    setCerts((rows) => rows.filter((cert) => cert.id !== id));
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

                <label className="block cursor-pointer rounded-lg border-2 border-dashed p-6 text-center" style={{ borderColor: C.border }}>
                  <Upload size={24} className="mx-auto text-gray-400" />
                  <p className="mt-2 text-sm font-semibold" style={{ color: C.text }}>
                    {selectedFile ? selectedFile.name : "Click to upload document (PDF, PNG, JPG)"}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: C.textSecondary }}>Max file size: 5MB</p>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </label>
                {formError && <p className="text-sm font-semibold text-red-600">{formError}</p>}

                <div className="flex justify-end gap-2">
                  <SecondaryButton type="button" onClick={() => setShowAddForm(false)}>Cancel</SecondaryButton>
                  <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving..." : "Submit for Review"}</PrimaryButton>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {certs.length === 0 && (
              <p className="rounded-lg border p-4 text-sm" style={{ borderColor: C.border, color: C.textSecondary }}>
                No certificates uploaded yet.
              </p>
            )}
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDoc({ title: cert.title, url: cert.url?.startsWith("/api/") ? fileUrl(cert.url) : cert.url })}
                    className="rounded p-2 text-gray-500 hover:bg-gray-100 transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="View Certificate"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Modal Preview */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex h-[88vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: C.border }}>
              <h3 className="text-lg font-semibold" style={{ color: C.text }}>
                {selectedDoc.title}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <XCircle size={22} />
              </button>
            </div>
            <div className="flex-1 bg-gray-50 p-6 overflow-y-auto flex justify-center">
              <iframe
                src={selectedDoc.url}
                className="w-full max-w-3xl rounded-lg border shadow-md bg-white"
                style={{ height: "1050px", minHeight: "1050px" }}
                scrolling="no"
                title={selectedDoc.title}
              />
            </div>
            <div className="flex justify-end border-t px-6 py-3" style={{ borderColor: C.border }}>
              <SecondaryButton onClick={() => setSelectedDoc(null)}>Close</SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
