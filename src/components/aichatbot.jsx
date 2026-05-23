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
    document.getElementById("ai-chat")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      document.getElementById("ai-chat-input")?.focus();
    }, 400);
  }

  return (
    <section
      id="ai-chat"
      className="bg-[#f8faf9] py-24 px-4 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#006a28]/[0.02] -skew-x-12 transform translate-x-32" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 bg-[#f0fff4] border border-[#006a28]/10 px-4 py-2 rounded-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006a28] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006a28]" />
              </span>
              <span className="text-[10px] font-black text-[#006a28] uppercase tracking-widest">
                Nirman AI Assistant Online
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-[#06361f] leading-[1.1] tracking-tight">
              Ready to Start Your{" "}
              <span className="text-[#006a28]">Dream Project?</span>
            </h2>
            <p className="text-lg text-[#548064] font-medium leading-relaxed max-w-xl">
              Skip the wait. Chat with our intelligent assistant to get instant
              estimates, design suggestions, and project insights in real-time.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={scrollToChat}
                className="bg-[#006a28] text-white font-black px-10 py-5 rounded-2xl flex items-center gap-3 shadow-2xl shadow-[#006a28]/20 hover:bg-[#06361f] transition-all active:scale-95 group text-sm uppercase tracking-widest"
              >
                Start Consultation
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <div className="flex -space-x-3 items-center ml-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="Expert"
                    />
                  </div>
                ))}
                <div className="pl-6 text-[11px] font-black text-[#548064] uppercase tracking-wider">
                  Joined by 200+ clients today
                </div>
              </div>
            </div>
          </div>

          {/* Right Chat Interface */}
          <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="absolute inset-0 bg-gradient-to-br from-[#006a28] to-cyan-500 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />

            <div className="relative bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[520px]">
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#006a28] flex items-center justify-center text-white shadow-lg">
                    <span className="material-symbols-outlined text-xl">
                      smart_toy
                    </span>
                  </div>
                  <div>
                    <p className="font-black text-sm text-[#06361f]">
                      Nirman AI Expert
                    </p>
                    <p className="text-[10px] font-bold text-[#006a28] uppercase tracking-widest">
                      Always Active
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={chatRef}
                className="flex-1 p-8 space-y-6 overflow-y-auto hide-scrollbar"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-sm text-[#006a28]">
                          smart_toy
                        </span>
                      </div>
                    )}
                    <div
                      className={
                        msg.role === "user"
                          ? "bg-[#006a28] p-5 rounded-3xl rounded-tr-none text-sm font-medium text-white leading-relaxed max-w-[80%] shadow-xl shadow-[#006a28]/10"
                          : "bg-slate-100 p-5 rounded-3xl rounded-tl-none text-sm font-medium text-[#06361f] leading-relaxed max-w-[90%] shadow-sm"
                      }
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-sm text-[#006a28]">
                        smart_toy
                      </span>
                    </div>
                    <div className="flex gap-2 items-center ml-1 py-3">
                      <span className="w-1.5 h-1.5 bg-[#006a28]/40 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-[#006a28]/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-[#006a28]/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-slate-50/50 border-t border-slate-50">
                <div className="relative">
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
                    placeholder="Ask about materials, cost, or designs..."
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-16 text-sm outline-none focus:ring-4 focus:ring-[#006a28]/5 focus:border-[#006a28] transition-all font-medium disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#006a28] text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-[#06361f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
