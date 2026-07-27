import { C } from "../constants/tokens";

export function About() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6" style={{ color: C.text }}>About TutorHub</h1>
      <p className="text-lg leading-relaxed mb-4 max-w-3xl" style={{ color: C.textSecondary }}>
        TutorHub is the premier platform connecting students and parents with qualified, verified home tutors in Dhaka. 
        Our mission is to make quality education accessible and to streamline the process of finding the perfect tutor.
      </p>
      <p className="text-lg leading-relaxed mb-4 max-w-3xl" style={{ color: C.textSecondary }}>
        We believe that finding the right educational support should be simple, safe, and transparent.
      </p>
    </div>
  );
}
