import { useEffect, useState } from "react";
import { C } from "../constants/tokens";
import { fetchFromAPI } from "../api";

export function SupportInbox() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchFromAPI("/support-messages")
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]));
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:ml-64">
      <div className="mx-auto max-w-[900px]">
        <h1 className="text-2xl font-semibold" style={{ color: C.text }}>Support messages</h1>
        <p className="mt-1 text-sm" style={{ color: C.textSecondary }}>Messages sent from Contact Support.</p>
        <div className="mt-6 space-y-4">
          {messages.length === 0 && (
            <p className="rounded-xl border p-6 text-sm" style={{ borderColor: C.border, color: C.textSecondary }}>
              No messages yet.
            </p>
          )}
          {messages.map((item) => (
            <article key={item.id} className="rounded-xl border bg-white p-5" style={{ borderColor: C.border }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold" style={{ color: C.text }}>{item.name}</p>
                <p className="text-xs" style={{ color: C.textSecondary }}>{item.email}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: C.text }}>{item.message}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
