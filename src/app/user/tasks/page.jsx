"use client";

import React, { useState, useEffect } from "react";

const statusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "In Progress":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Pending":
    default:
      return "bg-rose-100 text-rose-700 border-rose-200";
  }
};

const priorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "text-rose-600 bg-rose-50";
    case "Medium":
      return "text-amber-600 bg-amber-50";
    case "Low":
    default:
      return "text-emerald-600 bg-emerald-50";
  }
};

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user/tasks");
        if (res.ok) {
          const data = await res.json();
          setTasks(data.tasks || []);
        }
      } catch (err) {
        console.error("Failed to fetch user tasks", err);
      }
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const getProgress = (status) => {
    if (status === "Completed") return 100;
    if (status === "In Progress") return 50;
    return 0;
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Task Statistics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: tasks.length, color: "bg-blue-500", icon: "list" },
          { label: "In Progress", value: tasks.filter(t => t.status === "In Progress").length, color: "bg-amber-500", icon: "sync" },
          { label: "Completed", value: tasks.filter(t => t.status === "Completed").length, color: "bg-green-500", icon: "done_all" },
          { label: "Pending", value: tasks.filter(t => t.status === "Pending").length, color: "bg-rose-500", icon: "pending" },
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
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-[#006a28] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">assignment</span>
          <p className="text-sm text-gray-500 font-medium">No tasks found for your projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
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
                  <p className="text-xs font-bold text-[#548064] truncate">Project: <span className="text-[#06361f]">{task.site}</span></p>
                </div>

                {/* Due Date */}
                <div className="bg-[#f0fff4] rounded-2xl p-4 flex justify-between items-center mb-6 border border-[#006a28]/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-[#006a28]">calendar_today</span>
                    <span className="text-xs font-black text-[#39644a] uppercase tracking-tighter">Due Date</span>
                  </div>
                  <span className="text-sm font-black text-[#006a28]">{task.time}</span>
                </div>

                {/* Assigned To */}
                <div className="flex justify-between items-center text-xs mb-6 px-1">
                  <span className="text-slate-400">Assigned To:</span>
                  <span className="font-bold text-[#06361f]">{task.worker}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2 mt-auto">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#548064]">
                  <span>Task Progress</span>
                  <span className="text-[#006a28]">{getProgress(task.status)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#00b042] to-[#006a28] rounded-full shadow-sm transition-all duration-700"
                    style={{ width: `${getProgress(task.status)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;