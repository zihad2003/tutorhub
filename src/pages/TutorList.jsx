import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { C } from "../constants/tokens";
import { TutorCard } from "../components/ui/TutorCard";
import { TUTORS as mockTutors } from "../data/tutors";
import { fetchFromAPI } from "../api";

const FEE_MIN = 5000;
const FEE_MAX = 10000;

function formatFee(value) {
  return Number(value || 0).toLocaleString("en-US");
}

function parseFee(value) {
  const number = Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(number)) return FEE_MIN;
  return Math.min(FEE_MAX, Math.max(FEE_MIN, Math.round(number)));
}

function PriceRange({ minFee, maxFee, onChange }) {
  const left = ((minFee - FEE_MIN) / (FEE_MAX - FEE_MIN)) * 100;
  const width = ((maxFee - minFee) / (FEE_MAX - FEE_MIN)) * 100;
  return (
    <div className="w-full rounded-lg border bg-white px-3 py-2 sm:w-[220px]" style={{ borderColor: C.border }}>
      <p className="text-xs font-semibold" style={{ color: C.text }}>Price range <span style={{ color: C.textSecondary }}>/month</span></p>
      <div className="relative mt-2 h-5">
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-100" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
          style={{ left: `${left}%`, width: `${width}%`, background: C.primary }}
        />
        <input
          type="range"
          min={FEE_MIN}
          max={FEE_MAX}
          value={minFee}
          onChange={(event) => onChange(Math.min(Number(event.target.value), maxFee), maxFee)}
          className="price-range"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={FEE_MIN}
          max={FEE_MAX}
          value={maxFee}
          onChange={(event) => onChange(minFee, Math.max(Number(event.target.value), minFee))}
          className="price-range"
          aria-label="Maximum price"
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <input
          value={formatFee(minFee)}
          onChange={(event) => onChange(Math.min(parseFee(event.target.value), maxFee), maxFee)}
          className="w-[4.5rem] rounded border px-1.5 py-1 text-center text-xs outline-none"
          style={{ borderColor: C.border, color: C.text }}
          aria-label="Minimum price amount"
        />
        <input
          value={formatFee(maxFee)}
          onChange={(event) => onChange(minFee, Math.max(parseFee(event.target.value), minFee))}
          className="w-[4.5rem] rounded border px-1.5 py-1 text-center text-xs outline-none"
          style={{ borderColor: C.border, color: C.text }}
          aria-label="Maximum price amount"
        />
      </div>
      <style>{`
        .price-range {
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 0;
          margin: 0;
          transform: translateY(-50%);
          appearance: none;
          background: transparent;
          pointer-events: none;
        }
        .price-range::-webkit-slider-thumb {
          appearance: none;
          pointer-events: auto;
          height: 14px;
          width: 14px;
          border-radius: 999px;
          border: 2px solid #2563EB;
          background: #fff;
          cursor: pointer;
        }
        .price-range::-moz-range-thumb {
          pointer-events: auto;
          height: 14px;
          width: 14px;
          border-radius: 999px;
          border: 2px solid #2563EB;
          background: #fff;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export function TutorList({ openTutor, hiredOnly = false, browse = { text: "", subject: "" }, account = null }) {
  const [subject, setSubject] = useState(browse.subject || "All subjects");
  const [classLevel, setClassLevel] = useState("All classes");
  const [minFee, setMinFee] = useState(FEE_MIN);
  const [maxFee, setMaxFee] = useState(FEE_MAX);
  const [sort, setSort] = useState("Rating: High to Low");
  const [subjectNames, setSubjectNames] = useState([]);
  const [dbTutors, setDbTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (browse.subject) setSubject(browse.subject);
  }, [browse.subject]);

  useEffect(() => {
    fetchFromAPI("/subjects")
      .then((data) => setSubjectNames(Array.isArray(data) ? data.map((item) => item.name) : []))
      .catch(() => setSubjectNames([]));
  }, []);

  useEffect(() => {
    const ownParent = hiredOnly && account && !account.demo && account.id;
    const load = ownParent
      ? fetchFromAPI("/hired_tutors").then((rows) => (Array.isArray(rows) ? rows : []).filter((row) => Number(row.parentId) === Number(account.id)).map((row) => ({
          id: row.tutorId || row.id,
          name: row.tutorName,
          img: row.tutorImg,
          subjects: row.subjects || [],
          fee: Number(row.fee) || 0,
          rating: 0,
          reviews: 0,
        })))
      : fetchFromAPI("/tutors").then((data) => (data.length > 0 ? data : mockTutors));
    load
      .then((data) => {
        setDbTutors(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tutors:", err);
        setDbTutors(ownParent ? [] : mockTutors);
        setIsLoading(false);
      });
  }, [hiredOnly, account]);

  const subjectOptions = ["All subjects", ...subjectNames];
  const classOptions = ["All classes", "Class 1-5", "Class 6-8", "Class 9-10", "HSC", "University"];

  const ownHireList = hiredOnly && account && !account.demo;
  let list = hiredOnly && !ownHireList ? dbTutors.slice(0, 2) : dbTutors;
  if (hiredOnly) {
    list = dbTutors;
  } else {
  const wantedSubject = String(browse.subject || "").trim().toLowerCase();
  const wantedText = String(browse.text || "").trim().toLowerCase();
  if (wantedSubject) {
    list = list.filter((t) => {
      const tutorSubjects = Array.isArray(t.subjects) ? t.subjects : (t.subjects ? String(t.subjects).split(",") : []);
      return tutorSubjects.some((item) => String(item).trim().toLowerCase() === wantedSubject);
    });
  }
  if (wantedText) {
    list = list.filter((t) => {
      const tutorSubjects = Array.isArray(t.subjects) ? t.subjects : [];
      return `${t.name || ""} ${tutorSubjects.join(" ")}`.toLowerCase().includes(wantedText);
    });
  }
  list = list.filter((t) => {
    if (subject === "All subjects") return true;
    const tutorSubjects = Array.isArray(t.subjects) ? t.subjects : (t.subjects ? String(t.subjects).split(",") : []);
    return tutorSubjects.some((item) => String(item).trim().toLowerCase() === subject.toLowerCase());
  });

  if (classLevel !== "All classes") {
    list = list.filter((t) => {
      if (classLevel === "Class 1-5") return t.classLevels?.includes("Class 1-5") || t.classLevels?.includes("Class 1") || t.classLevels?.includes("Class 2") || t.classLevels?.includes("Class 3") || t.classLevels?.includes("Class 4") || t.classLevels?.includes("Class 5");
      if (classLevel === "Class 6-8") return t.classLevels?.includes("Class 6-8") || t.classLevels?.includes("Class 6") || t.classLevels?.includes("Class 7") || t.classLevels?.includes("Class 8");
      if (classLevel === "Class 9-10") return t.classLevels?.includes("Class 9-10") || t.classLevels?.includes("Class 9") || t.classLevels?.includes("Class 10");
      if (classLevel === "HSC") return t.classLevels?.includes("HSC") || t.classLevels?.includes("College");
      if (classLevel === "University") return t.classLevels?.includes("University") || t.classLevels?.includes("University Level");
      return true;
    });
  }

  list = list.filter((t) => Number(t.fee) >= Number(minFee) && Number(t.fee) <= Number(maxFee));
  if (sort === "Rating: High to Low") list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
  if (sort === "Rating: Low to High") list = [...list].sort((a, b) => Number(a.rating) - Number(b.rating));
  }

  if (isLoading) return <div className="p-10 text-center">Loading tutors...</div>;

  return (
    <div className={`mx-auto max-w-[1200px] px-4 py-10 sm:px-6 ${hiredOnly ? "lg:ml-64" : ""}`}>
      <h1 className="text-2xl font-semibold" style={{ color: C.text }}>
        {hiredOnly ? "Hired Tutors" : "Find a tutor"}
      </h1>
      <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
        {hiredOnly ? `${list.length} active tutors hired for your lessons` : `${list.length} tutors available in Dhaka`}
      </p>

      {!hiredOnly && (
      <div className="mt-6 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: C.border }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm font-semibold outline-none bg-white"
              style={{ borderColor: C.border, color: C.text }}
            >
              {subjectOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" color={C.textSecondary} />
          </div>

          <div className="relative">
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm font-semibold outline-none bg-white"
              style={{ borderColor: C.border, color: C.text }}
            >
              {classOptions.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" color={C.textSecondary} />
          </div>

          <PriceRange minFee={minFee} maxFee={maxFee} onChange={(nextMin, nextMax) => { setMinFee(nextMin); setMaxFee(nextMax); }} />
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm font-semibold outline-none bg-white"
            style={{ borderColor: C.border, color: C.text }}
          >
            <option>Rating: High to Low</option>
            <option>Rating: Low to High</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" color={C.textSecondary} />
        </div>
      </div>
      )}

      {/* Results */}
      {list.length === 0 ? (
        <div className="mt-10 rounded-lg border p-10 text-center" style={{ borderColor: C.border }}>
          <p className="text-sm font-semibold" style={{ color: C.text }}>{hiredOnly ? "No tutors hired yet" : "No tutors match these filters"}</p>
          <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>{hiredOnly ? "Hire a tutor from Applications and they will appear here." : "Try selecting a different subject or budget range."}</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => <TutorCard key={t.id} t={t} onOpen={openTutor} />)}
        </div>
      )}
    </div>
  );
}
