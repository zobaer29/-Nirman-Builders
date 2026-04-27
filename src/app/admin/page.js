"use client";

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
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

  return (
    <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black font-headline text-[#06361f] tracking-tight">
            Hello {profileData.username}!
          </h2>
          <p className="text-[#548064] font-bold mt-2 uppercase text-[10px] tracking-widest">
            Nirman Builders Performance Metrics
          </p>
        </div>
        <div className="flex gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <button className="px-6 py-2 bg-[#006a28] text-white rounded-xl text-xs font-black uppercase tracking-widest">Real-time</button>
          <button className="px-6 py-2 text-[#548064] hover:bg-[#f0fff4] rounded-xl text-xs font-black uppercase tracking-widest transition-all">Historical</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Projects", value: "24", icon: "business_center", color: "bg-indigo-500" },
          { label: "Ongoing", value: "12", icon: "pending_actions", color: "bg-amber-500" },
          { label: "Completed", value: "08", icon: "task_alt", color: "bg-[#006a28]" },
          { label: "Pending Requests", value: "04", icon: "priority_high", color: "bg-rose-500", isError: true },
        ].map((stat, i) => (
          <div key={i} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
              </div>
              <span className="material-symbols-outlined text-[#548064] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward_ios</span>
            </div>
            <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className={`text-4xl font-black tracking-tight ${stat.isError ? 'text-rose-500' : 'text-[#06361f]'}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">

        {/* Recent Requests Table */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-2xl font-black text-[#06361f] tracking-tight">Recent Project Requests</h4>
            <button className="bg-[#f0fff4] text-[#006a28] px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#006a28] hover:text-white transition-all active:scale-95">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-6 px-4 text-[10px] font-black tracking-widest text-[#548064] uppercase">Client Details</th>
                  <th className="pb-6 px-4 text-[10px] font-black tracking-widest text-[#548064] uppercase">Type & Budget</th>
                  <th className="pb-6 px-4 text-[10px] font-black tracking-widest text-[#548064] uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { name: "Rahim Uddin", init: "RU", desc: "Commercial Renovation", type: "Interior Fit-out", budget: "৳ 45.0L", status: "Pending Review" },
                  { name: "TechNova Ltd.", init: "TN", desc: "Office Expansion", type: "Structural Build", budget: "৳ 2.8Cr", status: "Estimating", active: true },
                  { name: "Karim Hasan", init: "KH", desc: "Residential Villa", type: "Ground Up", budget: "৳ 1.2Cr", status: "Pending Review" },
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-[#f0fff4]/30 transition-all cursor-pointer">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-[#006a28] border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                          {row.init}
                        </div>
                        <div>
                          <p className="font-black text-[#06361f] text-sm tracking-tight">{row.name}</p>
                          <p className="text-[10px] font-bold text-[#548064] uppercase tracking-wide">{row.desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <p className="font-bold text-[#06361f] text-sm">{row.type}</p>
                      <p className="text-[10px] font-black text-[#006a28] tracking-widest">{row.budget}</p>
                    </td>
                    <td className="py-6 px-4 text-right">
                      <span className={`inline-block px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest border ${row.active ? 'bg-[#006a28] text-white border-[#006a28]' : 'bg-white text-[#548064] border-slate-200'
                        }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Milestones Sidebar */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col">
          <h4 className="text-2xl font-black text-[#06361f] tracking-tight mb-10">Project Milestones</h4>
          <div className="space-y-10 flex-1">
            {[
              { name: "Skyline Tower", progress: 65 },
              { name: "Green Valley Villa", progress: 85 },
              { name: "City Mall Renovation", progress: 15 },
            ].map((m, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-sm font-black text-[#06361f] tracking-tight">{m.name}</p>
                  <p className="text-xs font-black text-[#006a28]">{m.progress}%</p>
                </div>
                <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#4bee74] to-[#006a28] rounded-full transition-all duration-1000 shadow-md shadow-[#006a28]/10"
                    style={{ width: `${m.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-8 border-t border-slate-50">
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#548064]">event</span>
              <p className="text-[10px] font-black text-[#548064] uppercase tracking-[0.2em]">Next review: May 24, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Hero Call to Action & Contractors */}
      <div className="grid grid-cols-12 gap-8">

        {/* Create Project Hero */}
        <div className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-[3rem] bg-[#006a28] p-12 flex items-center group cursor-pointer shadow-2xl shadow-[#006a28]/20 transition-all active:scale-[0.98]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 transition-transform group-hover:scale-110 duration-1000"></div>
          <div className="relative z-10 flex-1">
            <h3 className="text-4xl font-black text-white mb-6 leading-tight tracking-tighter">
              Ready to start a <br /><span className="text-[#4bee74]">new build?</span>
            </h3>
            <p className="text-white/60 font-medium max-w-sm mb-10 leading-relaxed">
              Initiate a new project workflow, assign staff, and set baseline milestones in one unified interface.
            </p>
            <button className="bg-white text-[#006a28] font-black px-10 py-5 rounded-2xl flex items-center gap-3 shadow-xl hover:bg-[#4bee74] hover:text-[#06361f] transition-all text-sm uppercase tracking-widest">
              <span className="material-symbols-outlined font-black">add_circle</span>
              Create Project
            </button>
          </div>
          <div className="absolute -right-16 -bottom-16 opacity-5 rotate-12 transition-transform group-hover:rotate-0 duration-700">
            <span className="material-symbols-outlined text-[400px]">architecture</span>
          </div>
        </div>

        {/* Available Contractors Sidebar */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex flex-col">
          <h4 className="text-2xl font-black text-[#06361f] tracking-tight mb-8">Contractors</h4>
          <div className="space-y-6 flex-1">
            {[
              { name: "Jamal Electricals", status: "Available Now", statusColor: "text-[#006a28]", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtj4SAd8nMylozm0Aa6vfx26BgzOgnAxW-0buFYTYtaRMRd6hn62aHtz8aNV2tvLvbw8xuzfZWlHI9nZSFTI4TI6ClRcYHOp3PNBdEbnW69acSLsfPlMsiTHdGHBLO7NTVHwli1IUw0V-R6ECdndRhJMUX8WO8G51LFld9l1Ruqp8VArQHjXtxBdvTuQw-7ZbsasXn0tbV2CASgoakauh12jem7KWsIq6QUO164ONT-RlUHjogrfv8_q0n49KMvyLmXvdeEZxP1ws" },
              { name: "M/S Haque Builders", status: "Busy until June 1", statusColor: "text-rose-500", busy: true, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtmzd4836IbicagH1V31RVBfhmLl3s6mGxe7DS0hJkxY4UCw3_hWWqfdHfI9tpKAE0ku6MN1MXV-y7aIyFUKqQrG85aZ1ASZJQoPnM9VmtubBt0YHs0WUBm5iLUwp2wTy-fgQSb3wRd3wUTSgb4zOTA3skfpaeiOHvAyNyKlQnqDqMzsRZBeKLM3E2ntP0_tIhsFuRwe2Qrdwg-KgIxPOxngku8Mg-0fK1T-38KFtIZSonzsnBgvO5pZ0FdP3X1Te1TRqu_KLzwx8" },
              { name: "Rana Plumbing", status: "Available Now", statusColor: "text-[#006a28]", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVQM8aqmXA3MAe8O3wrqpoxPbml-iP9CTNqVYwtIoQnlD1u_mt72aMmd3r5cH0YuBIbGAr0aovbMmqXSMw_2rSKAgH5PbFRobWGInUKC-vo8Hi6Tee3TE-2E8WTxvf5oSiocBkhSvlHjoPxkdjiIeSN9q81AaIm6JVji52KN-9CCRC9GPhsioDqz0XhymBnuvQcErSNqeSCGavQy0ykmvpf5iLVCc1BprLsABx1ISggxJNvZMVZbWeMv_j0wPtl35srSO9_J_fE4M" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-5 p-4 rounded-3xl hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className={`w-16 h-16 rounded-2xl overflow-hidden shadow-sm border-2 border-white ${c.busy ? 'grayscale opacity-50' : ''}`}>
                  <img className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" src={c.img} alt={c.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#06361f] text-sm truncate tracking-tight">{c.name}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${c.statusColor}`}>{c.status}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-10 w-full py-5 rounded-[2rem] border-2 border-slate-100 text-[10px] font-black text-[#548064] uppercase tracking-[0.2em] hover:bg-[#006a28] hover:text-white hover:border-[#006a28] transition-all active:scale-95">
            View Directory
          </button>
        </div>
      </div>
    </div>
  );
}

