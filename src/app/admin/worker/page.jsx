"use client";

import React from "react";

const WorkerPage = () => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-[#06361f] tracking-tight">Worker Management</h1>
                    <p className="text-[#548064] font-bold mt-2 uppercase text-[10px] tracking-widest">
                        Oversee field workers and site assignments
                    </p>
                </div>

                <div className="flex gap-4">
                    <button className="bg-white border border-slate-100 hover:bg-[#f0fff4] text-[#006a28] px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm transition-all active:scale-95">
                        Export Directory
                    </button>
                    <button className="bg-[#006a28] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#006a28]/20 transition-all active:scale-95 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        Onboard Worker
                    </button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Field Workers" value="482" icon="groups" color="bg-indigo-500" />
                <StatCard title="Active On Site" value="315" icon="engineering" color="bg-[#006a28]" />
                <StatCard title="On Leave" value="42" icon="event_busy" color="bg-amber-500" />
                <StatCard title="Safety Issues" value="3" icon="warning" color="bg-rose-500" isAlert={true} />
            </div>

            {/* Worker List Table */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-black text-xl text-[#06361f]">Active Directory</h3>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#548064] text-lg">search</span>
                        <input type="text" placeholder="Filter by name or ID..." className="bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-6 text-xs w-64 focus:ring-4 focus:ring-[#006a28]/5 outline-none font-medium" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="p-8 text-[10px] font-black tracking-widest text-[#548064] uppercase">Worker Profile</th>
                                <th className="p-8 text-[10px] font-black tracking-widest text-[#548064] uppercase">Trade / Skill</th>
                                <th className="p-8 text-[10px] font-black tracking-widest text-[#548064] uppercase">Current Assignment</th>
                                <th className="p-8 text-[10px] font-black tracking-widest text-[#548064] uppercase text-right">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            <TableRow
                                id="W-10492"
                                name="James Patterson"
                                trade="Masonry"
                                site="Corporate Tower P-3"
                                status="On Site"
                            />

                            <TableRow
                                id="W-10501"
                                name="Michael Chang"
                                trade="Welder"
                                site="Bridge Phase II"
                                status="On Site"
                            />

                            <TableRow
                                id="W-10433"
                                name="Robert O'Neil"
                                trade="Carpenter"
                                site="-"
                                status="Off Duty"
                            />
                            
                            <TableRow
                                id="W-10319"
                                name="Samuel L. Jackson"
                                trade="Heavy Equipment"
                                site="Metro Expansion"
                                status="On Leave"
                            />
                        </tbody>
                    </table>
                </div>
                <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-center">
                    <button className="text-[10px] font-black text-[#548064] uppercase tracking-widest hover:text-[#006a28] transition-colors">Load More Personnel</button>
                </div>
            </div>
        </div>
    );
};

export default WorkerPage;

/* Reusable Components */

const StatCard = ({ title, value, icon, color, isAlert }) => (
    <div className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl" style={isAlert ? { fontVariationSettings: '"FILL" 1' } : {}}>{icon}</span>
            </div>
        </div>
        <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest mb-1">{title}</p>
        <h2 className={`text-4xl font-black tracking-tight ${isAlert ? 'text-rose-500' : 'text-[#06361f]'}`}>{value}</h2>
    </div>
); 

const TableRow = ({ id, name, trade, site, status }) => {
    let statusStyle = "";
    if (status === "On Site") statusStyle = "bg-[#006a28] text-white border-[#006a28]";
    else if (status === "On Leave") statusStyle = "bg-amber-100 text-amber-700 border-amber-200";
    else statusStyle = "bg-white text-[#548064] border-slate-200";

    return (
        <tr className="hover:bg-[#f0fff4]/30 transition-all group cursor-pointer">
            <td className="p-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-mono text-[10px] text-[#548064] border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                        {id.split('-')[1]}
                    </div>
                    <div>
                        <p className="font-black text-[#06361f] text-sm tracking-tight">{name}</p>
                        <p className="text-[10px] font-bold text-[#548064] tracking-widest">{id}</p>
                    </div>
                </div>
            </td>
            <td className="p-8">
                <p className="font-bold text-[#06361f] text-sm">{trade}</p>
                <p className="text-[10px] font-black text-[#006a28] uppercase tracking-widest">Certified</p>
            </td>
            <td className="p-8">
                <p className="font-bold text-[#06361f] text-sm">{site === '-' ? 'Unassigned' : site}</p>
                {site !== '-' && <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Active Site</p>}
            </td>
            <td className="p-8 text-right">
                <span className={`inline-block px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest border ${statusStyle}`}>
                    {status}
                </span>
            </td>
        </tr>
    );
};