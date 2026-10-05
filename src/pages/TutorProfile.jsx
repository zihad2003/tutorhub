import { useEffect, useState } from "react";
import { CheckCircle2, Award, Calendar, MapPin, MessageCircle } from "lucide-react";
import { C } from "../constants/tokens";
import { Badge } from "../components/ui/Badge";
import { Stars } from "../components/ui/Stars";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SecondaryButton } from "../components/ui/SecondaryButton";
import { fetchFromAPI } from "../api";

function subjectList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function TutorProfile({ tutor, go, isDashboard = false, account = null }) {
  const ownAccount = isDashboard && account?.role === "tutor" && account?.id && !account.demo;
  const [source, setSource] = useState(ownAccount ? null : tutor || null);

  useEffect(() => {
    if (!ownAccount) {
      setSource(tutor || null);
      return undefined;
    }
    let cancelled = false;
    fetchFromAPI(`/tutor-profile/${account.id}`)
      .then((data) => {
        if (!cancelled) setSource(data);
      })
      .catch(() => {
        if (!cancelled) {
          setSource({
            name: account.name,
            email: account.email,
            subjects: [],
            certificates: [],
            revs: [],
            fee: 0,
            rating: 0,
            reviews: 0,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [ownAccount, account?.id, account?.name, account?.email, tutor]);

  if (!source) {
    return (
      <div className="mx-auto max-w-[900px] px-4 py-16">
        <p style={{ color: C.textSecondary }}>{ownAccount ? "Loading your profile..." : "Choose a tutor to view their profile."}</p>
      </div>
    );
  }
  const subjects = subjectList(source.subjects);
  const certificates = Array.isArray(source.certificates) ? source.certificates : [];
  const reviews = Array.isArray(source.revs) ? source.revs : [];
  const t = source;
  return (
    <div className={`mx-auto max-w-[1200px] px-4 py-6 sm:px-6 sm:py-10 ${isDashboard ? "lg:ml-64" : ""}`}>
      <button onClick={() => go("tutors")} className="mb-6 text-sm font-semibold" style={{ color: C.primary }}>
        &larr; Back to tutors
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="rounded-lg border p-6" style={{ borderColor: C.border }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <img src={t.img} alt={t.name} className="h-20 w-20 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold" style={{ color: C.text }}>{t.name}</h1>
                  {t.verified && <Badge tone="accent"><CheckCircle2 size={12} /> Verified</Badge>}
                </div>
                <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>{subjects.join(", ") || "Subjects not listed"} &middot; {t.location || "Location not listed"}</p>
                <div className="mt-2 flex items-center gap-3">
                  <Stars rating={t.rating} />
                  <span className="text-xs" style={{ color: C.textSecondary }}>{t.reviews} reviews</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: C.textSecondary }}>{t.bio}</p>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Subjects", value: subjects.join(", ") || "Not listed" },
              { label: "Classes", value: t.classes || "Not listed" },
              { label: "Experience", value: t.experience },
              { label: "Availability", value: t.availability },
            ].map((f) => (
              <div key={f.label} className="rounded-lg border p-4" style={{ borderColor: C.border }}>
                <p className="text-xs" style={{ color: C.textSecondary }}>{f.label}</p>
                <p className="mt-1 text-sm font-semibold" style={{ color: C.text }}>{f.value}</p>
              </div>
            ))}
          </div>

          {/* Certificates */}
          <div className="mt-8">
            <h2 className="text-base font-semibold" style={{ color: C.text }}>Certificates</h2>
            <div className="mt-3 space-y-2">
              {certificates.length === 0 ? (
                <p className="text-sm" style={{ color: C.textSecondary }}>No certificates listed yet.</p>
              ) : certificates.map((c) => (
                <div key={c} className="flex items-center gap-2 rounded-lg border p-3" style={{ borderColor: C.border }}>
                  <Award size={16} color={C.accent} />
                  <span className="text-sm" style={{ color: C.text }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-8">
            <h2 className="text-base font-semibold" style={{ color: C.text }}>Reviews</h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm" style={{ color: C.textSecondary }}>No reviews yet.</p>
            ) : (
              <div className="mt-3 space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="border-b pb-4" style={{ borderColor: C.border }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: C.text }}>{r.name}</span>
                      <span className="text-xs" style={{ color: C.textSecondary }}>{r.date}</span>
                    </div>
                    <div className="mt-1"><Stars rating={r.rating} /></div>
                    <p className="mt-1.5 text-sm leading-relaxed" style={{ color: C.textSecondary }}>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-20 rounded-lg border p-5" style={{ borderColor: C.border }}>
            {isDashboard ? (
              <div>
                <p className="text-base font-semibold" style={{ color: C.text }}>Profile Actions</p>
                <p className="mt-1 text-xs" style={{ color: C.textSecondary }}>Manage your public tutor details and rate.</p>
                <div className="mt-4 flex flex-col gap-2">
                  <PrimaryButton full onClick={() => go("tutor-settings")}>Edit Profile Settings</PrimaryButton>
                  <SecondaryButton full onClick={() => go("certificates")}>Manage Certificates</SecondaryButton>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-semibold" style={{ color: C.text }}>৳{t.fee}<span className="text-sm font-normal" style={{ color: C.textSecondary }}> /hour</span></p>
                <div className="mt-4 flex flex-col gap-2">
                  <PrimaryButton full onClick={() => go("post-request")}>Hire tutor</PrimaryButton>
                  <SecondaryButton full onClick={() => go("chat")}><MessageCircle size={14} className="mr-1.5 inline" />Message tutor</SecondaryButton>
                </div>
              </div>
            )}
            <div className="mt-5 space-y-2 text-xs" style={{ color: C.textSecondary }}>
              <p className="flex items-center gap-2"><Calendar size={13} /> {t.availability}</p>
              <p className="flex items-center gap-2"><MapPin size={13} /> {t.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
