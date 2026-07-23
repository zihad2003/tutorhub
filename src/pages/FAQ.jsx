import { C } from "../constants/tokens";

export function FAQ() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-8" style={{ color: C.text }}>Frequently Asked Questions</h1>
      <div className="space-y-8 max-w-3xl">
        <div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: C.text }}>How do I find a tutor?</h3>
          <p className="leading-relaxed" style={{ color: C.textSecondary }}>You can search by subject and class on our homepage, or post a request to have tutors apply to you directly. Once you find a match, you can book a lesson directly.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: C.text }}>Are tutors verified?</h3>
          <p className="leading-relaxed" style={{ color: C.textSecondary }}>Yes! Every tutor undergoes a background check and credential verification before they can teach through TutorHub. We take safety very seriously.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: C.text }}>How do payments work?</h3>
          <p className="leading-relaxed" style={{ color: C.textSecondary }}>Payments are securely handled through our platform. Parents can pay monthly or per lesson, and tutors receive their earnings directly to their bank accounts or mobile wallets.</p>
        </div>
      </div>
    </div>
  );
}
