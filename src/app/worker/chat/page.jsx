"use client";

import React from "react";

const WorkerChat = () => {
  return (
    <div className="p-10 h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white h-full rounded-[3rem] shadow-xl shadow-[#006a28]/5 border border-slate-100 overflow-hidden flex">
        
        {/* Contacts Sidebar */}
        <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-10 border-b border-slate-100">
            <h2 className="text-2xl font-black text-[#06361f] tracking-tight">Messages</h2>
            <div className="mt-6 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#548064] text-xl">search</span>
              <input type="text" placeholder="Search team..." className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-[#006a28] outline-none" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {[
              { name: "Rajesh (Site Lead)", role: "Emerald Heights", online: true },
              { name: "Site Office", role: "HQ - Inventory", online: false },
              { name: "Amit Verma", role: "Safety Officer", online: true },
            ].map((contact, i) => (
              <div key={i} className={`flex items-center gap-4 p-5 rounded-[1.5rem] cursor-pointer transition-all ${i === 0 ? "bg-[#006a28] text-white shadow-lg shadow-[#006a28]/20" : "hover:bg-[#f0fff4] text-[#06361f]"}`}>
                <div className="relative flex-shrink-0">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-200 border-2 ${i === 0 ? "border-white/20" : "border-white shadow-sm"}`}></div>
                  {contact.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4bee74] border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate">{contact.name}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${i === 0 ? "text-white/60" : "text-[#548064]"}`}>{contact.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative bg-[#fdfdfd]">
          {/* Header */}
          <div className="h-24 px-10 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 shadow-sm border-2 border-white"></div>
              <div>
                <h3 className="font-black text-lg text-[#06361f]">Rajesh (Site Lead)</h3>
                <p className="text-[10px] font-black text-[#006a28] uppercase tracking-widest">Online • Field Lead</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 rounded-2xl bg-[#f0fff4] text-[#006a28] flex items-center justify-center hover:scale-105 transition-transform"><span className="material-symbols-outlined">call</span></button>
              <button className="w-12 h-12 rounded-2xl bg-[#f0fff4] text-[#006a28] flex items-center justify-center hover:scale-105 transition-transform"><span className="material-symbols-outlined">videocam</span></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
            <div className="flex justify-center">
              <span className="text-[10px] font-black bg-slate-100 px-4 py-1.5 rounded-full text-[#548064] uppercase tracking-widest">Today</span>
            </div>

            <div className="flex justify-end">
              <div className="bg-[#006a28] text-white p-6 rounded-3xl rounded-tr-none max-w-[70%] shadow-lg shadow-[#006a28]/10">
                <p className="text-sm font-medium leading-relaxed">Rajesh, the HVAC ducts for Floor 14 Corridor A are arriving. Should I start staging them near the elevator?</p>
                <p className="text-[9px] text-white/50 mt-3 text-right font-black">09:42 AM</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-200 self-end shadow-md"></div>
              <div className="bg-white border border-slate-100 p-6 rounded-3xl rounded-tl-none max-w-[70%] shadow-sm">
                <p className="text-sm font-medium text-[#06361f] leading-relaxed">Yes, Arjun. Please stage them there. I&apos;ll be coming up in 20 minutes to review the installation plan.</p>
                <p className="text-[9px] text-[#548064] mt-3 font-black">09:45 AM</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-8 bg-white border-t border-slate-100">
            <div className="bg-slate-50 p-3 rounded-[2rem] border border-slate-100 flex items-center gap-4 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#006a28]/5 transition-all">
              <button className="w-12 h-12 text-[#548064] hover:text-[#006a28] rounded-full flex items-center justify-center transition-all"><span className="material-symbols-outlined">add_circle</span></button>
              <input type="text" placeholder="Type a quick update..." className="flex-1 bg-transparent border-none outline-none py-4 text-sm font-medium text-[#06361f] placeholder:text-[#548064]" />
              <button className="w-12 h-12 bg-[#006a28] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#006a28]/20 hover:scale-105 active:scale-95 transition-all"><span className="material-symbols-outlined">send</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerChat;
