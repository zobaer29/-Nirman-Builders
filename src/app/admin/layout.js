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
    { href: '/admin/requests', icon: 'list_alt', label: 'Requests' },
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
    <div className="bg-surface text-on-background min-h-screen flex flex-col md:flex-row overflow-x-hidden font-body relative">
      {/* SideNavBar */}
      <aside 
        className={`
          ${isSidebarOpen ? 'w-64' : 'w-0 md:w-20'} 
          h-screen bg-white flex flex-col py-6 px-4 shrink-0 overflow-y-auto border-r border-zinc-100 z-[10000] 
          transition-all duration-300 ease-in-out fixed md:relative
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
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
                Construction Admin
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-x-hidden">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href) && link.href !== '#';

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-300 active:scale-95 text-sm font-medium
                  ${isActive
                    ? 'bg-[#5cfd80] text-[#005d22]'
                    : 'text-zinc-600 hover:text-[#006a28] hover:bg-zinc-100'}
                  ${!isSidebarOpen && 'md:justify-center md:px-0'}
                `}
              >
                <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>
                  {link.icon}
                </span>
                {isSidebarOpen && <span className="whitespace-nowrap">{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`mt-auto pt-6 border-t border-zinc-100 ${!isSidebarOpen && 'md:items-center'}`}>
          <button onClick={handleLogout} className={`flex items-center gap-3 text-zinc-500 hover:text-error px-4 py-2.5 transition-colors font-medium text-sm w-full ${!isSidebarOpen && 'md:justify-center md:px-0'}`}>
            <span className="material-symbols-outlined">logout</span>
            {isSidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>



      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden w-full relative">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full h-16 px-4 md:px-8 sticky top-0 z-40 bg-surface-bright/90 backdrop-blur-sm border-b border-zinc-100">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-600"
            >
              <span className="material-symbols-outlined">
                {isSidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>
            <h2 className="text-lg font-bold text-on-surface font-headline hidden sm:block">
              Admin Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                className="bg-surface-container-low outline-none border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Search projects..."
                type="text"
              />
            </div>
            <button className="p-2 hover:bg-zinc-200/50 rounded-lg transition-colors relative">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <button onClick={handleProfile} className="p-2 hover:bg-zinc-200/50 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">settings</span>
            </button>
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-surface-container-high">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold font-headline text-on-surface">{profileData.username}</p>
                <p className="text-[10px] text-on-surface-variant">{profileData.role}</p>
              </div>
              {profileData.photoUrl ? (
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/10"
                  alt="user portrait"
                  src={profileData.photoUrl}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border-2 border-primary/10">
                  {profileData.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 hide-scrollbar">
          {children}
        </section>
      </main>

      {/* Mobile Sidebar Overlay - High z-index and explicit click handler */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" 
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
