"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileData, setProfileData] = useState({ username: 'Loading...', role: '', photoUrl: null });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Open sidebar by default only on desktop
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch('/api/auth/profile', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          const roleName = data.user.roleId === 1 ? 'Super Admin' : 'Admin';
          setProfileData({
            username: data.user.username,
            role: roleName,
            photoUrl: data.user.photoUrl,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfileData();
  }, []);

  const navLinks = [
    { href: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
    { href: '/admin/projects', icon: 'architecture', label: 'Projects' },
    { href: '/admin/role-requests', icon: 'person_add', label: 'Role Applications' },
    { href: '/admin/contractor', icon: 'engineering', label: 'Contractors' },
    { href: '/admin/worker', icon: 'groups', label: 'Workers' },
    { href: '/admin/chat', icon: 'chat', label: 'Chat' },
    { href: '/admin/report', icon: 'analytics', label: 'Reports' },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        router.push('/admin/profile');
      }
      else {
        console.error('Failed to load profile');
      }
    }
    catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="bg-[#f8faf9] text-[#06361f] min-h-screen flex flex-col md:flex-row overflow-x-hidden font-body relative">

      {/* Sidebar */}
      <aside
        className={`
          ${isSidebarOpen ? 'w-72' : 'w-0 md:w-24'} 
          h-screen bg-white flex flex-col py-8 px-5 shrink-0 overflow-y-auto border-r border-slate-100 z-[10000] 
          transition-all duration-500 ease-in-out fixed md:relative
          ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className={`flex items-center gap-3 px-2 mb-12 overflow-hidden ${!isSidebarOpen && 'md:justify-center px-0'}`}>
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#006a28] flex items-center justify-center text-white shadow-xl shadow-[#006a28]/20">
            <span className="material-symbols-outlined text-2xl">architecture</span>
          </div>
          {isSidebarOpen && (
            <div className="whitespace-nowrap">
              <h1 className="text-xl font-black tracking-tighter text-[#06361f] font-headline leading-none">
                Nirman <span className="text-[#006a28]">Admin</span>
              </h1>
              <p className="text-[10px] font-black text-[#548064] uppercase tracking-[0.2em] mt-1.5">
                Central Hub
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-2 overflow-x-hidden">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href) && link.href !== '#';

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`
                  flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group
                  ${isActive
                    ? 'bg-[#006a28] text-white shadow-xl shadow-[#006a28]/15 translate-x-1'
                    : 'text-[#39644a] hover:text-[#006a28] hover:bg-[#f0fff4]'}
                  ${!isSidebarOpen && 'md:justify-center md:px-0'}
                `}
              >
                <span className={`material-symbols-outlined text-2xl transition-colors ${isActive ? 'text-white' : 'text-[#548064] group-hover:text-[#006a28]'}`}
                  style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>
                  {link.icon}
                </span>
                {isSidebarOpen && <span className="whitespace-nowrap font-black text-sm tracking-tight">{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`mt-auto pt-8 border-t border-slate-100 ${!isSidebarOpen && 'md:items-center'}`}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 text-[#548064] hover:text-rose-600 px-5 py-4 transition-all font-black text-sm w-full rounded-2xl hover:bg-rose-50 ${!isSidebarOpen && 'md:justify-center md:px-0'}`}
          >
            <span className="material-symbols-outlined text-2xl">logout</span>
            {isSidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden w-full relative">

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
                {navLinks.find(l => l.href === pathname)?.label || "Control Center"}
              </h2>
              <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest mt-0.5">Nirman Builders HQ</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#548064] text-xl">
                search
              </span>
              <input
                className="bg-slate-50 outline-none border border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-sm w-80 focus:ring-4 focus:ring-[#006a28]/5 focus:bg-white transition-all font-medium"
                placeholder="Search resources..."
                type="text"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="w-12 h-12 flex items-center justify-center hover:bg-[#f0fff4] rounded-2xl transition-all relative border border-slate-100 text-[#548064]">
                <span className="material-symbols-outlined text-2xl">notifications</span>
                <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="flex items-center gap-4 pl-6 border-l border-slate-100 group cursor-pointer" onClick={handleProfile}>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-[#06361f] group-hover:text-[#006a28] transition-colors">{profileData.username}</p>
                  <p className="text-[10px] font-bold text-[#548064] uppercase tracking-widest">{profileData.role}</p>
                </div>
                {profileData.photoUrl ? (
                  <img
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-[#006a28]/10 shadow-md group-hover:border-[#006a28] transition-all"
                    alt="user portrait"
                    src={profileData.photoUrl}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-[#f0fff4] flex items-center justify-center text-[#006a28] font-black text-lg border-2 border-[#006a28]/10 shadow-md group-hover:border-[#006a28] transition-all">
                    {profileData.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <section className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </section>
      </main>

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

