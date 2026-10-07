"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AcademicNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("logins"); // Default to 'logins' so recruiters immediately see demo accounts
  const [copiedRole, setCopiedRole] = useState(null);

  useEffect(() => {
    // Check if user has already dismissed the popup in the current session
    const dismissed = sessionStorage.getItem("nirman_academic_notice_dismissed");
    if (!dismissed) {
      // Small timeout for smooth entrance after page hydration
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("nirman_academic_notice_dismissed", "true");
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const copyCredentials = (role, email, password) => {
    navigator.clipboard.writeText(`${email}\n${password}`);
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const demoAccounts = [
    {
      role: "Admin",
      icon: "🛡️",
      badge: "Full Control",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      email: "admin@nirman.com",
      password: "password123",
      route: "/admin",
      features: "Executive analytics, project approvals, contractor/worker role applications, PDF export reports."
    },
    {
      role: "Contractor",
      icon: "🏗️",
      badge: "Site Manager",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
      email: "contractor@nirman.com",
      password: "password123",
      route: "/contractor",
      features: "Assigned to Emerald Heights & Apex Tech, team allocation, material orders, task management."
    },
    {
      role: "Worker",
      icon: "👷‍♂️",
      badge: "Field Ops",
      badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
      email: "worker@nirman.com",
      password: "password123",
      route: "/worker",
      features: "Daily shifts, slab casting/waterproofing tasks, urgent cement/rebar material requisitions."
    },
    {
      role: "Client",
      icon: "🏡",
      badge: "Property Owner",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      email: "client@nirman.com",
      password: "password123",
      route: "/user",
      features: "Live building progress tracking (65%), milestones, quote requests, contractor communications."
    }
  ];

  return (
    <>
      {/* Floating Re-Open Badge for Recruiters (visible at bottom-left) */}
      <button
        onClick={handleOpen}
        aria-label="Open Academic Project Information"
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 text-white text-xs font-semibold shadow-2xl border border-slate-700/80 backdrop-blur-md hover:bg-emerald-600 hover:border-emerald-500 hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-sm">🎓</span>
        <span className="hidden sm:inline">Demo Logins (Recruiters)</span>
        <span className="sm:hidden">Demo Logins</span>
      </button>

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="academic-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
            
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-6 sm:px-8 pt-7 pb-5 text-white">
              <button
                onClick={handleClose}
                aria-label="Close modal"
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all text-lg font-bold"
              >
                ✕
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2.5">
                <span>🎓</span> Academic Capstone & Portfolio Project
              </div>

              <h2
                id="academic-modal-title"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5"
              >
                Nirman Builders
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                An enterprise-grade, full-stack construction project & workflow management ecosystem with 4 isolated role portals, live database, and Gemini AI.
              </p>

              {/* Navigation Tabs */}
              <div className="flex gap-2 mt-5 border-b border-white/10 pb-0 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("logins")}
                  className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === "logins"
                      ? "border-emerald-400 text-emerald-300"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  🔑 Demo Logins (4 Roles)
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === "overview"
                      ? "border-emerald-400 text-emerald-300"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  📌 Project Purpose
                </button>
                <button
                  onClick={() => setActiveTab("tech")}
                  className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === "tech"
                      ? "border-emerald-400 text-emerald-300"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  ⚙️ Tech Stack & DB
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-4 text-slate-700 text-sm flex-1">
              
              {/* TAB 1: DEMO LOGINS */}
              {activeTab === "logins" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900">
                    <div>
                      <span className="font-bold">⚡ Ready-to-Test Accounts:</span> All accounts are active in Aiven MySQL with seeded live projects, tasks, and workers.
                    </div>
                    <Link
                      href="/login"
                      onClick={handleClose}
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 underline whitespace-nowrap"
                    >
                      Go to Login Page →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {demoAccounts.map((acc) => (
                      <div
                        key={acc.role}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                              <span>{acc.icon}</span> {acc.role}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                              {acc.badge}
                            </span>
                          </div>

                          <div className="bg-white p-2.5 rounded-xl border border-gray-200 text-xs font-mono space-y-1 mb-2">
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] text-gray-400 font-sans">Email:</span>
                              <span className="font-semibold text-slate-800">{acc.email}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                              <span className="text-[11px] text-gray-400 font-sans">Password:</span>
                              <span className="font-semibold text-emerald-700">{acc.password}</span>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                            {acc.features}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                          <button
                            onClick={() => copyCredentials(acc.role, acc.email, acc.password)}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <span>📋</span> {copiedRole === acc.role ? "Copied!" : "Copy Info"}
                          </button>
                          <Link
                            href="/login"
                            onClick={handleClose}
                            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-gray-200 hover:bg-gray-300 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            Sign In →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span>💡 <strong>Tip:</strong> You can also use <strong>One-Click Google Sign In</strong> with any Google account to test the Client experience.</span>
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <h3 className="font-bold text-emerald-900 text-sm mb-1 flex items-center gap-2">
                      <span>💡</span> The Problem Solved
                    </h3>
                    <p className="text-emerald-800 text-xs sm:text-sm leading-relaxed">
                      Traditional construction projects suffer from fragmented communication, opaque budgeting, manual inventory reconciliation, and lack of real-time site visibility. Nirman Builders unifies all stakeholders into one transparent platform.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-800 text-xs mb-1 flex items-center gap-1.5">
                        <span>👔</span> Admin Oversight
                      </div>
                      <p className="text-xs text-slate-600">
                        Centralized oversight with executive financial analytics, project approval workflows, and PDF reports.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-800 text-xs mb-1 flex items-center gap-1.5">
                        <span>👷‍♂️</span> Contractor & Workers
                      </div>
                      <p className="text-xs text-slate-600">
                        Live site workforce allocation, shift attendance, task status updates, and material requisition pipelines.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-800 text-xs mb-1 flex items-center gap-1.5">
                        <span>🏡</span> Client Portal
                      </div>
                      <p className="text-xs text-slate-600">
                        Clients track real-time build progress (0–100%), milestones, verified contractors, and budget estimates.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-800 text-xs mb-1 flex items-center gap-1.5">
                        <span>🤖</span> Gemini 2.5 Flash AI
                      </div>
                      <p className="text-xs text-slate-600">
                        Instant construction cost estimations and technical consultations in English, Bangla, and Banglish.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TECH STACK */}
              {activeTab === "tech" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-gray-100 bg-slate-50/70">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Frontend</p>
                      <p className="font-semibold text-slate-800 text-sm">Next.js 16 App Router & React 19</p>
                      <p className="text-xs text-slate-500 mt-1">Tailwind CSS v4, Turbopack, Swiper.js carousel</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-gray-100 bg-slate-50/70">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Database & Cloud</p>
                      <p className="font-semibold text-slate-800 text-sm">Aiven Cloud MySQL 8.4 (DBaaS)</p>
                      <p className="text-xs text-slate-500 mt-1">12 Relational Tables, SSL/TLS, Connection Pooling via mysql2</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-gray-100 bg-slate-50/70">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Security & Auth</p>
                      <p className="font-semibold text-slate-800 text-sm">Firebase Google OAuth & JWT</p>
                      <p className="text-xs text-slate-500 mt-1">Bcrypt password hashing, jose JWT, HttpOnly Cookies, RBAC</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-gray-100 bg-slate-50/70">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">AI & Media APIs</p>
                      <p className="font-semibold text-slate-800 text-sm">Google Gemini AI & ImgBB API</p>
                      <p className="text-xs text-slate-500 mt-1">Gemini 2.5 Flash SDK, ImgBB CDN multipart file uploads</p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                    <strong>Architecture Note:</strong> Built with Next.js Server Components, server actions, RESTful route handlers, and edge proxy middleware to ensure security and maximum speed.
                  </div>
                </div>
              )}

              {/* Developer Contact Footer Card */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-700">Developer:</span>
                  <span className="text-slate-800 font-medium">Md. Zobaer Islam</span>
                  <span>•</span>
                  <a
                    href="https://zobaer.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                  >
                    <span>🌐</span> zobaer.dev
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a href="mailto:zobaerislamshanto@gmail.com" className="text-slate-600 hover:text-emerald-600">
                    zobaerislamshanto@gmail.com
                  </a>
                  <span className="bg-gray-100 text-slate-700 px-2 py-0.5 rounded-md font-mono text-[11px]">
                    +8801993192365
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="px-6 sm:px-8 py-3.5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                You can reopen this modal anytime via the bottom-left badge.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/login"
                  onClick={handleClose}
                  className="w-full sm:w-auto text-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                >
                  Go to Login →
                </Link>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-md shadow-emerald-200 transition-all active:scale-95"
                >
                  Explore Website
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
