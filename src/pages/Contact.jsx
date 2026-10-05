import { useState } from "react";
import { C } from "../constants/tokens";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { Mail, Phone, MapPin } from "lucide-react";
import { postToAPI } from "../api";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSent(false);
    if (!name.trim() || !email.trim().toLowerCase().endsWith("@gmail.com") || message.trim().length < 5) {
      setError("Enter your name, a Gmail address, and a message.");
      return;
    }
    setSending(true);
    try {
      await postToAPI("/support-messages", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      });
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.message || "Could not send the message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 min-h-[60vh]">
      <h1 className="text-4xl font-bold mb-6" style={{ color: C.text }}>Contact Us</h1>
      <p className="text-lg leading-relaxed mb-12 max-w-2xl" style={{ color: C.textSecondary }}>
        Have questions? Send a message and an admin will see it in the support inbox.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Your Name" className="w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-blue-500" style={{ borderColor: C.border, background: C.surface }} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@gmail.com" className="w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-blue-500" style={{ borderColor: C.border, background: C.surface }} />
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help you?" rows="5" className="w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-blue-500" style={{ borderColor: C.border, background: C.surface }}></textarea>
          {error && <p className="text-sm" style={{ color: C.error }}>{error}</p>}
          {sent && <p className="text-sm font-semibold" style={{ color: C.primary }}>Message sent to the admin.</p>}
          <PrimaryButton type="submit" disabled={sending}>{sending ? "Sending..." : "Send Message"}</PrimaryButton>
        </form>

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
              <p style={{ color: C.textSecondary }}>01234567890</p>
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
