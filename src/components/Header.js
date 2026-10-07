"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  const isSolidHeader = scrolled || mobileMenuOpen;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolidHeader 
          ? 'bg-white/95 backdrop-blur-lg shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="flex flex-col gap-0.5">
            <div className={`w-6 h-1 transition-colors ${isSolidHeader ? 'bg-emerald-600' : 'bg-emerald-500'}`}></div>
            <div className={`w-6 h-3 transition-colors ${isSolidHeader ? 'bg-slate-900' : 'bg-white'}`}></div>
          </div>
          <span className={`text-xl font-black tracking-tighter transition-colors ${
            isSolidHeader ? 'text-slate-900' : 'text-white'
          }`}>
            NIRMAN<span className="text-emerald-500">.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
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

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-2xl transition-all focus:outline-none ${
            isSolidHeader 
              ? 'text-slate-900 hover:bg-slate-100' 
              : 'text-white hover:bg-white/10'
          }`}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="material-symbols-outlined text-3xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-7xl mx-auto px-6 pt-3 pb-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-6">
            <nav>
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-black transition-all ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-500'
                        }`}
                      >
                        <span>{link.name}</span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="px-4 py-3 flex items-center justify-between bg-slate-50 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Signed in</span>
                      <span className="text-sm font-black text-slate-800 truncate max-w-[200px]">
                        {user.username || user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      title="Logout"
                    >
                      <span className="material-symbols-outlined text-xl">logout</span>
                    </button>
                  </div>

                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3.5 px-6 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3.5 px-6 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 px-6 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
