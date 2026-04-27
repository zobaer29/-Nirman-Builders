"use client";

import React, { useState } from "react";

const initialTasks = [
  { id: 1, title: "Install HVAC Ducts", site: "Emerald Heights", status: "In Progress", priority: "High", time: "08:00 AM" },
  { id: 2, title: "Safety Drill", site: "Emerald Heights", status: "Pending", priority: "Medium", time: "01:30 PM" },
  { id: 3, title: "Check Cement Batch", site: "Skyline Residency", status: "Pending", priority: "High", time: "Tomorrow" },
  { id: 4, title: "Foundation Check", site: "Emerald Heights", status: "Completed", priority: "Low", time: "Yesterday" },
];

const TaskBoard = () => {
  const [tasks] = useState(initialTasks);

  const columns = ["Pending", "In Progress", "Completed"];

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#06361f] tracking-tight">Field Task Board</h1>
          <p className="text-[#548064] font-bold mt-2 uppercase text-[10px] tracking-widest">Manage your daily construction activities</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-2 rounded-2xl flex gap-1 shadow-sm border border-slate-100">
            <button className="px-6 py-2 bg-[#006a28] text-white rounded-xl text-xs font-black uppercase tracking-widest">My View</button>
            <button className="px-6 py-2 text-[#548064] hover:bg-[#f0fff4] rounded-xl text-xs font-black uppercase tracking-widest transition-all">Team View</button>
          </div>
          <button className="bg-[#006a28] text-white p-4 rounded-2xl shadow-lg shadow-[#006a28]/20 active:scale-90 transition-transform">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {columns.map((column) => (
          <div key={column} className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${
                  column === "Pending" ? "bg-amber-400" : column === "In Progress" ? "bg-[#006a28]" : "bg-slate-300"
                }`}></div>
                <h3 className="text-lg font-black text-[#06361f] tracking-tight">{column}</h3>
              </div>
              <span className="bg-white px-3 py-1 rounded-full text-xs font-black text-[#548064] border border-slate-100 shadow-sm">
                {tasks.filter(t => t.status === column).length}
              </span>
            </div>

            <div className="space-y-6 min-h-[500px] bg-[#f8faf9] p-6 rounded-[2.5rem] border border-slate-100/50">
              {tasks.filter(t => t.status === column).map((task) => (
                <div key={task.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                  
                  {task.priority === "High" && column !== "Completed" && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full m-6 animate-ping"></div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-black text-[#548064] uppercase tracking-widest">{task.site}</span>
                    <span className="text-[10px] font-bold text-[#006a28] bg-[#f0fff4] px-2 py-0.5 rounded-full">{task.time}</span>
                  </div>
                  
                  <h4 className="font-black text-lg text-[#06361f] tracking-tight mb-4 group-hover:text-[#006a28] transition-colors leading-tight">
                    {task.title}
                  </h4>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <div className="flex -space-x-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                      ))}
                    </div>
                    <button className="text-[#006a28] text-xs font-black uppercase tracking-widest hover:underline">
                      Update
                    </button>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-6 rounded-[2rem] border-2 border-dashed border-slate-200 text-[#548064] hover:border-[#006a28] hover:text-[#006a28] hover:bg-white transition-all flex flex-col items-center justify-center gap-2 group">
                <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-500">add_circle</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Quick Log</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
