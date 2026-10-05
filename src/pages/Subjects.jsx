import { useEffect, useState } from "react";
import { C } from "../constants/tokens";
import { fetchFromAPI } from "../api";

export function Subjects({ go }) {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchFromAPI("/subjects")
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => setSubjects([]));
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 min-h-[60vh]">
      <h1 className="text-4xl font-bold" style={{ color: C.text }}>Subjects</h1>
      <p className="mt-3 max-w-2xl text-lg" style={{ color: C.textSecondary }}>
        Choose a subject to see the tutors who teach it.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <button
            key={subject.id || subject.name}
            onClick={() => go("tutors", { text: "", subject: subject.name })}
            className="rounded-xl border bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ borderColor: C.border }}
          >
            <span className="text-3xl">{subject.icon}</span>
            <h2 className="mt-3 text-xl font-semibold" style={{ color: C.text }}>{subject.name}</h2>
            <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>{subject.description}</p>
            <p className="mt-3 text-sm font-semibold" style={{ color: C.primary }}>{subject.tutors || 0} Tutors</p>
          </button>
        ))}
      </div>
    </div>
  );
}
