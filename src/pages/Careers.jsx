import { C } from "../constants/tokens";

export function Careers() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6" style={{ color: C.text }}>Careers at TutorHub</h1>
      <p className="text-lg leading-relaxed mb-12 max-w-2xl" style={{ color: C.textSecondary }}>
        Join us in our mission to revolutionize education in Bangladesh. We are always looking for passionate individuals to join our core team.
      </p>
      
      <div className="rounded-2xl border p-8 bg-white shadow-sm" style={{ borderColor: C.border }}>
        <h3 className="text-2xl font-semibold mb-4" style={{ color: C.text }}>Open Positions</h3>
        <div className="py-8 text-center rounded-xl bg-gray-50 border border-dashed" style={{ borderColor: C.border }}>
          <p className="text-lg font-medium" style={{ color: C.textSecondary }}>Currently, there are no open positions.</p>
          <p className="mt-2 text-sm" style={{ color: C.textSecondary }}>Please check back later or send your resume to careers@tutorhub.bd</p>
        </div>
      </div>
    </div>
  );
}
