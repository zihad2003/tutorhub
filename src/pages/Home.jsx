import { Search, Users, BookOpen, Shield, ChevronRight } from "lucide-react";
import { C } from "../constants/tokens";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { TextButton } from "../components/ui/TextButton";
import { TutorCard } from "../components/ui/TutorCard";
import { TUTORS } from "../data/tutors";
import { useState, useEffect } from "react";

const TYPING_WORDS = ["your child", "Math", "Physics", "English", "Science"];

export function Home({ go, openTutor }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const word = TYPING_WORDS[currentWordIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length - 1));
        if (currentText.length <= 1) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % TYPING_WORDS.length);
        }
      }, 50);
    } else {
      timer = setTimeout(() => {
        setCurrentText(word.substring(0, currentText.length + 1));
        if (currentText.length === word.length) {
          timer = setTimeout(() => setIsDeleting(true), 2000);
        }
      }, 100);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

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
      <section className="relative bg-[#f8fafc] px-4 pt-16 pb-12 sm:px-6 lg:pt-24 lg:pb-20 overflow-hidden border-b" style={{ borderColor: C.border }}>
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="mx-auto max-w-[1200px] relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Typography & Search */}
          <div className="flex flex-col items-start pt-8">
            
            {/* Pill Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 shadow-sm bg-white" style={{ borderColor: C.border }}>
              <span className="flex h-2 w-2 rounded-full" style={{ background: C.primary }}></span>
              <span className="text-sm font-semibold tracking-wide" style={{ color: C.text }}>1,200+ Verified Tutors</span>
            </div>

            {/* Typography */}
            <h1 className="text-[3.5rem] font-bold leading-[1.05] tracking-tighter sm:text-[5rem] lg:text-[5.5rem] uppercase" style={{ color: '#0f172a' }}>
              Find The <br />
              Right Tutor <br />
              <span style={{ color: C.primary }} className="lowercase italic">{currentText}</span>
              <span className="animate-pulse" style={{ color: C.primary }}>|</span>
            </h1>
            
            {/* Subtext */}
            <div className="mt-8 relative">
              <p className="max-w-md text-lg font-medium leading-relaxed" style={{ color: C.textSecondary }}>
                Browse verified tutors, hire with confidence, and track every lesson and payment in one place.
              </p>
              
              <div className="absolute -right-8 -top-8 rotate-12 inline-flex items-center rounded-full border-2 border-white px-3 py-1 shadow-md text-xs font-bold" style={{ background: C.primary, color: 'white' }}>
                4.8/5 Rating ⭐
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-8 flex w-full max-w-md flex-col gap-2 rounded-lg border bg-white p-2 sm:flex-row shadow-sm" style={{ borderColor: C.border }}>
              <div className="flex flex-1 items-center gap-2 px-2">
                <Search size={18} color={C.textSecondary} />
                <input
                  type="text"
                  placeholder="Search by subject, e.g. Physics, Math..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 text-sm outline-none"
                  style={{ color: C.text }}
                />
              </div>
              <PrimaryButton type="submit">Find tutors</PrimaryButton>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-gray-200" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`, backgroundSize: 'cover' }}></div>
                ))}
              </div>
              <span className="text-xs font-semibold" style={{ color: C.textSecondary }}>Joined by 5,000+ students</span>
            </div>

          </div>

          {/* Right: 3D Graphic */}
          <div className="relative w-full h-[350px] lg:h-[600px] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: C.primary }}></div>
            
            <img src="/hero-tutor.png" alt="3D Tutor Illustration" className="relative z-10 w-full max-w-lg lg:max-w-xl h-auto object-contain drop-shadow-2xl hover:-translate-y-4 transition-transform duration-700 mix-blend-multiply" />
            
            <div className="absolute bottom-10 left-4 lg:-left-10 z-20 rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-xl border" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <BookOpen size={20} color={C.primary} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">Tracked</p>
                  <p className="text-sm font-bold text-gray-900">8,500+ Lessons</p>
                </div>
              </div>
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