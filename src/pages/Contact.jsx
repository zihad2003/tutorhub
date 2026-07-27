import { C } from "../constants/tokens";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { Mail, Phone, MapPin } from "lucide-react";

export function Contact() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6" style={{ color: C.text }}>Contact Us</h1>
      <p className="text-lg leading-relaxed mb-12 max-w-2xl" style={{ color: C.textSecondary }}>
        Have questions? We're here to help. Reach out to our support team using the form below or through our contact information.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <input type="text" placeholder="Your Name" className="w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-blue-500" style={{ borderColor: C.border, background: C.surface }} />
          <input type="email" placeholder="Your Email" className="w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-blue-500" style={{ borderColor: C.border, background: C.surface }} />
          <textarea placeholder="How can we help you?" rows="5" className="w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-blue-500" style={{ borderColor: C.border, background: C.surface }}></textarea>
          <PrimaryButton>Send Message</PrimaryButton>
        </div>
        
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="rounded-full p-3 bg-blue-50">
              <Mail size={24} color={C.primary} />
            </div>
            <div>
              <h4 className="font-semibold text-lg" style={{ color: C.text }}>Email Us</h4>
              <p style={{ color: C.textSecondary }}>support@tutorhub.bd</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-full p-3 bg-blue-50">
              <Phone size={24} color={C.primary} />
            </div>
            <div>
              <h4 className="font-semibold text-lg" style={{ color: C.text }}>Call Us</h4>
              <p style={{ color: C.textSecondary }}>+880 1XXX-XXXXXX</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-full p-3 bg-blue-50">
              <MapPin size={24} color={C.primary} />
            </div>
            <div>
              <h4 className="font-semibold text-lg" style={{ color: C.text }}>Visit Us</h4>
              <p style={{ color: C.textSecondary }}>Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
