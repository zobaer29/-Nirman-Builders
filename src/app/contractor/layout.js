'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ContractorLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed for better mobile start

  useEffect(() => {
    // Open sidebar by default only on desktop
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/contractor", icon: "grid_view" },
    { label: "Active Projects", href: "/contractor/projects", icon: "architecture" },
    { label: "Resources", href: "/contractor/resources", icon: "construction" },
    { label: "Team Management", icon: "groups_2", href: "/contractor/team" },
    { label: "Analytics", href: "/contractor/analytics", icon: "monitoring" },
    { label: "Communication", href: "/contractor/chat", icon: "chat_bubble" },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="bg-[#f4f7f6] text-on-background min-h-screen flex flex-col md:flex-row overflow-x-hidden font-body relative">

      {/* Sidebar - Same style as Admin */}
      <aside
        className={`
          ${isSidebarOpen ? 'w-64' : 'w-0 md:w-20'}
      h-screen bg-white flex flex-col py-6 px-4 shrink-0 overflow-y-auto border-r border-zinc-100 z-50
      transition-all duration-300 ease-in-out fixed md:relative z-[10000]
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Branding */}
        <div className={`flex items-center gap-3 px-2 mb-10 overflow-hidden ${!isSidebarOpen && 'md:justify-center px-0'}`}>
          <div className="w-10 h-10 shrink-0 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined">architecture</span>
          </div>
          {isSidebarOpen && (
            <div className="whitespace-nowrap">
              <h1 className="text-lg font-bold tracking-tight text-[#006a28] font-headline leading-none">
                Nirman Builders
              </h1>
              <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mt-1">
                Contractor Hub
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300 active:scale-95 text-sm font-medium
                  ${isActive
                    ? 'bg-[#5cfd80] text-[#005d22]'
                    : 'text-zinc-600 hover:text-[#006a28] hover:bg-zinc-100'}
                  ${!isSidebarOpen && 'md:justify-center md:px-0'}
                `}
              >
                <span className={`material-symbols-outlined ${isActive ? 'font-fill' : ''}`} style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className={`mt-auto pt-6 border-t border-zinc-100 ${!isSidebarOpen && 'md:items-center'}`}>
          <button className={`flex items-center gap-3 text-zinc-500 hover:text-error px-4 py-2.5 transition-colors font-medium text-sm w-full ${!isSidebarOpen && 'md:justify-center md:px-0'}`}>
            <span className="material-symbols-outlined">logout</span>
            {isSidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>



      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden w-full relative">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full h-16 px-4 md:px-8 sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-zinc-100">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600"
            >
              <span className="material-symbols-outlined">
                {isSidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>
            <h2 className="text-lg font-bold text-[#006a28] font-headline hidden sm:block">
              Contractor Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">
                search
              </span>
              <input
                className="bg-zinc-100 outline-none border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Search projects..."
                type="text"
              />
            </div>
            <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors relative">
              <span className="material-symbols-outlined text-zinc-600">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-zinc-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-zinc-900">Rajesh Kumar</p>
                <p className="text-[10px] text-zinc-500">Lead Contractor</p>
              </div>
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-zinc-100"
                alt="user portrait"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3L7pkH_7FMaxKJg89KtwSxcZajf2JvQJo5c-yiRgPJysEzbV69MhNNbCL14aWqBPQJPP6voJIwgOONtNnYIq_MEshHmFtsuUKa18aIokBMVHQu5aWcerZNo4-XUmLSv2t9x43KUYs1owUGrDxEhGtFXI8lTJqAvEmMXuwWVkFs9jEhle60OhOLLjG_l5SjSqpXMIhQpEPFjk5sEusbku6hwGRSMFkVzOd_FVkjPINCVN-M33XDKTTixYvB_LNfoOUb5yuiTzyxqQ"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar">
          {children}
        </section>
      </main>

      {/* Mobile Sidebar Overlay - High z-index and explicit click handler */}
      {
        isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSidebar();
            }}
          ></div>
        )
      }
    </div >
  );
}