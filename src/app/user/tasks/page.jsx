"use client";

import React, { useState } from "react";

const tasksData = [
  {
    id: 1,
    title: "Design Floor Plan",
    project: "Residential Building",
    status: "In Progress",
    priority: "High",
    due: "2026-05-02",
    progress: 70,
  },
  {
    id: 2,
    title: "Material Purchase",
    project: "Shopping Complex",
    status: "Pending",
    priority: "Medium",
    due: "2026-05-05",
    progress: 20,
  },
  {
    id: 3,
    title: "Client Meeting",
    project: "Office Interior",
    status: "Completed",
    priority: "Low",
    due: "2026-04-20",
    progress: 100,
  },
  {
    id: 4,
    title: "Site Inspection",
    project: "Bridge Construction",
    status: "In Progress",
    priority: "High",
    due: "2026-05-01",
    progress: 50,
  },
];

const statusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "In Progress":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Pending":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const priorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "text-rose-600 bg-rose-50";
    case "Medium":
      return "text-amber-600 bg-amber-50";
    case "Low":
      return "text-emerald-600 bg-emerald-50";
    default:
      return "text-slate-600 bg-slate-50";
  }
};

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = tasksData.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Task Statistics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: tasksData.length, color: "bg-blue-500", icon: "list" },
          { label: "In Progress", value: tasksData.filter(t => t.status === "In Progress").length, color: "bg-amber-500", icon: "sync" },
          { label: "Completed", value: tasksData.filter(t => t.status === "Completed").length, color: "bg-green-500", icon: "done_all" },
          { label: "Pending", value: tasksData.filter(t => t.status === "Pending").length, color: "bg-rose-500", icon: "pending" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-[#06361f]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Header & Search */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Filter tasks or projects..."
            className="w-full bg-[#f0fff4] border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#006a28] outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#548064]">search</span>
        </div>

        <button className="w-full md:w-auto bg-[#006a28] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-[#006a28]/20 hover:bg-[#005a22] transition-all active:scale-95 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          Add New Task
        </button>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${priorityColor(task.priority)}`}>
                  {task.priority} Priority
                </span>
                <h2 className="font-black text-lg text-[#06361f] mt-2 group-hover:text-[#006a28] transition-colors">{task.title}</h2>
              </div>
              <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold border ${statusColor(task.status)}`}>
                {task.status}
              </span>
            </div>

            {/* Project Info */}
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-sm text-[#548064]">architecture</span>
              <p className="text-xs font-bold text-[#548064] truncate">Project: <span className="text-[#06361f]">{task.project}</span></p>
            </div>

            {/* Due Date */}
            <div className="bg-[#f0fff4] rounded-2xl p-4 flex justify-between items-center mb-6 border border-[#006a28]/5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-[#006a28]">calendar_today</span>
                <span className="text-xs font-black text-[#39644a] uppercase tracking-tighter">Due Date</span>
              </div>
              <span className="text-sm font-black text-[#006a28]">{task.due}</span>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#548064]">
                <span>Task Progress</span>
                <span className="text-[#006a28]">{task.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#00b042] to-[#006a28] rounded-full shadow-sm transition-all duration-700"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-50">
              <button className="text-xs font-black text-[#006a28] uppercase tracking-widest hover:underline flex items-center gap-1">
                Details
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <div className="flex gap-1">
                <button className="p-2 text-[#548064] hover:text-[#006a28] hover:bg-[#f0fff4] rounded-xl transition-colors">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;