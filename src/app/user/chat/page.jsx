"use client";

import Image from "next/image";
import { useState } from "react";

export default function UserChat() {
    const [activeChat, setActiveChat] = useState("rajiv");

    const contacts = [
        {
            id: "rajiv",
            name: "Rajiv Nirman",
            role: "Head Architect",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ5SCJyy3yE3jJ26uyB8Z76Fa1ZnD5XNISGGGRQE5IKOqSJxLIjhoLzIMKdKVB7VKo0wdF4BEvIW_3u4pllA6ImobyBrhaynKJ7P0KETqwfPYaNNNrN3e425nmHYB5J37SVZZpehBiDWJMIVvni9UhBv_GGwRTH0had4iosqYbDSReKhI6rxnSy2fDxApiRcyrhn-zBE_YvDv1BfbResv7Hl8zr6QihzCV4QecBVfYzFyYGHkjXFCRNgqy8R6j8BZN3RkthEMWUy8",
            lastMessage: "I've sent the updated material specs.",
            time: "10:15 AM",
            unread: 0,
            online: true,
        },
        {
            id: "contractor",
            name: "Contractor Team (Rajesh)",
            role: "Site Contractor",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_CUie89XDmHw_MfEnVGNdSiSNAS3lHqTNLZA-6-a_9N3H0ukrD5OO2Xl_gx6MDIxcfJdByENEo6m9K4zlUJhphFYVbG7oxQGbuWBt4FznJJvLnnLgg6IacJf-TD7U6jlPu2x2qVTRb4-z_A3N9jMsgvZG6AB5AN0xhBDzKR1FrglBPffhlXK_fMsBtO6x88HdvymoPXvremz494J3b3N4f0GA5t1GzF3gnvX7Klw_5PgFrqmH2vqNtST1ZOE8gMfr-wAVtfrBipc",
            lastMessage: "Received. Checking them now.",
            time: "09:45 AM",
            unread: 2,
            online: true,
        },
        {
            id: "meera",
            name: "Meera Kapur",
            role: "Safety Officer",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkP4GoeKkEB-MHFdaLydpOrlIbO97rJd9OEEcNJcXMt9ag0olz8cpj91kUhOEkdewZDgg_NEnCZw_MAl5owRBHTLaKnVsJX3PG5eQAt-6mpwj_Aag3Erpsmzeja6s3bLbdxMqEtJLwNPZ2Sstxn5NW-44ul_Hh5_oBy5qmttrGl5HSuMEgDxxLhoDuCR1svBVSkPZ2GR-zE-N4UXHleBV1rPBEwCHZ8KSWd1mTou6cbzJs1fBI4wExkN2kwHFIc4Jl-_Rxto9BOT8",
            lastMessage: "Safety drill completed for Floor 14.",
            time: "Yesterday",
            unread: 0,
            online: false,
        },
        {
            id: "siddharth",
            name: "Siddharth V.",
            role: "Steel Fixer",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYNrlp3ER9xzypaAakOmuq3GM0zcuEWjrRI5X1PhCKHB1ghtsTrOtliR6_AEFMucOqtuyIaPtJMvtuZOSjjCd4pwc84IPDTRtdtXpiE2g-49zzZkV8Cp0_kWAf8WOhyfEJL2i6DV_vS3oHARIRpY7FVVDEp2KplTIKIyyx1hopBXgY6JPFSzzz1ThkRdszx8QiYaATPFwmi7dWfxpAACHeb62XwqoF-XxI520oN_W6UMZOVwjHnOu7g8IR0FyKvVkZCvM6ebukEjo",
            lastMessage: "Waiting for TMT bar delivery.",
            time: "Oct 22",
            unread: 0,
            online: false,
        },
    ];

    const activeUser = contacts.find((c) => c.id === activeChat);

    return (
        <div className="h-[calc(100vh-140px)] w-full flex bg-white rounded-[2.5rem] shadow-xl shadow-[#006a28]/5 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            {/* Sidebar: Contact List */}
            <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-2xl font-black font-headline text-[#06361f]">Messages</h2>
                    <button className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-[#f0fff4] flex items-center justify-center text-[#006a28] transition-all active:scale-90">
                        <span className="material-symbols-outlined text-[20px]">edit_square</span>
                    </button>
                </div>

                <div className="p-6">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#548064] text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full bg-white border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#006a28] outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => setActiveChat(contact.id)}
                            className={`flex items-center gap-4 p-4 cursor-pointer transition-all rounded-[1.5rem] ${activeChat === contact.id
                                    ? "bg-[#006a28] text-white shadow-lg shadow-[#006a28]/20"
                                    : "hover:bg-[#f0fff4] text-[#06361f]"
                                }`}
                        >
                            <div className="relative flex-shrink-0">
                                <img
                                    src={contact.avatar}
                                    alt={contact.name}
                                    className={`w-12 h-12 rounded-2xl object-cover border-2 ${activeChat === contact.id ? 'border-white/20' : 'border-white'}`}
                                />
                                {contact.online && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4bee74] border-2 border-white rounded-full"></div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h4 className="font-black text-sm truncate tracking-tight">{contact.name}</h4>
                                    <span className={`text-[9px] font-bold uppercase ${activeChat === contact.id ? 'text-white/60' : 'text-[#548064]'}`}>
                                        {contact.time}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-xs truncate ${activeChat === contact.id ? 'text-white/80' : 'text-[#548064]'}`}>
                                        {contact.lastMessage}
                                    </p>
                                    {contact.unread > 0 && activeChat !== contact.id && (
                                        <span className="flex-shrink-0 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                                            {contact.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white relative">
                {/* Chat Header */}
                <div className="h-24 px-8 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src={activeUser.avatar}
                                alt={activeUser.name}
                                className="w-12 h-12 rounded-2xl object-cover"
                            />
                            {activeUser.online && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4bee74] border-2 border-white rounded-full"></div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-[#06361f] tracking-tight">{activeUser.name}</h3>
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${activeUser.online ? 'bg-[#4bee74]' : 'bg-slate-300'}`}></span>
                                <p className="text-[10px] font-black text-[#006a28] uppercase tracking-widest">
                                    {activeUser.online ? "Online" : "Offline"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {[
                            { icon: "call", color: "text-[#006a28] bg-[#f0fff4]" },
                            { icon: "videocam", color: "text-[#006a28] bg-[#f0fff4]" },
                            { icon: "more_horiz", color: "text-[#548064] bg-slate-50" }
                        ].map((btn, i) => (
                            <button key={i} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all active:scale-90 ${btn.color}`}>
                                <span className="material-symbols-outlined text-[20px]">{btn.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fdfdfd] scrollbar-hide">
                    <div className="flex justify-center">
                        <span className="text-[10px] font-black bg-slate-100 px-4 py-1.5 rounded-full text-[#548064] uppercase tracking-[0.2em]">
                            Conversation Started
                        </span>
                    </div>

                    {/* Example Messages */}
                    <div className="flex justify-end">
                        <div className="bg-[#006a28] text-white p-5 rounded-3xl rounded-tr-none max-w-[70%] shadow-lg shadow-[#006a28]/10">
                            <p className="text-sm font-medium leading-relaxed">
                                Hi {activeUser.name.split(" ")[0]}, can we confirm the switch to granite for the kitchen island by tomorrow?
                            </p>
                            <p className="text-[9px] text-white/50 mt-2 text-right font-black">09:42 AM</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <img
                            src={activeUser.avatar}
                            alt={activeUser.name}
                            className="w-10 h-10 rounded-2xl self-end object-cover shadow-md"
                        />
                        <div className="bg-white text-[#06361f] border border-slate-100 p-5 rounded-3xl rounded-tl-none max-w-[70%] shadow-sm">
                            <p className="text-sm font-medium leading-relaxed">
                                Absolutely. I've sent the updated material specs to the site lead. We need your sign-off on the color sample.
                            </p>
                            <p className="text-[9px] text-[#548064] mt-2 font-black">10:15 AM</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-[#006a28] text-white p-5 rounded-3xl rounded-tr-none max-w-[70%] shadow-lg shadow-[#006a28]/10">
                            <div className="flex items-center gap-3 mb-3 bg-white/10 p-3 rounded-2xl border border-white/10">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white">picture_as_pdf</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black truncate max-w-[150px]">Material_Specs_v2.pdf</p>
                                    <p className="text-[9px] text-white/60">2.4 MB • PDF Document</p>
                                </div>
                            </div>
                            <p className="text-sm font-medium">
                                I'll check it right away and approve it on the dashboard.
                            </p>
                            <p className="text-[9px] text-white/50 mt-2 text-right font-black">10:20 AM</p>
                        </div>
                    </div>
                </div>

                {/* Chat Input Area */}
                <div className="p-6 bg-white border-t border-slate-100">
                    <div className="flex items-end gap-3 bg-slate-50 p-3 rounded-[2rem] border border-slate-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#006a28]/5 transition-all">
                        <button className="w-12 h-12 text-[#548064] hover:text-[#006a28] hover:bg-[#f0fff4] transition-all rounded-full flex-shrink-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px]">add_circle</span>
                        </button>
                        
                        <textarea
                            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[48px] py-3.5 text-sm text-[#06361f] placeholder:text-[#548064] font-medium"
                            placeholder="Message your architect..."
                            rows={1}
                        ></textarea>

                        <button className="w-12 h-12 bg-[#006a28] text-white hover:bg-[#005a22] transition-all rounded-2xl flex flex-shrink-0 items-center justify-center shadow-lg shadow-[#006a28]/20 active:scale-90">
                            <span className="material-symbols-outlined text-[22px]">send</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

