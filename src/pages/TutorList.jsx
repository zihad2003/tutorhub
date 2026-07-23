import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { C } from "../constants/tokens";
import { TutorCard } from "../components/ui/TutorCard";
import { TUTORS } from "../data/tutors";

export function TutorList({ openTutor, hiredOnly = false }) {
  const [subject, setSubject] = useState("All subjects");
  const [budgets, setBudgets] = useState([]);
  const [sort, setSort] = useState("Rating");

  const toggleBudget = (b) =>
    setBudgets((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  const inBudget = (fee, label) => {
    if (label === "Under ৳600") return fee < 600;
    if (label === "৳600 - ৳1000") return fee >= 600 && fee <= 1000;
    if (label === "৳1000 - ৳1800") return fee > 1000 && fee <= 1800;
    if (label === "৳1800+") return fee > 1800;
    return true;
  };

  let list = hiredOnly ? TUTORS.slice(0, 2) : TUTORS;
  list = list.filter((t) => subject === "All subjects" || t.subjects.includes(subject));
  if (budgets.length) list = list.filter((t) => budgets.some((b) => inBudget(t.fee, b)));
  if (sort === "Rating") list = [...list].sort((a, b) => b.rating - a.rating);
  if (sort === "Fee: Low to High") list = [...list].sort((a, b) => a.fee - b.fee);
  if (sort === "Newest") list = [...list].sort((a, b) => b.id - a.id);

  const subjects = ["All subjects", "Math", "Physics", "Chemistry", "Biology", "English", "Bangla"];
  const budgetChips = ["Under ৳600", "৳600 - ৳1000", "৳1000 - ৳1800", "৳1800+"];

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
              className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm font-semibold outline-none"
              style={{ borderColor: C.border, color: C.text }}
            >
              {subjects.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" color={C.textSecondary} />
          </div>

          {budgetChips.map((b) => {
            const active = budgets.includes(b);
            return (
              <button
                key={b}
                onClick={() => toggleBudget(b)}
                className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-150"
                style={{
                  borderColor: active ? C.primary : C.border,
                  background: active ? "#EFF6FF" : C.bg,
                  color: active ? C.primary : C.textSecondary,
                }}
              >
                {b}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm font-semibold outline-none"
            style={{ borderColor: C.border, color: C.text }}
          >
            <option>Rating</option>
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
          <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>Try a different subject or budget range.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => <TutorCard key={t.id} t={t} onOpen={openTutor} />)}
        </div>
      )}
    </div>
  );
}
