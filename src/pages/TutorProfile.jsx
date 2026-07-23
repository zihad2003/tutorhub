import { CheckCircle2, Award, Calendar, MapPin, MessageCircle } from "lucide-react";
import { C } from "../constants/tokens";
import { Badge } from "../components/ui/Badge";
import { Stars } from "../components/ui/Stars";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SecondaryButton } from "../components/ui/SecondaryButton";
import { TUTORS } from "../data/tutors";

export function TutorProfile({ tutor, go }) {
  const t = tutor || TUTORS[0];
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
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
                <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>{t.subjects.join(", ")} &middot; {t.location}</p>
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
              { label: "Subjects", value: t.subjects.join(", ") },
              { label: "Classes", value: t.classes },
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
              {t.certificates.map((c) => (
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
            {t.revs.length === 0 ? (
              <p className="mt-3 text-sm" style={{ color: C.textSecondary }}>No reviews yet.</p>
            ) : (
              <div className="mt-3 space-y-4">
                {t.revs.map((r, i) => (
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
            <p className="text-2xl font-semibold" style={{ color: C.text }}>৳{t.fee}<span className="text-sm font-normal" style={{ color: C.textSecondary }}> /hour</span></p>
            <div className="mt-4 flex flex-col gap-2">
              <PrimaryButton full onClick={() => go("post-request")}>Hire tutor</PrimaryButton>
              <SecondaryButton full onClick={() => go("chat")}><MessageCircle size={14} className="mr-1.5 inline" />Message tutor</SecondaryButton>
            </div>
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
