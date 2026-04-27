"use client";

import React, { useState } from "react";

const projectsData = [
  {
    id: 1,
    name: "The Emerald Heights",
    client: "Mr. Hasan",
    status: "Ongoing",
    progress: 65,
    image: "https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070&auto=format&fit=crop",
    type: "Residential",
    budget: "$4.2M",
  },
  {
    id: 2,
    name: "Metropolis Plaza",
    client: "ABC Group",
    status: "Pending",
    progress: 20,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    type: "Commercial",
    budget: "$12.8M",
  },
  {
    id: 3,
    name: "Skyline Office Suites",
    client: "Tech Corp",
    status: "Completed",
    progress: 100,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop",
    type: "Commercial",
    budget: "$1.5M",
  },
  {
    id: 4,
    name: "Golden Gate Bridge",
    client: "Govt. Project",
    status: "Ongoing",
    progress: 45,
    image: "https://images.unsplash.com/photo-1545459720-aac273a27b3d?q=80&w=2070&auto=format&fit=crop",
    type: "Infrastructure",
    budget: "$45M",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-500 text-white shadow-sm shadow-green-200";
    case "Ongoing":
      return "bg-amber-500 text-white shadow-sm shadow-amber-200";
    case "Pending":
      return "bg-rose-500 text-white shadow-sm shadow-rose-200";
    default:
      return "bg-slate-500 text-white";
  }
};

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredProjects = projectsData.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Search & Filter Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#006a28]/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-[#f0fff4] border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#006a28] outline-none transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#548064]">search</span>
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {["All", "Ongoing", "Pending", "Completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                filter === f 
                  ? "bg-[#006a28] text-white shadow-lg shadow-[#006a28]/20" 
                  : "bg-[#f0fff4] text-[#39644a] hover:bg-[#c7fdd8]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100"
          >
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-4 right-4">
                <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-wider ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <div className="absolute bottom-4 left-6">
                <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{project.type}</p>
                <h3 className="text-white font-black text-xl tracking-tight">{project.name}</h3>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] text-[#548064] font-bold uppercase tracking-widest mb-1">Client</p>
                  <p className="font-bold text-[#06361f]">{project.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#548064] font-bold uppercase tracking-widest mb-1">Budget</p>
                  <p className="font-black text-[#006a28]">{project.budget}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-black text-[#39644a] uppercase tracking-wider">Completion</span>
                  <span className="text-xl font-black text-[#006a28]">{project.progress}%</span>
                </div>
                <div className="w-full h-3 bg-[#f0fff4] rounded-full overflow-hidden p-0.5 border border-[#006a28]/5">
                  <div
                    className="h-full bg-gradient-to-r from-[#00b042] to-[#006a28] rounded-full shadow-[0_0_8px_rgba(0,106,40,0.3)] transition-all duration-1000 ease-out"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 bg-[#006a28] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#005a22] transition-colors shadow-lg shadow-[#006a28]/20 active:scale-95">
                  View Full Site
                </button>
                <button className="w-14 h-14 bg-[#f0fff4] text-[#006a28] rounded-2xl flex items-center justify-center hover:bg-[#c7fdd8] transition-colors border border-[#006a28]/10 active:scale-95">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;