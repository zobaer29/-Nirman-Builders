"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/profile');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    fetchProfile();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    const roleId = Number(user.roleId);
    if (roleId === 1) return '/admin';
    if (roleId === 2) return '/user';
    if (roleId === 3) return '/contractor';
    return '/worker';
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Hide header on dashboard pages
  const isDashboard = pathname.startsWith('/admin') || 
                      pathname.startsWith('/user') || 
                      pathname.startsWith('/contractor') || 
                      pathname.startsWith('/worker');

  if (isDashboard) return null;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex flex-col gap-0.5">
            <div className={`w-6 h-1 transition-colors ${scrolled ? 'bg-emerald-600' : 'bg-emerald-500'}`}></div>
            <div className={`w-6 h-3 transition-colors ${scrolled ? 'bg-slate-900' : 'bg-white'}`}></div>
          </div>
          <span className={`text-xl font-black tracking-tighter transition-colors ${
            scrolled ? 'text-slate-900' : 'text-white'
          }`}>
            NIRMAN<span className="text-emerald-500">.</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <nav>
            <ul className="flex gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className={`text-sm font-bold transition-all hover:text-emerald-500 ${
                      pathname === link.href 
                        ? 'text-emerald-500' 
                        : scrolled ? 'text-slate-600' : 'text-white/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href={getDashboardLink()} 
              className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                scrolled 
                  ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-emerald-200' 
                  : 'bg-white text-slate-900 hover:bg-emerald-500 hover:text-white shadow-black/20'
              }`}
            >
              {user ? 'Dashboard' : 'Login'}
            </Link>

            {user && (
              <button
                onClick={handleLogout}
                className={`p-2.5 rounded-full transition-all active:scale-95 ${
                  scrolled 
                    ? 'text-slate-500 hover:text-red-500 hover:bg-red-50' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title="Logout"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Toggle Placeholder */}
        <button className="md:hidden text-emerald-500">
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>
    </header>
  );
}
