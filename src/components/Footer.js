"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith('/admin') ||
    pathname.startsWith('/user') ||
    pathname.startsWith('/contractor') ||
    pathname.startsWith('/worker');

  if (isDashboard) return null;

  return (
    <footer className="bg-white text-slate-900 border-t border-gray-100 pt-16 pb-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Address */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5">
                <div className="w-6 h-1.5 bg-black"></div>
                <div className="w-6 h-4 bg-black"></div>
              </div>
              <span className="text-xl font-bold tracking-tight">Nirman Builders</span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm">
              Modern construction solutions with transparency, precision, and quality execution across Bangladesh.
            </p>
            <div className="text-xs text-gray-600 pt-2 space-y-1.5">
              <p className="flex items-center gap-1.5">
                <span>📍</span> Vatara Natun Bazer Sayeednagor
              </p>
              <p className="flex items-center gap-1.5">
                <span>✉️</span>
                <a href="mailto:zobaerislamshanto@gmail.com" className="hover:text-emerald-600 font-medium">
                  zobaerislamshanto@gmail.com
                </a>
                <span className="text-gray-400">(We&apos;ll respond within 24h)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span>📞</span>
                <a href="tel:+8801993192365" className="hover:text-emerald-600 font-medium">
                  +8801993192365
                </a>
                <span className="text-gray-400">(Mon-Fri, 9am-6pm)</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Navigation</h4>
            <nav className="flex flex-col gap-2 text-sm text-gray-600">
              <Link href="/projects" className="hover:text-black transition-colors">Projects</Link>
              <Link href="/about" className="hover:text-black transition-colors">About Us</Link>
              <Link href="/#contact" className="hover:text-black transition-colors">Contact</Link>
              <Link href="/login" className="hover:text-black transition-colors">Login Portals</Link>
            </nav>
          </div>

          {/* Developer Portfolio */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Developer</h4>
            <div className="space-y-2">
              <p className="font-semibold text-slate-800 text-sm">Md. Zobaer Islam</p>
              <a
                href="https://zobaer.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs border border-emerald-200 transition-colors"
              >
                <span>🌐</span> zobaer.dev
              </a>
              <p className="text-xs text-gray-400">Full-Stack Web Developer</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © {new Date().getFullYear()} Nirman Builders. All rights reserved.
          </div>
          <div>
            Developed by{" "}
            <a
              href="https://zobaer.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 font-semibold hover:underline"
            >
              zobaer.dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
