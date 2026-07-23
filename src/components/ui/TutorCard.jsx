import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { C } from "../../constants/tokens";
import { Stars } from "./Stars";
import { PrimaryButton } from "./PrimaryButton";

export function TutorCard({ t, onOpen }) {
  return (
    <div
      className="rounded-lg border bg-white p-4 transition-shadow duration-150 hover:shadow-md"
      style={{ borderColor: C.border }}
    >
      <div className="flex items-start gap-3">
        <img src={t.img} alt={t.name} className="h-14 w-14 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold" style={{ color: C.text }}>{t.name}</h3>
            {t.verified && <CheckCircle2 size={15} color={C.accent} />}
          </div>
          <p className="mt-0.5 truncate text-xs" style={{ color: C.textSecondary }}>{t.subjects.join(", ")}</p>
          <div className="mt-1.5 flex items-center gap-3">
            <Stars rating={t.rating} />
            <span className="text-xs" style={{ color: C.textSecondary }}>{t.reviews} reviews</span>
          </div>
        </div>
      </div>

      <div className="my-3 h-px" style={{ background: C.border }} />

      <div className="flex items-center justify-between text-xs" style={{ color: C.textSecondary }}>
        <span className="inline-flex items-center gap-1"><Clock size={13} /> {t.experience}</span>
        <span className="inline-flex items-center gap-1"><MapPin size={13} /> {t.location.split(",")[0]}</span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: C.text }}>৳{t.fee}<span className="font-normal" style={{ color: C.textSecondary }}>/hr</span></span>
        <PrimaryButton size="sm" onClick={() => onOpen(t)}>View profile</PrimaryButton>
      </div>
    </div>
  );
}
