import { C } from "../constants/tokens";
import { PrimaryButton, Input } from "../components/ui";
import { CHATS } from "../data/mockData";
import { Send, MoreVertical } from "lucide-react";
import { useState } from "react";

export function Chat({ onNavigate }) {
  const [selectedChat, setSelectedChat] = useState(CHATS[0]);
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <div className="flex min-h-screen bg-white lg:block">
      <div className="flex-1 lg:ml-64">
        <div className="flex h-screen flex-col">
          <div className="border-b px-6 py-4" style={{ borderColor: C.border }}>
            <h1 className="text-xl font-semibold" style={{ color: C.text }}>Messages</h1>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="hidden w-80 border-r lg:block" style={{ borderColor: C.border }}>
              <div className="p-4">
                <Input placeholder="Search conversations..." />
              </div>
              <div className="space-y-1">
                {CHATS.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`flex w-full items-start gap-3 p-4 transition-colors duration-150 ${
                      selectedChat.id === chat.id ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={chat.tutorImg}
                        alt={chat.tutorName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {chat.unread > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold" style={{ color: C.text }}>
                          {chat.tutorName}
                        </p>
                        <span className="text-xs" style={{ color: C.textSecondary }}>
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs" style={{ color: C.textSecondary }}>
                        {chat.lastMessage}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col">
              {selectedChat ? (
                <>
                  <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: C.border }}>
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedChat.tutorImg}
                        alt={selectedChat.tutorName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: C.text }}>
                          {selectedChat.tutorName}
                        </p>
                        <p className="text-xs" style={{ color: C.textSecondary }}>Online</p>
                      </div>
                    </div>
                    <button className="rounded p-2 transition-colors duration-150 hover:bg-gray-100">
                      <MoreVertical size={18} color={C.textSecondary} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                      {selectedChat.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === "parent" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-md rounded-lg px-4 py-2 ${
                              msg.sender === "parent"
                                ? "bg-blue-600 text-white"
                                : "border"
                            }`}
                            style={
                              msg.sender === "tutor"
                                ? { borderColor: C.border, background: C.surface, color: C.text }
                                : {}
                            }
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p
                              className={`mt-1 text-xs ${
                                msg.sender === "parent" ? "text-white/70" : ""
                              }`}
                              style={msg.sender === "tutor" ? { color: C.textSecondary } : {}}
                            >
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSend} className="border-t px-6 py-4" style={{ borderColor: C.border }}>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Type a message..."
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
