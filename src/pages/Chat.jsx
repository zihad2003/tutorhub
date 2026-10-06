import { C } from "../constants/tokens";
import { PrimaryButton, Input } from "../components/ui";
import { CHATS } from "../data/mockData";
import { fetchFromAPI, fileUrl, postToAPI } from "../api";
import { Send, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

function initials(name) {
  return String(name || "?").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function Avatar({ name, src, size = "h-12 w-12" }) {
  if (!src) {
    return (
      <div className={`flex ${size} items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700`}>
        {initials(name)}
      </div>
    );
  }
  return <img src={fileUrl(src)} alt={name} className={`${size} rounded-full object-cover`} />;
}

const ADMIN_SUPPORT_CHATS = [
  {
    id: 201,
    name: "Rafiq Ahmed (Tutor - Ticket #201)",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    lastMessage: "Thank you for verifying my certificate so quickly!",
    lastMessageTime: "1 hour ago",
    unread: 0,
    messages: [
      { id: 1, sender: "user", text: "Hello Admin, I uploaded my BSc physics certificate 2 days ago. Could you please check the status?", time: "Yesterday, 4:00 PM" },
      { id: 2, sender: "admin", text: "Hi Rafiq! We reviewed your documents. Your certificate has been approved and verified badge is active.", time: "Today, 10:00 AM" },
      { id: 3, sender: "user", text: "Thank you for verifying my certificate so quickly!", time: "Today, 11:15 AM" },
    ],
  },
  {
    id: 202,
    name: "Abdul Rahman (Parent - Ticket #202)",
    img: "https://i.pravatar.cc/150?img=33",
    lastMessage: "We have confirmed your payment receipt. Status updated!",
    lastMessageTime: "3 hours ago",
    unread: 1,
    messages: [
      { id: 1, sender: "user", text: "Hi Admin, I made a bKash payment for July lessons but the status still says pending.", time: "Yesterday, 8:00 PM" },
      { id: 2, sender: "admin", text: "We have confirmed your payment receipt. Status updated!", time: "Today, 9:00 AM" },
    ],
  },
  {
    id: 203,
    name: "Farhana Islam (Tutor - Ticket #203)",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    lastMessage: "Can I update my teaching location to Gulshan?",
    lastMessageTime: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, sender: "user", text: "Can I update my teaching location to Gulshan?", time: "Yesterday, 2:00 PM" },
      { id: 2, sender: "admin", text: "Yes, you can edit your location in your account settings.", time: "Yesterday, 3:00 PM" },
    ],
  },
];

export function Chat({ onNavigate, role = "parent", account = null }) {
  const isAdmin = role === "admin";
  const isTutor = role === "tutor";
  const own = account && !account.demo && account.id;
  const ownerKey = isTutor ? "tutorId" : "parentId";
  const [ownChats, setOwnChats] = useState([]);
  const activeChats = isAdmin ? ADMIN_SUPPORT_CHATS : own ? ownChats : CHATS;
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const [query, setQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const displayName = (chat) => (isTutor ? chat.parentName : chat.tutorName) || chat.name || "Conversation";
  const displayImage = (chat) => (isTutor ? "" : chat.tutorImg || chat.img || "");

  useEffect(() => {
    if (!own || isAdmin) return undefined;
    let cancelled = false;
    async function load() {
      try {
        const rows = await fetchFromAPI("/chats");
        if (cancelled || !Array.isArray(rows)) return;
        const mine = rows.filter((chat) => Number(chat[ownerKey]) === Number(account.id));
        setOwnChats(mine);
        setSelectedChat((current) => {
          if (!current) return mine[0] || null;
          return mine.find((chat) => chat.id === current.id) || current;
        });
      } catch {
        if (!cancelled) setOwnChats([]);
      }
    }
    load();
    const timer = setInterval(load, 4000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [own, isAdmin, account?.id, ownerKey]);

  const visibleChats = activeChats.filter((chat) => {
    const name = displayName(chat).toLowerCase();
    return name.includes(query.trim().toLowerCase());
  });

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowMobileChat(true);
    setSendError("");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!selectedChat || !text) return;
    if (!own || isAdmin) {
      setSelectedChat((prev) => ({
        ...prev,
        messages: [
          ...(prev.messages || []),
          { id: Date.now(), sender: isAdmin ? "admin" : isTutor ? "tutor" : "parent", text, time: "Just now" },
        ],
      }));
      setMessage("");
      return;
    }
    setSendError("");
    try {
      const saved = await postToAPI(`/chats/${selectedChat.id}/messages`, {
        text,
        sender: isTutor ? "tutor" : "parent",
        tutorId: isTutor ? account.id : selectedChat.tutorId,
        parentId: isTutor ? selectedChat.parentId : account.id,
      });
      setOwnChats((current) => current.map((chat) => (chat.id === saved.id ? saved : chat)));
      setSelectedChat(saved);
      setMessage("");
    } catch (error) {
      setSendError(error.message || "The message could not be sent.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 lg:ml-64">
        <div className="flex h-screen flex-col">
          <div className="border-b px-4 py-3 sm:px-6 sm:py-4" style={{ borderColor: C.border }}>
            <h1 className="text-xl font-semibold" style={{ color: C.text }}>
              {isAdmin ? "Admin Support Desk & Inquiry Tickets" : "Messages"}
            </h1>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Conversation List Panel */}
            <div 
              className={`w-full border-r lg:w-80 lg:block ${
                showMobileChat ? "hidden" : "block"
              }`} 
              style={{ borderColor: C.border }}
            >
              <div className="p-4">
                <Input
                  placeholder={isAdmin ? "Search support tickets..." : "Search conversations..."}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
                {visibleChats.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm" style={{ color: C.textSecondary }}>
                    {own && isTutor
                      ? "No students yet. A conversation opens after a parent hires you."
                      : own
                        ? "No tutors hired yet. Hire a tutor to start a conversation."
                        : "No conversations yet."}
                  </p>
                ) : visibleChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`flex w-full items-start gap-3 p-4 text-left transition-colors duration-150 ${
                      selectedChat?.id === chat.id ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <Avatar name={displayName(chat)} src={displayImage(chat)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold" style={{ color: C.text }}>
                          {displayName(chat)}
                        </p>
                        <span className="shrink-0 text-xs" style={{ color: C.textSecondary }}>
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs" style={{ color: C.textSecondary }}>
                        {chat.lastMessage || chat.subject || "Start the conversation"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Chat Panel */}
            <div 
              className={`flex flex-1 flex-col ${
                !showMobileChat ? "hidden lg:flex" : "flex"
              }`}
            >
              {selectedChat ? (
                <>
                  <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4" style={{ borderColor: C.border }}>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setShowMobileChat(false)}
                        className="rounded p-1 text-gray-600 hover:bg-gray-100 lg:hidden"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <Avatar name={displayName(selectedChat)} src={displayImage(selectedChat)} size="h-10 w-10" />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.text }}>
                          {displayName(selectedChat)}
                        </p>
                        <p className="text-xs" style={{ color: C.textSecondary }}>
                          {isAdmin ? "User Ticket Active" : selectedChat.subject || "Hired"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="space-y-4">
                      {(selectedChat.messages || []).length === 0 && (
                        <p className="text-center text-sm" style={{ color: C.textSecondary }}>
                          Send a message to start this conversation.
                        </p>
                      )}
                      {(selectedChat.messages || []).map((msg) => {
                        const isSelf = isAdmin ? msg.sender === "admin" : isTutor ? msg.sender === "tutor" : msg.sender === "parent";
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-md rounded-lg px-4 py-2 ${
                                isSelf
                                  ? "bg-blue-600 text-white"
                                  : "border"
                              }`}
                              style={
                                !isSelf
                                  ? { borderColor: C.border, background: C.surface, color: C.text }
                                  : {}
                              }
                            >
                              <p className="text-sm">{msg.text}</p>
                              <p
                                className={`mt-1 text-xs ${
                                  isSelf ? "text-white/70" : ""
                                }`}
                                style={!isSelf ? { color: C.textSecondary } : {}}
                              >
                                {msg.time}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <form onSubmit={handleSend} className="border-t px-4 py-3 sm:px-6 sm:py-4" style={{ borderColor: C.border }}>
                    {sendError && <p className="mb-2 text-sm text-red-600">{sendError}</p>}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder={isAdmin ? "Reply to support ticket..." : "Type a message..."}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none transition-shadow duration-150 focus:ring-2"
                        style={{ borderColor: C.border, color: C.text }}
                        onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${C.primary}33`)}
                        onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                      />
                      <PrimaryButton type="submit" size="sm">
                        <Send size={16} />
                      </PrimaryButton>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-sm" style={{ color: C.textSecondary }}>
                    Select a conversation to start messaging
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
