"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
    { href: '/admin/projects', icon: 'architecture', label: 'Projects' },
    { href: '/admin/requests', icon: 'list_alt', label: 'Requests' },
    { href: '#', icon: 'engineering', label: 'Contractors' },
    { href: '#', icon: 'groups', label: 'Workers' },
    { href: '/admin/chat', icon: 'chat', label: 'Chat' },
    { href: '#', icon: 'analytics', label: 'Reports' },
  ];
  return (
    <div className="bg-surface text-on-background min-h-screen flex overflow-hidden font-body">
      {/* SideNavBar */}
      <aside className="w-64 h-screen bg-white flex flex-col py-6 px-4 shrink-0 overflow-y-auto border-r-0 z-50 transition-all duration-300">
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined">architecture</span>
          </div>
          <div >
            <h1 className="text-lg font-bold tracking-tight text-[#006a28] font-headline">
              Nirman Builders
            </h1>
            <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">
              Construction Admin
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href) && link.href !== '#';

            if (isActive) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 bg-[#5cfd80] text-[#005d22] rounded-full px-4 py-2.5 transition-all duration-300 active:scale-95 font-medium text-sm"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 text-zinc-600 px-4 py-2.5 hover:text-[#006a28] hover:bg-zinc-100 rounded-full transition-colors font-medium text-sm"
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-100">
          <button className="flex items-center gap-3 text-zinc-500 hover:text-error px-4 py-2.5 transition-colors font-medium text-sm w-full">
            <span className="material-symbols-outlined">logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full h-16 px-8 sticky top-0 z-40 bg-surface-bright/90 backdrop-blur-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                className="bg-surface-container-low outline-none border-none rounded-full py-2 pl-10 pr-4 text-sm w-full focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Search projects or requests..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-zinc-200/50 rounded-lg transition-colors relative">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 hover:bg-zinc-200/50 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">settings</span>
            </button>
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-surface-container-high">
              <div className="text-right">
                <p className="text-xs font-bold font-headline text-on-surface">
                  Admin User
                </p>
                <p className="text-[10px] text-on-surface-variant">Super Admin</p>
              </div>
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/10"
                alt="user portrait"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB08vo762b-Bun8QjwCmqKacbMN8s8-okekHBZzyXEd01PtGWGFs9kJllKSpRwXzBFj219t8EK58i8xU3SzQWRAd9qsLdxslw5AHzq-49wihgh8l3-WBZfosk_gcGpWalQnUiOu64AWiWp2tHK7j_F-njStxvstpRtnigZR-lSPjHYx3Oonjt4BvjnM_sl8pSbSQUorAGsvCbniBSfZ4p0UdOpQlwHO8Tv1uamU55uN4BItGhfIe06wcSaI5SX_XaJ-lc2iaXzX2n0"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <section className="flex-1 overflow-y-auto p-8 hide-scrollbar">
          {children}
        </section>
      </main>
    </div>
  );
}
