"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Dashboard", href: "/worker", icon: "dashboard" },
  { label: "Assigned Sites", href: "/worker/projects", icon: "location_on" },
  { label: "Task Board", href: "/worker/tasks", icon: "assignment" },
  { label: "Material Request", href: "/worker/inventory", icon: "inventory_2" },
  { label: "Communication", href: "/worker/chat", icon: "chat" },
];

export default function WorkerLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="bg-[#f8faf9] text-[#06361f] antialiased min-h-screen font-body flex flex-col md:flex-row overflow-x-hidden relative">
      
      {/* Sidebar */}
      <aside
        className={`
          ${isSidebarOpen ? 'w-72' : 'w-0 md:w-24'} 
          h-screen bg-white flex flex-col py-8 px-5 shrink-0 overflow-y-auto border-r border-slate-100 z-[10000] 
          transition-all duration-500 ease-in-out fixed md:relative
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Branding */}
        <div className={`flex items-center gap-3 px-2 mb-12 overflow-hidden ${!isSidebarOpen && 'md:justify-center px-0'}`}>
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#006a28] flex items-center justify-center text-white shadow-xl shadow-[#006a28]/20">
            <span className="material-symbols-outlined text-2xl">engineering</span>
          </div>
          {isSidebarOpen && (
            <div className="whitespace-nowrap">
              <h1 className="text-xl font-black tracking-tighter text-[#06361f] font-headline leading-none">
                Nirman <span className="text-[#006a28]">Worker</span>
              </h1>
              <p className="text-[10px] font-black text-[#548064] uppercase tracking-[0.2em] mt-1.5">
                Field Operations
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-x-hidden">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`
                  flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group
                  ${isActive 
                    ? "bg-[#006a28] text-white shadow-xl shadow-[#006a28]/15 translate-x-1" 
                    : "text-[#39644a] hover:text-[#006a28] hover:bg-[#f0fff4]"}
                  ${!isSidebarOpen && 'md:justify-center md:px-0'}
                `}
              >
                <span className={`material-symbols-outlined text-2xl transition-colors ${isActive ? "text-white" : "text-[#548064] group-hover:text-[#006a28]"}`}
                      style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="whitespace-nowrap font-black text-sm tracking-tight">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`mt-auto pt-8 border-t border-slate-100 ${!isSidebarOpen && 'md:items-center'}`}>
          <button className={`flex items-center gap-4 text-[#548064] hover:text-rose-600 px-5 py-4 transition-all font-black text-sm w-full rounded-2xl hover:bg-rose-50 ${!isSidebarOpen && 'md:justify-center md:px-0'}`}>
            <span className="material-symbols-outlined text-2xl">logout</span>
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden w-full relative">
        
        {/* Top Header */}
        <header className="flex justify-between items-center w-full h-24 px-6 md:px-10 sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
          <div className="flex items-center gap-6">
            <button
              onClick={toggleSidebar}
              className="w-12 h-12 flex items-center justify-center hover:bg-[#f0fff4] rounded-2xl transition-all text-[#006a28] border border-slate-100"
            >
              <span className="material-symbols-outlined text-2xl">
                {isSidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xl font-black text-[#06361f] tracking-tight">
                {navItems.find(item => item.href === pathname)?.label || "Dashboard"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-[#4bee74] rounded-full animate-pulse"></span>
                <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest mt-0.5">System Online • Site B-14</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Shift Indicator */}
            <div className="hidden xl:flex items-center gap-4 bg-[#f0fff4] px-6 py-2.5 rounded-2xl border border-[#006a28]/10 shadow-inner">
              <div className="text-right">
                <p className="text-[9px] font-black text-[#548064] uppercase">Current Shift</p>
                <p className="text-xs font-black text-[#006a28]">08:00 - 17:00</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#006a28] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-lg">timer</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="w-12 h-12 flex items-center justify-center hover:bg-[#f0fff4] rounded-2xl transition-all relative border border-slate-100 text-[#548064]">
                <span className="material-symbols-outlined text-2xl">notifications</span>
                <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-[#06361f]">Arjun Kumar</p>
                  <p className="text-[10px] font-bold text-[#548064] uppercase tracking-widest">Senior Technician</p>
                </div>
                <div className="relative">
                  <img
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-[#006a28]/10 shadow-md"
                    alt="user"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX5NT86IkP7CGz2_PvuqsegQojw1qrphEbDW8mCi3GICpx55gWfkZt7Y7bLTVl-UyC71qB3T_-6bgf9khuR9pFmHUxVZOKwqcepLOqEDO80KckqYy6UZepImHKEJU9oLmWrwlDlqI0JSRAsyjKfed3bG92SWJ5UaC9E_4kC_eQ-uhGg0F2AlMnm-vWvfGCvFFXglIMiriRXAkK-AP8x0rs6sK2qoNHHQR10EfTPbo3oq2Gcg1KFNZM3HwJkaKQwoKbFq1mOnxiBzI"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4bee74] border-2 border-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar scroll-smooth">
          {children}
        </div>
      </div>

      {/* Emergency FAB */}
      <button className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-rose-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group">
        <span className="material-symbols-outlined text-3xl group-hover:animate-bounce">warning</span>
        <div className="absolute bottom-full right-0 mb-4 bg-rose-600 text-white text-[10px] font-black py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
          REPORT EMERGENCY
        </div>
      </button>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-[#06361f]/40 backdrop-blur-sm z-[9999] transition-opacity duration-500" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
          }}
        ></div>
      )}
    </div>
  );
}


