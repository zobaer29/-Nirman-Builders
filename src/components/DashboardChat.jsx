"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const COPY = {
  user: {
    title: "Messages",
    search: "Search chats...",
    input: "Type your message...",
    empty: "Other active users will appear here after accounts are created.",
  },
  worker: {
    title: "Communication",
    search: "Search team...",
    input: "Type a quick update...",
    empty: "Other active users will appear here after accounts are created.",
  },
  contractor: {
    title: "Communication",
    search: "Search messages...",
    input: "Type your message...",
    empty: "Other active users will appear here after accounts are created.",
  },
  admin: {
    title: "Messages",
    search: "Search messages...",
    input: "Type your message...",
    empty: "Users will appear here after accounts are created.",
  },
};

function getInitial(name) {
  return (name || "U").trim().charAt(0).toUpperCase();
}

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function Avatar({ contact, size = "md" }) {
  const sizeClass =
    size === "sm" ? "w-9 h-9 rounded-xl" : "w-12 h-12 rounded-2xl";

  if (contact?.avatar) {
    return (
      <img
        src={contact.avatar}
        alt={contact.name}
        className={`${sizeClass} object-cover border-2 border-white shadow-sm`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`${sizeClass} bg-[#006a28] text-white flex items-center justify-center font-black shadow-sm`}
    >
      {getInitial(contact?.name)}
    </div>
  );
}

export default function DashboardChat({ variant = "user" }) {
  const copy = COPY[variant] || COPY.user;
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);

  const activeConversation = conversations.find(
    (conversation) => Number(conversation.conversationId) === Number(activeId),
  );

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;

    return conversations.filter((conversation) =>
      [conversation.name, conversation.role, conversation.lastMessage]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [conversations, search]);

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/conversations", {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load chats");

      setConversations(data.conversations || []);
      setActiveId((current) => {
        if (
          current &&
          data.conversations?.some((item) => item.conversationId === current)
        ) {
          return current;
        }
        return data.conversations?.[0]?.conversationId || null;
      });
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load chats");
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      setLoadingMessages(true);
      const res = await fetch(`/api/messages/${conversationId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load messages");

      setMessages(data.messages || []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, [loadConversations]);

  useEffect(() => {
    loadMessages(activeId);
    if (!activeId) return undefined;

    const interval = setInterval(() => loadMessages(activeId), 3000);
    return () => clearInterval(interval);
  }, [activeId, loadMessages]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loadingMessages]);

  async function sendMessage(event) {
    event.preventDefault();

    const body = input.trim();
    if (!body || !activeId || sending) return;

    setSending(true);
    setInput("");

    try {
      const res = await fetch(`/api/messages/${activeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setMessages((current) => [...current, data.message]);
      await loadConversations();
      setError("");
    } catch (err) {
      setInput(body);
      setError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] w-full flex bg-white rounded-[2rem] shadow-xl shadow-[#006a28]/5 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <aside className="w-full max-w-sm border-r border-slate-100 flex flex-col bg-slate-50/60">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-2xl font-black text-[#06361f] tracking-tight">
            {copy.title}
          </h2>
          <span className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#006a28]">
            <span className="material-symbols-outlined text-[20px]">chat</span>
          </span>
        </div>

        <div className="p-5">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#548064] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={copy.search}
              className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#006a28] outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {loadingContacts && (
            <div className="p-5 text-sm font-semibold text-[#548064]">
              Loading chats...
            </div>
          )}

          {!loadingContacts && filteredConversations.length === 0 && (
            <div className="p-5 text-sm font-semibold text-[#548064] leading-relaxed">
              {copy.empty}
            </div>
          )}

          {filteredConversations.map((conversation) => {
            const active =
              Number(activeId) === Number(conversation.conversationId);

            return (
              <button
                type="button"
                key={conversation.conversationId}
                onClick={() => setActiveId(conversation.conversationId)}
                className={`w-full flex items-center gap-4 p-4 text-left cursor-pointer transition-all rounded-[1.5rem] ${
                  active
                    ? "bg-[#006a28] text-white shadow-lg shadow-[#006a28]/20"
                    : "hover:bg-[#f0fff4] text-[#06361f]"
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar contact={conversation} />
                  {conversation.online && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4bee74] border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5 gap-3">
                    <h4 className="font-black text-sm truncate tracking-tight">
                      {conversation.name}
                    </h4>
                    <span
                      className={`text-[9px] font-bold uppercase shrink-0 ${
                        active ? "text-white/60" : "text-[#548064]"
                      }`}
                    >
                      {conversation.time}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest truncate ${
                      active ? "text-white/60" : "text-[#006a28]"
                    }`}
                  >
                    {conversation.role}
                  </p>
                  <div className="flex justify-between items-center mt-1 gap-2">
                    <p
                      className={`text-xs truncate ${
                        active ? "text-white/80" : "text-[#548064]"
                      }`}
                    >
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && !active && (
                      <span className="shrink-0 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-white relative min-w-0">
        {activeConversation ? (
          <>
            <header className="h-24 px-8 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md z-10">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative shrink-0">
                  <Avatar contact={activeConversation} />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4bee74] border-2 border-white rounded-full" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-lg text-[#06361f] tracking-tight truncate">
                    {activeConversation.name}
                  </h3>
                  <p className="text-[10px] font-black text-[#006a28] uppercase tracking-widest truncate">
                    {activeConversation.role}
                  </p>
                </div>
              </div>
            </header>

            {error && (
              <div className="mx-8 mt-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-100 px-4 py-3 text-sm font-semibold">
                {error}
              </div>
            )}

            <section
              ref={listRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fdfdfd]"
            >
              <div className="flex justify-center">
                <span className="text-[10px] font-black bg-slate-100 px-4 py-1.5 rounded-full text-[#548064] uppercase tracking-[0.2em]">
                  Conversation
                </span>
              </div>

              {loadingMessages && messages.length === 0 && (
                <p className="text-center text-sm font-semibold text-[#548064]">
                  Loading messages...
                </p>
              )}

              {!loadingMessages && messages.length === 0 && (
                <p className="text-center text-sm font-semibold text-[#548064]">
                  No messages yet. Send the first update.
                </p>
              )}

              {messages.map((message) => {
                const mine = message.isMine;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${mine ? "justify-end" : ""}`}
                  >
                    {!mine && (
                      <div className="self-end">
                        <Avatar contact={activeConversation} size="sm" />
                      </div>
                    )}
                    <div
                      className={
                        mine
                          ? "bg-[#006a28] text-white p-5 rounded-3xl rounded-tr-none max-w-[72%] shadow-lg shadow-[#006a28]/10"
                          : "bg-white text-[#06361f] border border-slate-100 p-5 rounded-3xl rounded-tl-none max-w-[72%] shadow-sm"
                      }
                    >
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap break-words">
                        {message.body}
                      </p>
                      <p
                        className={`text-[9px] mt-2 font-black ${
                          mine ? "text-white/50 text-right" : "text-[#548064]"
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </section>

            <form
              onSubmit={sendMessage}
              className="p-6 bg-white border-t border-slate-100"
            >
              <div className="flex items-end gap-3 bg-slate-50 p-3 rounded-[2rem] border border-slate-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#006a28]/5 transition-all">
                <button
                  type="button"
                  className="w-12 h-12 text-[#548064] hover:text-[#006a28] hover:bg-[#f0fff4] transition-all rounded-full shrink-0 flex items-center justify-center"
                ></button>

                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage(event);
                    }
                  }}
                  className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[48px] py-3.5 text-sm text-[#06361f] placeholder:text-[#548064] font-medium"
                  placeholder={copy.input}
                  rows={1}
                  disabled={sending}
                />

                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="w-12 h-12 bg-[#006a28] text-white hover:bg-[#005a22] transition-all rounded-2xl flex shrink-0 items-center justify-center shadow-lg shadow-[#006a28]/20 active:scale-90 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {sending ? "hourglass_top" : "send"}
                  </span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-[#f0fff4] text-[#006a28] flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-3xl">
                  forum
                </span>
              </div>
              <h3 className="text-xl font-black text-[#06361f] mb-2">
                No active chats
              </h3>
              <p className="text-sm font-semibold text-[#548064] leading-relaxed">
                {copy.empty}
              </p>
              {error && (
                <p className="mt-4 text-sm font-semibold text-rose-600">
                  {error}
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
