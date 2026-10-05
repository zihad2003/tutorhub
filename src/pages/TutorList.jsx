import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { C } from "../constants/tokens";
import { TutorCard } from "../components/ui/TutorCard";
import { TUTORS as mockTutors } from "../data/tutors";
import { getStoredCategories } from "../data/categoriesData";
import { fetchFromAPI } from "../api";

export function TutorList({ openTutor, hiredOnly = false, browse = { text: "", subject: "" } }) {
  const [subject, setSubject] = useState("All subjects");
  const [classLevel, setClassLevel] = useState("All classes");
  const [minFee, setMinFee] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [sort, setSort] = useState("Rating: High to Low");
  const [storedCategories, setStoredCategories] = useState(() => getStoredCategories());
  const [dbTutors, setDbTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleUpdate = () => setStoredCategories(getStoredCategories());
    window.addEventListener("tutorhub_categories_updated", handleUpdate);
    return () => window.removeEventListener("tutorhub_categories_updated", handleUpdate);
  }, []);

  useEffect(() => {
    fetchFromAPI('/tutors')
      .then(data => {
        setDbTutors(data.length > 0 ? data : mockTutors);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch tutors:", err);
        setDbTutors(mockTutors); // Fallback
        setIsLoading(false);
      });
  }, []);

  const subjectOptions = ["All subjects", ...storedCategories.filter(c => c.status === "active").map(c => c.name)];
  const classOptions = ["All classes", "Class 1-5", "Class 6-8", "Class 9-10", "HSC", "University"];

  let list = hiredOnly ? dbTutors.slice(0, 2) : dbTutors;
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
    const cat = storedCategories.find(c => c.name === subject);
    const tutorSubjects = Array.isArray(t.subjects) ? t.subjects : (t.subjects ? t.subjects.split(',') : []);
    
    if (cat && cat.subjects) {
      return tutorSubjects.some(s => cat.subjects.includes(s) || s.toLowerCase().includes(subject.toLowerCase()));
    }
    return tutorSubjects.includes(subject) || tutorSubjects.some(s => subject.toLowerCase().includes(s.toLowerCase()));
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

  if (minFee !== "") list = list.filter((t) => Number(t.fee) >= Number(minFee));
  if (maxFee !== "") list = list.filter((t) => Number(t.fee) <= Number(maxFee));
  if (sort === "Rating: High to Low") list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
  if (sort === "Rating: Low to High") list = [...list].sort((a, b) => Number(a.rating) - Number(b.rating));
  if (sort === "Fee: Low to High") list = [...list].sort((a, b) => Number(a.fee) - Number(b.fee));
  if (sort === "Newest") list = [...list].sort((a, b) => b.id - a.id);

  if (isLoading) return <div className="p-10 text-center">Loading tutors...</div>;

  return (
    <div className={`mx-auto max-w-[1200px] px-4 py-10 sm:px-6 ${hiredOnly ? "lg:ml-64" : ""}`}>
      <h1 className="text-2xl font-semibold" style={{ color: C.text }}>
        {hiredOnly ? "Hired Tutors" : "Find a tutor"}
      </h1>
      <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>
        {hiredOnly ? `${list.length} active tutors hired for your lessons` : `${list.length} tutors available in Dhaka`}
      </p>

      {/* Filter bar */}
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

          <input
            type="number"
            min="0"
            value={minFee}
            onChange={(e) => setMinFee(e.target.value)}
            placeholder="Min fee"
            className="w-28 rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ borderColor: C.border, color: C.text }}
          />
          <input
            type="number"
            min="0"
            value={maxFee}
            onChange={(e) => setMaxFee(e.target.value)}
            placeholder="Max fee"
            className="w-28 rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ borderColor: C.border, color: C.text }}
          />
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
            <option>Fee: Low to High</option>
            <option>Newest</option>
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" color={C.textSecondary} />
        </div>
      </div>

      {/* Results */}
      {list.length === 0 ? (
        <div className="mt-10 rounded-lg border p-10 text-center" style={{ borderColor: C.border }}>
          <p className="text-sm font-semibold" style={{ color: C.text }}>No tutors match these filters</p>
          <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>Try selecting a different subject or budget range.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => <TutorCard key={t.id} t={t} onOpen={openTutor} />)}
        </div>
      )}
    </div>
  );
}
