"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // Project Chat State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const fetchData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      const [projRes, taskRes] = await Promise.all([
        fetch("/api/user/projects"),
        fetch("/api/user/tasks")
      ]);

      if (!projRes.ok) throw new Error("Failed to load projects");
      if (!taskRes.ok) throw new Error("Failed to load tasks");

      const projData = await projRes.json();
      const taskData = await taskRes.json();

      setProjects(projData.projects || []);
      setTasks(taskData.tasks || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  const handleUpdateStatus = async (task, resultValue = null) => {
    try {
      const res = await fetch(`/api/worker/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed", result: resultValue }),
      });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update task status");
      }
    } catch (err) {
      console.error("Error updating task status", err);
    }
  };

  const activeProject = projects.length > 0 ? projects[activeProjectIndex] : null;

  useEffect(() => {
    if (activeProject) {
      setChatMessages([
        {
          id: 1,
          sender: "user",
          text: `Hi Rajiv, can we confirm the switch to granite for the kitchen island by tomorrow for ${activeProject.name}?`,
          time: "09:42 AM"
        },
        {
          id: 2,
          sender: "architect",
          senderName: "Rajiv Nirman",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSj2BKtIZaWOoSknywzggAEJuo9UAKKLlQFBcdpJBKN1w0LinCKL9xotHXTMvxWFaEV1cCddhm_lAhhHZOOycETIeue-CzW8Zw1Dax81uR-UrhyZb8Ps7kAAV4uRGTIwxsP_aHb9STUp5wKXkQnWB3l4HMKAtto5y_n02uTwBwKN6zjQrbEvnvu5ma8BpctE6hkgpPZm0rYaN2yAhngcejR9_rlsLQLWR2DGZR5RMhWRSv4EzGLOfyUxalROtD7ONyIq03FWskwz8",
          text: "Absolutely. I've sent the updated material specs to the site lead. We need your sign-off on the color sample.",
          time: "10:15 AM"
        },
        {
          id: 3,
          sender: "contractor",
          senderName: "Contractor Team",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9n7ZBDtBSyMt869DnfTjucTzmhrw5dNgko_dYOhEZMzvhtfoIG5Eaiilmzl_VLiBnqwgX8I2mBTYXThGqBQbwo27HHGJei_H7kUiU-9sHrestBmbdjIZShyzTH9JoyO_L2iHnNsn5kou1c52UyRennl2f_7ifgP7sE7u6QH3wIj1f5SkJb2nnYbRz5HXakuA7dPQaNXix8NZGOHmKhrmyL8Ew5S6FAOTc3xlFkojDABZ_kKqs_u2Zgt_lWkky0g39ynJwjm226Xo",
          text: "Sample board is ready at the site office. Please drop by whenever convenient.",
          time: "10:30 AM"
        }
      ]);
    }
  }, [activeProject]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "architect",
          senderName: "Rajiv Nirman",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSj2BKtIZaWOoSknywzggAEJuo9UAKKLlQFBcdpJBKN1w0LinCKL9xotHXTMvxWFaEV1cCddhm_lAhhHZOOycETIeue-CzW8Zw1Dax81uR-UrhyZb8Ps7kAAV4uRGTIwxsP_aHb9STUp5wKXkQnWB3l4HMKAtto5y_n02uTwBwKN6zjQrbEvnvu5ma8BpctE6hkgpPZm0rYaN2yAhngcejR9_rlsLQLWR2DGZR5RMhWRSv4EzGLOfyUxalROtD7ONyIq03FWskwz8",
          text: `Got it! I will look into it and make sure it is aligned with the specs for ${activeProject.name}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 space-y-4 animate-in fade-in duration-500">
        <span className="material-symbols-outlined text-5xl text-[#006a28] animate-spin">
          progress_activity
        </span>
        <p className="text-[#548064] font-body text-sm font-semibold">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-3xl text-sm font-semibold max-w-lg mx-auto shadow-sm">
          <span className="material-symbols-outlined text-4xl mb-2 text-rose-500 block">warning</span>
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#006a28] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#005a22]"
        >
          Retry Load
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-8 py-20 bg-white rounded-3xl border border-slate-100 shadow-xl animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-[#f0fff4] text-[#006a28] rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <span className="material-symbols-outlined text-4xl">architecture</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-[#06361f] tracking-tight">No active projects found</h3>
          <p className="text-[#548064] font-body text-sm max-w-md mx-auto">
            You don't have any construction projects yet. Start a new project to track its timeline, logs, tasks, and communicate with the site team!
          </p>
        </div>
        <Link
          href="/user/projects"
          className="inline-flex bg-[#006a28] text-white font-black px-8 py-4 rounded-2xl items-center justify-center gap-2 shadow-lg shadow-[#006a28]/20 hover:bg-[#005a22] transition-all text-xs uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Create Your First Project
        </Link>
      </div>
    );
  }

  // Filter tasks for the active project
  const projectTasks = tasks.filter(t => t.projectId === activeProject.id);

  // Compute timeline steps based on progress
  const progress = activeProject.progress || 0;
  const steps = [
    {
      name: "FOUNDATION",
      originalIcon: "check",
      completed: progress >= 20,
      active: progress > 0 && progress < 20,
    },
    {
      name: "STRUCTURAL",
      originalIcon: "check",
      completed: progress >= 50,
      active: progress >= 20 && progress < 50,
    },
    {
      name: "PLUMBING & ELECTRICAL",
      originalIcon: "bolt",
      completed: progress >= 80,
      active: progress >= 50 && progress < 80,
    },
    {
      name: "INTERIOR FINISH",
      originalIcon: "format_paint",
      completed: progress >= 95,
      active: progress >= 80 && progress < 95,
    },
    {
      name: "HANDOVER",
      originalIcon: "key",
      completed: progress === 100,
      active: progress >= 95 && progress < 100,
    }
  ];

  // Dynamic log photos based on tasks or progress
  const getLogPhotos = () => {
    const defaultPhotos = [
      {
        src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop",
        title: "Foundation Check",
      },
      {
        src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop",
        title: "Beam Inspection",
      },
      {
        src: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=600&auto=format&fit=crop",
        title: "Electrical Layout",
      }
    ];

    const activeTasks = projectTasks.filter(t => t.status === "Completed" || t.status === "In Progress").slice(0, 3);
    return defaultPhotos.map((photo, i) => {
      if (activeTasks[i]) {
        return {
          src: photo.src,
          title: `${activeTasks[i].title} - ${activeTasks[i].status}`,
        };
      }
      // Set title based on current progress
      let phaseTitle = photo.title;
      if (i === 0) phaseTitle = progress >= 20 ? "Foundation Casted" : "Excavating Site";
      if (i === 1) phaseTitle = progress >= 50 ? "Structural Frame Complete" : "Column Reinforcement";
      if (i === 2) phaseTitle = progress >= 80 ? "Service Pipes Placed" : "Pipes Routing";
      return {
        src: photo.src,
        title: phaseTitle,
      };
    });
  };

  // Dynamic project documents
  const documents = [
    {
      name: `Architectural Plan - ${activeProject.name}_V2`,
      size: "12.4 MB",
      type: "PDF",
      icon: "picture_as_pdf",
      iconColor: "bg-[#b02500]/10 text-[#b02500]"
    },
    {
      name: `Structural Audit - ${activeProject.name}`,
      size: "4.8 MB",
      type: "PDF",
      icon: "picture_as_pdf",
      iconColor: "bg-[#b02500]/10 text-[#b02500]"
    },
    {
      name: `Estimated Budget - ${activeProject.name}`,
      size: "1.2 MB",
      type: "DOCX",
      icon: "description",
      iconColor: "bg-[#006a28]/10 text-[#006a28]"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Hero Project Section: Timeline */}
      <section className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="px-3 py-1 bg-[#78f5ae] text-[#005a35] rounded-full text-xs font-bold font-label tracking-wide">
                {activeProject.status === "Ongoing" ? "ON TRACK" : activeProject.status.toUpperCase()}
              </span>
              
              {/* Project selector dropdown */}
              {projects.length > 1 && (
                <div className="relative inline-block">
                  <select
                    value={activeProjectIndex}
                    onChange={(e) => setActiveProjectIndex(Number(e.target.value))}
                    className="bg-[#f0fff4] border border-[#006a28]/10 text-[#006a28] font-bold text-xs rounded-xl py-1 px-3 pr-8 appearance-none outline-none cursor-pointer focus:ring-2 focus:ring-[#006a28]/20"
                  >
                    {projects.map((p, idx) => (
                      <option key={p.id} value={idx}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined text-[16px] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#006a28]">
                    expand_more
                  </span>
                </div>
              )}
            </div>
            
            <h3 className="text-3xl font-headline font-extrabold tracking-tight text-[#06361f]">
              {activeProject.name}
            </h3>
            <p className="text-[#548064] font-body mt-1">
              {activeProject.type} | {activeProject.location || "Location not specified"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#548064] font-bold uppercase tracking-widest">
              Handover Date
            </p>
            <p className="text-2xl font-headline font-bold text-[#006a28]">
              {(() => {
                const createdDate = new Date(activeProject.createdAt || new Date());
                createdDate.setMonth(createdDate.getMonth() + 12);
                return createdDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              })()}
            </p>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="relative pt-8 pb-4 px-2">
          <div className="absolute top-1/2 left-0 w-full h-[6px] bg-[#a8ecbf] rounded-full -translate-y-1/2 overflow-hidden">
            <div
              className="h-full bg-[#006a28] rounded-full shadow-[0_0_8px_rgba(0,106,40,0.4)] transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="relative flex justify-between">
            {steps.map((step, idx) => {
              let circleClass = "";
              let iconName = step.originalIcon;
              let textStatus = "";
              let textStatusClass = "";

              if (step.completed) {
                circleClass = "w-10 h-10 bg-[#006a28] text-[#cfffce] shadow-lg";
                iconName = "check";
                textStatus = "Completed";
                textStatusClass = "text-[#89b898] font-medium";
              } else if (step.active) {
                circleClass = "w-12 h-12 bg-[#006a28] border-4 border-[#cfffce] text-[#cfffce] shadow-xl -mt-1";
                textStatus = `In Progress (${progress}%)`;
                textStatusClass = "text-[#005d22] font-bold";
              } else {
                circleClass = "w-10 h-10 bg-[#a8ecbf] text-[#548064]";
                textStatus = idx === steps.findIndex(s => !s.completed && !s.active) ? "Next Phase" : "Upcoming";
                textStatusClass = "text-[#89b898] font-medium";
              }

              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${circleClass}`}>
                    <span className="material-symbols-outlined text-sm" style={step.completed ? { fontVariationSettings: '"FILL" 1' } : {}}>
                      {iconName}
                    </span>
                  </div>
                  <p className={`mt-4 text-[11px] font-bold font-headline text-center ${step.active ? 'text-[#006a28]' : 'text-[#548064]'}`}>
                    {step.name}
                  </p>
                  <p className={`text-[10px] mt-1 ${textStatusClass}`}>{textStatus}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Site Logs & Gallery */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#c7fdd8] rounded-xl p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline font-bold text-xl text-[#06361f]">Site Work Logs</h4>
              <Link href="/user/tasks" className="text-[#006a28] font-bold text-sm flex items-center gap-1 hover:underline">
                View Full Tasks
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            
            {/* Photo Feed */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {getLogPhotos().map((photo, i) => (
                <div key={i} className={`group relative rounded-lg overflow-hidden aspect-square cursor-pointer ${i === 2 ? 'hidden md:block' : ''}`}>
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={photo.title}
                    src={photo.src}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06361f]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <p className="text-white text-xs font-bold">{photo.title}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Dynamic Tasks Log List */}
            <div className="mt-8 space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {projectTasks.length > 0 ? (
                projectTasks.slice(0, 5).map((task) => {
                  let icon = "task_alt";
                  let iconBg = "bg-[#00693f]/10 text-[#00693f]";
                  if (task.status === "Pending") {
                    icon = "schedule";
                    iconBg = "bg-rose-500/10 text-rose-500";
                  } else if (task.status === "In Progress") {
                    icon = "engineering";
                    iconBg = "bg-amber-500/10 text-amber-500";
                  }

                  return (
                    <div key={task.id} className="bg-white p-4 rounded-lg flex gap-4 items-start border border-[#548064]/5 shadow-sm hover:shadow-md transition-shadow">
                      <div className={`p-2 rounded-lg ${iconBg}`}>
                        <span className="material-symbols-outlined">{icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h5 className="text-sm font-bold font-headline text-[#06361f]">{task.title}</h5>
                          <span className="text-[10px] font-medium text-[#548064]">{task.time}</span>
                        </div>
                        <p className="text-xs text-[#39644a] mt-1 leading-relaxed">
                          {task.description || "No description provided."}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[9px] font-black uppercase text-[#548064]">
                          <div className="flex gap-4">
                            <span>Worker: <strong className="text-[#06361f]">{task.worker}</strong></span>
                            <span>Priority: <strong className={task.priority === "High" ? "text-rose-600" : "text-[#006a28]"}>{task.priority}</strong></span>
                          </div>
                          {task.status !== "Completed" && (task.title.startsWith("Verify Order:") || task.title.startsWith("Receive:")) && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(task, "Accepted")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-lg transition-all shadow-sm active:scale-95 normal-case"
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(task, "Rejected")}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-1 rounded-lg transition-all shadow-sm active:scale-95 normal-case"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-[#548064]/20 text-[#548064] text-xs">
                  No recent tasks or work logs recorded for this project yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Documents & Chat */}
        <div className="space-y-8">
          {/* Document Center */}
          <div className="bg-[#a8ecbf]/30 rounded-xl p-6 border border-[#006a28]/10">
            <h4 className="font-headline font-bold text-lg mb-6 flex items-center gap-2 text-[#06361f]">
              <span className="material-symbols-outlined text-[#006a28]">folder_open</span>
              Document Center
            </h4>
            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg flex items-center justify-between group hover:shadow-md transition-all border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${doc.iconColor} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-sm">{doc.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold font-headline leading-none text-[#06361f]">{doc.name}</p>
                      <p className="text-[9px] text-[#548064] mt-1 uppercase">{doc.size} • {doc.type}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#dcffe5] text-[#006a28] transition-colors">
                    <span className="material-symbols-outlined text-lg">download</span>
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 rounded-lg border-2 border-[#006a28]/20 text-[#006a28] font-bold text-xs hover:bg-[#006a28]/5 transition-colors">
              Request New Report
            </button>
          </div>

          {/* Communication Panel */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-headline font-bold text-lg text-[#06361f]">Project Chat</h4>
              <span className={`w-2 h-2 rounded-full ${isTyping ? 'bg-amber-500 animate-bounce' : 'bg-[#006a28] animate-pulse'}`}></span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-hide">
              {chatMessages.map((msg) => {
                if (msg.sender === "user") {
                  return (
                    <div key={msg.id} className="flex justify-end animate-in fade-in slide-in-from-right-2 duration-300">
                      <div className="bg-[#006a28] text-[#cfffce] p-3 rounded-xl rounded-tr-none max-w-[80%] shadow-sm">
                        <p className="text-xs">{msg.text}</p>
                        <p className="text-[9px] text-[#cfffce]/60 mt-1 text-right">{msg.time}</p>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div key={msg.id} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <img
                      className="w-6 h-6 rounded-full self-end object-cover border border-[#006a28]/10"
                      alt={msg.senderName}
                      src={msg.avatar}
                    />
                    <div className="bg-[#bbf6ce] p-3 rounded-xl rounded-tl-none max-w-[80%] shadow-sm border border-[#006a28]/5">
                      <p className="text-[9px] font-bold text-[#006a28] mb-1">{msg.senderName}</p>
                      <p className="text-xs text-[#06361f]">{msg.text}</p>
                      <p className="text-[9px] text-[#548064] mt-1">{msg.time}</p>
                    </div>
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex gap-2">
                  <img
                    className="w-6 h-6 rounded-full self-end object-cover border border-[#006a28]/10"
                    alt="Architect avatar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSj2BKtIZaWOoSknywzggAEJuo9UAKKLlQFBcdpJBKN1w0LinCKL9xotHXTMvxWFaEV1cCddhm_lAhhHZOOycETIeue-CzW8Zw1Dax81uR-UrhyZb8Ps7kAAV4uRGTIwxsP_aHb9STUp5wKXkQnWB3l4HMKAtto5y_n02uTwBwKN6zjQrbEvnvu5ma8BpctE6hkgpPZm0rYaN2yAhngcejR9_rlsLQLWR2DGZR5RMhWRSv4EzGLOfyUxalROtD7ONyIq03FWskwz8"
                  />
                  <div className="bg-[#bbf6ce] p-3 rounded-xl rounded-tl-none shadow-sm flex items-center space-x-1 border border-[#006a28]/5">
                    <span className="w-1.5 h-1.5 bg-[#006a28] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#006a28] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#006a28] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="relative">
              <input
                className="w-full bg-[#c7fdd8] outline-none border-none rounded-full pl-4 pr-12 py-3 text-xs focus:ring-2 focus:ring-[#006a28] focus:bg-white transition-all font-medium text-[#06361f] placeholder-[#548064]/60"
                placeholder="Type a message..."
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-1 top-1 w-9 h-9 bg-[#006a28] text-[#cfffce] rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-md hover:bg-[#005a22]"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-[#548064]/10 text-xs font-medium text-[#06361f]/50">
        <p>© 2024 Nirman Builders Pvt Ltd. All structural plans are copyrighted.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a className="hover:text-[#006a28]" href="#">Privacy Protocol</a>
          <a className="hover:text-[#006a28]" href="#">Site Safety Standards</a>
          <a className="hover:text-[#006a28]" href="#">Contact Support</a>
        </div>
      </div>
    </div>
  );
}
