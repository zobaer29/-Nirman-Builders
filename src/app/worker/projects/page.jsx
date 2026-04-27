"use client";

import React from "react";

const sites = [
  {
    id: 1,
    name: "Emerald Heights",
    location: "Sector 8, Plot 42",
    supervisor: "Rajesh Sharma",
    role: "Lead Technician",
    status: "Active",
    progress: 85,
  },
  {
    id: 2,
    name: "Skyline Residency",
    location: "Main Road, Block C",
    supervisor: "Amit Verma",
    role: "Support Tech",
    status: "Upcoming",
    progress: 0,
  },
];

const AssignedSites = () => {
  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#06361f] tracking-tight">Assigned Sites</h1>
          <p className="text-[#548064] font-bold mt-2 uppercase text-[10px] tracking-widest">Active & Upcoming Projects</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
          <span className="w-3 h-3 bg-[#006a28] rounded-full animate-pulse"></span>
          <span className="text-sm font-black text-[#06361f]">Currently On Site</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sites.map((site) => (
          <div key={site.id} className="group bg-white rounded-[2.5rem] p-10 shadow-xl shadow-[#006a28]/5 border border-slate-100 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            
            {site.status === "Active" && (
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#006a28] -mr-20 -mt-20 rotate-45 flex items-end justify-center pb-4">
                <span className="material-symbols-outlined text-white text-xl">my_location</span>
              </div>
            )}

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-3xl bg-[#f0fff4] flex items-center justify-center text-[#006a28] group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-4xl">business</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-[#006a28] uppercase tracking-widest mb-1 block">{site.status} Project</span>
                <h2 className="text-3xl font-black text-[#06361f] tracking-tighter group-hover:text-[#006a28] transition-colors">{site.name}</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#548064] shadow-sm">
                  <span className="material-symbols-outlined text-xl">location_on</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Location</p>
                  <p className="font-bold text-[#06361f]">{site.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f0fff4] p-6 rounded-2xl border border-[#006a28]/5">
                  <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest mb-1">Supervisor</p>
                  <p className="font-black text-[#006a28]">{site.supervisor}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest mb-1">My Role</p>
                  <p className="font-black text-[#06361f]">{site.role}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Overall Site Progress</span>
                  <span className="text-xl font-black text-[#006a28]">{site.progress}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-[#4bee74] to-[#006a28] rounded-full transition-all duration-1000 shadow-md"
                    style={{ width: `${site.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button className="flex-1 py-4 bg-[#06361f] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-black/10">
                Site Documents
              </button>
              <button className="w-14 h-14 bg-[#f0fff4] text-[#006a28] rounded-2xl flex items-center justify-center hover:bg-[#006a28] hover:text-white transition-all active:scale-90">
                <span className="material-symbols-outlined">directions</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedSites;
