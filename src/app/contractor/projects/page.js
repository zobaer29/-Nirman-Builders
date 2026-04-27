'use client';
import { useState } from 'react';

const projects = [
  {
    id: 1,
    name: 'Emerald Heights – Wing B',
    type: 'Residential',
    phase: 'Structural Framework & Concreting',
    status: 'In Progress',
    progress: 68,
    labor: 42,
    deadline: 'Jun 15, 2025',
    milestone: 'Slab Casting (Apr 28)',
    budget: '₹4.2 Cr',
    spent: '₹2.8 Cr',
    color: 'primary',
  },
  {
    id: 2,
    name: 'Central Plaza Flooring',
    type: 'Commercial',
    phase: 'Marble Installation & Finishing',
    status: 'Delayed',
    progress: 15,
    labor: 18,
    deadline: 'May 01, 2025',
    milestone: 'Material Shortage – Critical',
    budget: '₹1.8 Cr',
    spent: '₹0.9 Cr',
    color: 'error',
  },
  {
    id: 3,
    name: 'Sector 14 Road Widening',
    type: 'Infrastructure',
    phase: 'Asphalt Laying & Road Marking',
    status: 'On Schedule',
    progress: 82,
    labor: 30,
    deadline: 'May 20, 2025',
    milestone: 'Final Inspection (May 18)',
    budget: '₹2.5 Cr',
    spent: '₹2.1 Cr',
    color: 'secondary',
  },
  {
    id: 4,
    name: 'Green Valley Villas – Block C',
    type: 'Residential',
    phase: 'Interior Plastering & Electrical',
    status: 'In Progress',
    progress: 53,
    labor: 36,
    deadline: 'Jul 30, 2025',
    milestone: 'Wiring Inspection (May 5)',
    budget: '₹3.6 Cr',
    spent: '₹1.9 Cr',
    color: 'primary',
  },
  {
    id: 5,
    name: 'Nirman Trade Centre',
    type: 'Commercial',
    phase: 'Glass Facade & Cladding',
    status: 'In Progress',
    progress: 40,
    labor: 22,
    deadline: 'Aug 10, 2025',
    milestone: 'Glazing Sign-off (Jun 1)',
    budget: '₹6.1 Cr',
    spent: '₹2.4 Cr',
    color: 'primary',
  },
  {
    id: 6,
    name: 'Airport Road Drainage',
    type: 'Infrastructure',
    phase: 'Pipe Laying & Backfilling',
    status: 'On Schedule',
    progress: 91,
    labor: 14,
    deadline: 'Apr 30, 2025',
    milestone: 'Handover (Apr 30)',
    budget: '₹0.9 Cr',
    spent: '₹0.84 Cr',
    color: 'secondary',
  },
];

const statusConfig = {
  'In Progress': { bg: 'bg-primary/10', text: 'text-[#006a28]', dot: 'bg-primary' },
  'Delayed':     { bg: 'bg-red-50',     text: 'text-red-600',   dot: 'bg-red-500' },
  'On Schedule': { bg: 'bg-blue-50',    text: 'text-blue-600',  dot: 'bg-blue-500' },
};

const colorMap = {
  primary:   'bg-primary rounded-full',
  error:     'bg-red-500 rounded-full',
  secondary: 'bg-blue-500 rounded-full',
};

export default function ContractorProjects() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'In Progress', 'Delayed', 'On Schedule'];
  const visible = filter === 'All' ? projects : projects.filter(p => p.status === filter);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            Active Projects
          </span>
          <h2 className="text-4xl font-black text-[#06361f] tracking-tight mt-2">
            Project <span className="text-primary">Pipeline</span>
          </h2>
          <p className="text-[#548064] font-bold mt-1">{projects.length} active sites across all phases</p>
        </div>
        <div className="flex gap-3">
          <button className="glass px-6 py-3 rounded-2xl font-black text-[#06361f] flex items-center gap-2 hover:bg-white transition-all shadow-sm text-sm">
            <span className="material-symbols-outlined text-lg">file_download</span>
            Export
          </button>
          <button className="premium-gradient text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all text-sm">
            <span className="material-symbols-outlined text-lg">add</span>
            New Project
          </button>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Active', value: '6', icon: 'architecture', color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Delayed', value: '1', icon: 'warning', color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'On Schedule', value: '2', icon: 'check_circle', color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Avg Progress', value: '58%', icon: 'trending_up', color: 'text-[#006a28]', bg: 'bg-primary/10' },
        ].map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-[28px] premium-shadow flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color}`}>
              <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-[#06361f]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              filter === f
                ? 'premium-gradient text-white shadow-lg shadow-primary/20'
                : 'glass text-[#548064] hover:bg-white hover:text-[#06361f]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visible.map((project) => {
          const sc = statusConfig[project.status] || statusConfig['In Progress'];
          return (
            <div key={project.id} className="glass p-8 rounded-[36px] premium-shadow hover:bg-white transition-all duration-300 group cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-[#548064] uppercase tracking-widest bg-[#f0f4f2] px-2 py-0.5 rounded-full">
                      {project.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#06361f]">{project.name}</h3>
                  <p className="text-sm font-bold text-[#548064]">{project.phase}</p>
                </div>
                <div className={`flex items-center gap-1.5 ${sc.bg} ${sc.text} px-3 py-1.5 rounded-2xl self-start`}>
                  <span className={`w-1.5 h-1.5 ${sc.dot} rounded-full animate-pulse`}></span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{project.status}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-black text-[#548064] uppercase tracking-widest">Progress</span>
                  <span className="text-xs font-black text-[#06361f]">{project.progress}%</span>
                </div>
                <div className="h-2.5 w-full bg-[#f0f4f2] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${colorMap[project.color]}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest mb-1">Labor</p>
                  <p className="text-sm font-black text-[#06361f]">{project.labor} Staff</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest mb-1">Deadline</p>
                  <p className="text-sm font-black text-[#06361f]">{project.deadline}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#548064] uppercase tracking-widest mb-1">Budget</p>
                  <p className="text-sm font-black text-[#06361f]">{project.budget}</p>
                </div>
              </div>

              {/* Milestone */}
              <div className="bg-[#f0f4f2] px-4 py-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#548064] text-sm">flag</span>
                  <span className="text-xs font-black text-[#548064]">Next: {project.milestone}</span>
                </div>
                <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
