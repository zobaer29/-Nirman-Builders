"use client";

import { useState, useRef, useEffect } from "react";

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hello! I'm your Nirman AI assistant. How can I help you build your dream project today?",
};

export default function Aichatbot() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    document.getElementById("ai-chat-input")?.focus();
  }, []);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't respond right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function scrollToChat() {
    document.getElementById("ai-chat")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      document.getElementById("ai-chat-input")?.focus();
    }, 400);
  }

  return (
    <section
      id="ai-chat"
      className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20"
    >
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-200/5 to-teal-200/5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,106,40,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,106,40,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-emerald-200/50 px-5 py-2.5 rounded-2xl shadow-lg shadow-emerald-100/50">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-lg shadow-emerald-500/50" />
              </span>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                Nirman AI Online
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-slate-800 leading-[1.1] tracking-tight">
              Ready to Build Your{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Dream Project?
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M0 6 Q50 12 100 6 Q150 0 200 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-emerald-300"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
              Get instant construction estimates, material advice, and project
              planning support from AI.
            </p>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={scrollToChat}
                className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all active:scale-95 text-sm uppercase tracking-widest overflow-hidden"
              >
                <span className="relative z-10">Start Chat</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 border-2 border-white shadow-md"
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Trusted by 1000+ builders
                </span>
              </div>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-3">
              {["Cost Estimation", "Material Guide", "Project Planning", "24/7 Support"].map(
                (feature) => (
                  <span
                    key={feature}
                    className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl text-xs font-semibold text-slate-600 shadow-sm"
                  >
                    {feature}
                  </span>
                )
              )}
            </div>
          </div>

          {/* RIGHT CHAT BOX */}
          <div className="relative">
            {/* Chat box shadow effects */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2.75rem] opacity-20 blur-xl" />
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-[3rem] opacity-10 blur-2xl" />
            
            <div className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/50 overflow-hidden flex flex-col h-[580px]">
              {/* Animated gradient border top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 animate-gradient" />

              {/* HEADER */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white via-emerald-50/50 to-white">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                      <span className="material-symbols-outlined text-xl">
                        smart_toy
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-slate-800">
                      Nirman AI Expert
                    </p>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Always Active
                    </p>
                  </div>
                </div>
                
                <button className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-slate-600 text-lg">
                    more_vert
                  </span>
                </button>
              </div>

              {/* CHAT MESSAGES */}
              <div
                ref={chatRef}
                className="flex-1 p-6 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : ""
                    } animate-fadeIn`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-sm text-emerald-600">
                          smart_toy
                        </span>
                      </div>
                    )}

                    <div
                      className={
                        msg.role === "user"
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl rounded-tr-md text-sm text-white max-w-[80%] shadow-lg shadow-emerald-200 relative"
                          : "bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 p-4 rounded-2xl rounded-tl-md text-sm text-slate-700 max-w-[85%] shadow-md relative"
                      }
                    >
                      <div className="relative z-10">{msg.content}</div>
                      {/* Chat bubble arrow */}
                      <div
                        className={`absolute top-0 ${
                          msg.role === "user"
                            ? "-right-2 border-l-emerald-500"
                            : "-left-2 border-r-white"
                        } w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ${
                          msg.role === "user"
                            ? "border-l-[12px]"
                            : "border-r-[12px]"
                        }`}
                      />
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3 animate-fadeIn">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-sm text-emerald-600">
                        smart_toy
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-4 py-3 bg-gradient-to-br from-white to-slate-50 rounded-2xl rounded-tl-md border border-slate-200/50 shadow-md">
                      {[0, 1, 2].map((dot) => (
                        <span
                          key={dot}
                          className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce shadow-sm"
                          style={{ animationDelay: `${dot * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* INPUT */}
              <div className="p-5 border-t border-slate-200/50 bg-gradient-to-r from-white via-slate-50/50 to-white">
                <div className="relative group">
                  <input
                    id="ai-chat-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={loading}
                    placeholder="Ask about cost, materials, or design..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-5 pr-14 text-sm outline-none transition-all focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 shadow-sm group-hover:shadow-md group-hover:border-slate-300"
                  />

                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg"
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      <span className="material-symbols-outlined">send</span>
                    )}
                  </button>
                </div>
                
                {/* Quick suggestions */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-none">
                  {["Estimate cost", "Materials needed", "Project timeline"].map(
                    (suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                          document.getElementById("ai-chat-input")?.focus();
                        }}
                        className="shrink-0 px-3 py-1.5 text-xs font-medium bg-white/80 hover:bg-white border border-slate-200/50 rounded-xl text-slate-600 hover:text-emerald-700 hover:border-emerald-200 transition-all shadow-sm"
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 3px;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}