"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WorkerDashboard() {
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [profile, setProfile] = useState(null);
  const [sites, setSites] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load shift state from localStorage on mount
  useEffect(() => {
    const savedShift = localStorage.getItem('worker_shift_active');
    const savedTimer = localStorage.getItem('worker_shift_timer');
    const savedTime = localStorage.getItem('worker_shift_start_time');
    
    if (savedShift === 'true') {
      setIsShiftActive(true);
      if (savedTime) {
        const elapsed = Math.floor((Date.now() - Number(savedTime)) / 1000);
        setTimer(elapsed > 0 ? elapsed : 0);
      } else if (savedTimer) {
        setTimer(Number(savedTimer));
      }
    }
  }, []);

  // Timer interval
  useEffect(() => {
    let interval;
    if (isShiftActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const next = prev + 1;
          localStorage.setItem('worker_shift_timer', next.toString());
          return next;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isShiftActive]);

  // Fetch initial dynamic dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch profile
        const profileRes = await fetch('/api/auth/profile');
        let userProfile = null;
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          userProfile = profileData.user;
          setProfile(userProfile);
        }

        // Fetch sites
        const sitesRes = await fetch('/api/worker/projects');
        let activeSites = [];
        if (sitesRes.ok) {
          const sitesData = await sitesRes.json();
          activeSites = sitesData.sites || [];
          setSites(activeSites);
        }

        // Fetch tasks
        const tasksRes = await fetch('/api/worker/tasks');
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData.tasks || []);
        }
      } catch (err) {
        console.error("Error loading worker dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShiftToggle = () => {
    if (!isShiftActive) {
      setIsShiftActive(true);
      localStorage.setItem('worker_shift_active', 'true');
      localStorage.setItem('worker_shift_start_time', Date.now().toString());
      setTimer(0);
    } else {
      setIsShiftActive(false);
      localStorage.setItem('worker_shift_active', 'false');
      localStorage.removeItem('worker_shift_start_time');
      localStorage.removeItem('worker_shift_timer');
    }
  };

  const handleUpdateStatus = async (taskId, currentStatus, resultValue = null) => {
    let nextStatus = "";
    if (resultValue) {
      nextStatus = "Completed";
    } else if (currentStatus === "Pending") {
      nextStatus = "In Progress";
    } else if (currentStatus === "In Progress") {
      nextStatus = "Completed";
    } else {
      return;
    }

    try {
      const res = await fetch(`/api/worker/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, result: resultValue }),
      });
      if (res.ok) {
        const [tasksRes, sitesRes] = await Promise.all([
          fetch('/api/worker/tasks'),
          fetch('/api/worker/projects'),
        ]);
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData.tasks || []);
        }
        if (sitesRes.ok) {
          const sitesData = await sitesRes.json();
          setSites(sitesData.sites || []);
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update task status");
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeSite = sites.length > 0 ? sites[0] : null;

  if (loading) {
    return (
      <main className="p-10 max-w-[1600px] mx-auto w-full flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#006a28] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#548064] font-black uppercase tracking-widest text-xs">Loading Dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-10 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <section className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] shadow-xl shadow-[#006a28]/5 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0fff4] rounded-full -mr-32 -mt-32 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-[#006a28] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
              {activeSite?.role || 'Technician'}
            </span>
            <span className="text-[#548064] text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified</span>
              Certified
            </span>
          </div>
          <h1 className="font-black text-5xl text-[#06361f] tracking-tight mb-4">
            Good Morning, <span className="text-[#006a28]">{profile?.username || 'Arjun'}!</span>
          </h1>
          <p className="text-[#39644a] font-bold flex items-center gap-2 text-lg">
            <span className="material-symbols-outlined text-[#006a28] text-2xl">location_on</span>
            {activeSite ? `${activeSite.name} • ${activeSite.location}` : 'No Assigned Active Site'}
          </p>
        </div>

        {/* Shift Timer Widget */}
        <div className="relative z-10 bg-[#06361f] p-8 rounded-[2.5rem] text-white min-w-[320px] shadow-2xl shadow-[#06361f]/20">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Active Shift</p>
              <p className="text-4xl font-black font-mono tracking-wider">{formatTime(timer)}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${isShiftActive ? 'bg-[#4bee74] animate-pulse shadow-[0_0_12px_#4bee74]' : 'bg-rose-500'}`}></div>
          </div>
          
          <button 
            onClick={handleShiftToggle}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isShiftActive 
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20' 
              : 'bg-[#4bee74] hover:bg-[#3ddb66] text-[#06361f] shadow-lg shadow-[#4bee74]/20'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {isShiftActive ? 'stop_circle' : 'play_circle'}
            </span>
            {isShiftActive ? 'End Work Day' : 'Start My Shift'}
          </button>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Task Board (Col 1-8) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-2xl text-[#06361f] tracking-tight">Today&apos;s Assignments</h3>
              <p className="text-[#548064] text-xs font-bold mt-1">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • {tasks.filter(t => t.status !== 'Completed').length} Active Tasks
              </p>
            </div>
            <a href="/worker/tasks" className="bg-white border border-slate-200 text-[#006a28] px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#f0fff4] transition-all">
              Task Board
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {tasks.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] text-center border border-dashed border-slate-200">
                <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">task</span>
                <p className="font-black text-[#06361f] text-lg">No tasks assigned yet</p>
                <p className="text-slate-400 text-sm mt-1">Your contractor hasn&apos;t assigned you any tasks for today.</p>
              </div>
            ) : (
              tasks.slice(0, 5).map((task) => (
                <div key={task.id} className={`group bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${task.status === 'Completed' ? 'opacity-60' : ''}`}>
                  {task.priority === 'High' && task.status !== 'Completed' && (
                    <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-rose-500 rotate-45 flex items-end justify-center pb-2 shadow-lg">
                      <span className="material-symbols-outlined text-white text-lg">priority_high</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                          task.status === 'Completed' ? 'bg-slate-100 text-slate-500' : 'bg-[#f0fff4] text-[#006a28]'
                        }`}>
                          {task.status}
                        </span>
                        <span className="text-[10px] font-bold text-[#548064] flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {task.time}
                        </span>
                      </div>
                      <h4 className={`font-black text-xl text-[#06361f] tracking-tight mb-2 group-hover:text-[#006a28] transition-colors ${task.status === 'Completed' ? 'line-through' : ''}`}>
                        {task.title}
                      </h4>
                      <p className="text-[#548064] text-sm font-medium">{task.description}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {task.status !== 'Completed' && (
                        (task.title.startsWith('Verify Order:') || task.title.startsWith('Receive:')) ? (
                          <div className="flex gap-2 w-full md:w-auto">
                            <button 
                              onClick={() => handleUpdateStatus(task.id, task.status, 'Accepted')}
                              className="px-6 py-3.5 bg-[#006a28] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#005a22] transition-all shadow-lg shadow-[#006a28]/10 active:scale-95"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(task.id, task.status, 'Rejected')}
                              className="px-6 py-3.5 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/10 active:scale-95"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleUpdateStatus(task.id, task.status)}
                            className="flex-1 md:flex-none px-8 py-3.5 bg-[#006a28] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#005a22] transition-all shadow-lg shadow-[#006a28]/10 active:scale-95"
                          >
                            {task.status === 'Pending' ? 'Start' : 'Finish'}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar (Col 9-12) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Site Map Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group">
            <h3 className="font-black text-xl text-[#06361f] mb-6 tracking-tight">Active Site Location</h3>
            <div className="relative h-56 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f0fff4] to-[#c7fdd8] animate-pulse"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl text-[#006a28] mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl">location_on</span>
                </div>
                <p className="text-xs font-black text-[#006a28] uppercase tracking-widest">
                  {activeSite ? activeSite.location : 'Plot TBD'}
                </p>
                <p className="text-[10px] font-bold text-[#548064] mt-1">
                  {activeSite ? activeSite.name : 'No assigned project'}
                </p>
              </div>
              {/* Decorative grid pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#006a28 0.5px, transparent 0.5px)', backgroundSize: '12px 12px' }}></div>
            </div>
            <a href="/worker/projects" className="w-full mt-6 py-4 bg-[#f0fff4] text-[#006a28] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#006a28] hover:text-white transition-all active:scale-95 block text-center">
              View All Sites
            </a>
          </div>

          {/* Quick Work Log */}
          <div className="bg-[#006a28] p-10 rounded-[2.5rem] text-white shadow-2xl shadow-[#006a28]/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mt-16"></div>
            <h3 className="font-black text-2xl mb-6 relative z-10">Quick Work Log</h3>
            <form className="space-y-5 relative z-10" onSubmit={(e) => { e.preventDefault(); alert("Report submitted successfully!"); }}>
              <div>
                <label className="block text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2">Select Task</label>
                <select className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:ring-2 focus:ring-[#4bee74] outline-none appearance-none cursor-pointer">
                  {tasks.length > 0 ? (
                    tasks.map(t => (
                      <option key={t.id} value={t.id} className="text-slate-900">{t.title}</option>
                    ))
                  ) : (
                    <option className="text-slate-900">No active tasks</option>
                  )}
                </select>
              </div>
              
              <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group">
                <span className="material-symbols-outlined text-white/40 mb-2 text-3xl group-hover:scale-110 transition-transform">photo_camera</span>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Snap Progress Photo</span>
              </div>

              <button type="submit" className="w-full py-5 bg-[#4bee74] text-[#06361f] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#4bee74]/20 hover:bg-[#3ddb66] transition-all active:scale-95 mt-4">
                Submit Report
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
