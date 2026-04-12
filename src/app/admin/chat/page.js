"use client";

import Image from "next/image";
import { useState } from "react";

export default function AdminChat() {
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
        <div className="h-[calc(100vh-140px)] w-full flex bg-surface-container-lowest rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Sidebar: Contact List */}
            <div className="w-1/3 border-r border-gray-100 flex flex-col bg-surface-container-lowest">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold font-headline text-on-surface">Messages</h2>
                    <button className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant flex items-center justify-center text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit_square</span>
                    </button>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => setActiveChat(contact.id)}
                            className={`flex items-start gap-3 p-4 cursor-pointer transition-colors border-l-4 ${activeChat === contact.id
                                    ? "bg-primary/5 border-primary"
                                    : "border-transparent hover:bg-surface-container-lowest"
                                }`}
                        >
                            <div className="relative">
                                <img
                                    src={contact.avatar}
                                    alt={contact.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-surface-container-lowest shadow-sm"
                                />
                                {contact.online && (
                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4bee74] border-2 border-surface-container-lowest rounded-full"></div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <h4 className="font-bold text-sm text-on-surface truncate">{contact.name}</h4>
                                    <span className={`text-[10px] whitespace-nowrap ${contact.unread > 0 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                                        {contact.time}
                                    </span>
                                </div>
                                <p className="text-xs text-on-surface-variant truncate font-medium">{contact.role}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <p className={`text-xs truncate ${contact.unread > 0 ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                                        {contact.lastMessage}
                                    </p>
                                    {contact.unread > 0 && (
                                        <span className="flex-shrink-0 w-4 h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center">
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
            <div className="flex-1 flex flex-col bg-surface-bright relative">
                {/* Chat Header */}
                <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between bg-surface-container-lowest z-10 w-full">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={activeUser.avatar}
                                alt={activeUser.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            {activeUser.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4bee74] border-2 border-surface-container-lowest rounded-full"></div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-on-surface">{activeUser.name}</h3>
                            <p className="text-[11px] text-primary flex items-center gap-1 font-medium">
                                {activeUser.online ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 text-on-surface-variant">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
                            <span className="material-symbols-outlined text-[20px]">call</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
                            <span className="material-symbols-outlined text-[20px]">videocam</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
                            <span className="material-symbols-outlined text-[20px]">info</span>
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface">
                    <div className="flex justify-center">
                        <span className="text-[10px] font-bold bg-surface-container px-3 py-1 rounded-full text-on-surface-variant uppercase tracking-widest">
                            Today
                        </span>
                    </div>

                    {/* Example Messages */}
                    <div className="flex justify-end">
                        <div className="bg-primary text-white p-3.5 rounded-l-2xl rounded-br-2xl max-w-[70%] shadow-sm">
                            <p className="text-sm">
                                Hi {activeUser.name.split(" ")[0]}, can we confirm the switch to granite for the kitchen island by tomorrow?
                            </p>
                            <p className="text-[9px] text-white/70 mt-1 text-right font-medium">09:42 AM</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <img
                            src={activeUser.avatar}
                            alt={activeUser.name}
                            className="w-8 h-8 rounded-full self-end object-cover shadow-sm"
                        />
                        <div className="bg-surface-container-lowest text-on-surface border border-gray-100 p-3.5 rounded-r-2xl rounded-bl-2xl max-w-[70%] shadow-sm">
                            <p className="text-sm">
                                Absolutely. I've sent the updated material specs to the site lead. We need your sign-off on the color sample.
                            </p>
                            <p className="text-[9px] text-on-surface-variant mt-1 font-medium">10:15 AM</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-primary text-white p-3.5 rounded-l-2xl rounded-br-2xl max-w-[70%] shadow-sm">
                            <div className="flex items-center gap-2 mb-2 bg-white/20 p-2 rounded-lg">
                                <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                                <span className="text-xs font-bold truncate max-w-[150px]">Material_Specs_v2.pdf</span>
                            </div>
                            <p className="text-sm">
                                I'll check it right away and approve it on the dashboard.
                            </p>
                            <p className="text-[9px] text-white/70 mt-1 text-right font-medium">10:20 AM</p>
                        </div>
                    </div>
                </div>

                {/* Chat Input Area */}
                <div className="p-4 bg-surface-container-lowest border-t border-gray-100 w-full">
                    <div className="flex items-end gap-3 bg-surface-container-low p-2 rounded-3xl border border-gray-200">
                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-highest rounded-full flex-shrink-0">
                            <span className="material-symbols-outlined text-[22px]">add_circle</span>
                        </button>
                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-highest rounded-full flex-shrink-0">
                            <span className="material-symbols-outlined text-[22px]">attach_file</span>
                        </button>

                        <textarea
                            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[44px] py-3 text-sm text-on-surface placeholder:text-on-surface-variant"
                            placeholder="Type your message..."
                            rows={1}
                        ></textarea>

                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-highest rounded-full flex-shrink-0 mb-1">
                            <span className="material-symbols-outlined text-[22px]">sentiment_satisfied</span>
                        </button>
                        <button className="w-10 h-10 bg-primary text-white hover:bg-primary-dim transition-colors rounded-full flex flex-shrink-0 items-center justify-center shadow-md mb-0.5">
                            <span className="material-symbols-outlined text-[20px]">send</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
