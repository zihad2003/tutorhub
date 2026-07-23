import { Search, Users, BookOpen, Shield, ChevronRight, Award, GraduationCap } from "lucide-react";
import { C } from "../constants/tokens";
import { Badge } from "../components/ui/Badge";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { TextButton } from "../components/ui/TextButton";
import { TutorCard } from "../components/ui/TutorCard";
import { TUTORS } from "../data/tutors";
import { useState } from "react";

export function Home({ go, openTutor }) {
  const [searchQuery, setSearchQuery] = useState("");

  const steps = [
    { icon: Search, title: "Find", text: "Search tutors by subject, class, and budget." },
    { icon: Users, title: "Hire", text: "Compare profiles and hire the right tutor." },
    { icon: BookOpen, title: "Track", text: "Log lessons and track progress each month." },
    { icon: Shield, title: "Pay", text: "Confirm lessons and pay securely each month." },
  ];

  const popularSubjects = [
    { name: "Physics", count: "340+ Tutors", icon: "⚛️" },
    { name: "Math", count: "420+ Tutors", icon: "📐" },
    { name: "Chemistry", count: "280+ Tutors", icon: "🧪" },
    { name: "English", count: "310+ Tutors", icon: "📚" },
    { name: "Biology", count: "220+ Tutors", icon: "🧬" },
    { name: "ICT", count: "190+ Tutors", icon: "💻" },
  ];

  const handleSearch = (e) => {
    e?.preventDefault();
    go("tutors");
  };

  return (
    <div>
      {/* Hero */}
      <section className="border-b" style={{ borderColor: C.border }}>
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <Badge tone="accent">Verified home tutors in Dhaka</Badge>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl" style={{ color: C.text }}>
              Find the right tutor for your child
            </h1>
            <p className="mt-4 text-base leading-relaxed" style={{ color: C.textSecondary }}>
              Browse verified tutors, hire with confidence, and track every lesson and payment in one place.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-2 rounded-lg border bg-white p-2 sm:flex-row" style={{ borderColor: C.border }}>
              <div className="flex flex-1 items-center gap-2 px-2">
                <Search size={18} color={C.textSecondary} />
                <input
                  type="text"
                  placeholder="Search by subject, e.g. Physics, Math, HSC..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 text-sm outline-none"
                  style={{ color: C.text }}
                />
              </div>
              <PrimaryButton type="submit">Find tutors</PrimaryButton>
            </form>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: C.textSecondary }}>
              <span><strong style={{ color: C.text }}>1,200+</strong> verified tutors</span>
              <span><strong style={{ color: C.text }}>8,500+</strong> lessons tracked</span>
              <span><strong style={{ color: C.text }}>4.8</strong> average rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section id="subjects" className="border-b py-12" style={{ borderColor: C.border }}>
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: C.text }}>Popular Subjects</h2>
              <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>Browse tutors by subject category</p>
            </div>
            <TextButton onClick={() => go("tutors")}>View all <ChevronRight size={14} className="inline" /></TextButton>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {popularSubjects.map((sub) => (
              <button
                key={sub.name}
                onClick={() => go("tutors")}
                className="flex flex-col items-center justify-center rounded-lg border bg-white p-4 text-center transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                style={{ borderColor: C.border }}
              >
                <span className="text-2xl mb-2">{sub.icon}</span>
                <span className="text-sm font-semibold" style={{ color: C.text }}>{sub.name}</span>
                <span className="mt-0.5 text-xs" style={{ color: C.textSecondary }}>{sub.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold" style={{ color: C.text }}>How it works</h2>
        <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>Four simple steps to find and manage private home tuition</p>
        <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-lg border p-5 bg-white transition-all duration-150 hover:shadow-sm" style={{ borderColor: C.border }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: C.surface }}>
                <s.icon size={18} color={C.primary} />
              </div>
              <h3 className="mt-4 text-sm font-semibold" style={{ color: C.text }}>{i + 1}. {s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: C.textSecondary }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured tutors */}
      <section style={{ background: C.surface }}>
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold" style={{ color: C.text }}>Featured tutors</h2>
            <TextButton onClick={() => go("tutors")}>View all <ChevronRight size={14} className="inline" /></TextButton>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TUTORS.slice(0, 3).map((t) => (
              <TutorCard key={t.id} t={t} onOpen={openTutor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="rounded-lg p-10 text-center shadow-md" style={{ background: C.primary }}>
          <h2 className="text-2xl font-semibold text-white">Are you a tutor?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            Create a profile, get verified, and start receiving tuition requests from parents.
          </p>
          <div className="mt-6">
            <button
              onClick={() => go("auth")}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-gray-50 transition-colors"
              style={{ color: C.primary }}
            >
              Apply as a tutor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
