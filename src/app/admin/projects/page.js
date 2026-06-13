"use client";

import React, { useState, useEffect } from "react";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedContractorId, setSelectedContractorId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const projRes = await fetch("/api/admin/projects");
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData.projects || []);
      }
      const contRes = await fetch("/api/admin/contractors");
      if (contRes.ok) {
        const contData = await contRes.json();
        setContractors(contData.contractors || []);
      }
    } catch (error) {
      console.error("Failed to fetch admin projects data", error);
    }
    setLoading(false);
  };

  const handleReject = async (projectId) => {
    if (!confirm("Are you sure you want to reject this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to reject project");
      }
    } catch (error) {
      console.error("Error rejecting project", error);
    }
  };

  const openApproveModal = (project) => {
    setSelectedProject(project);
    setSelectedContractorId("");
    setModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedContractorId) {
      alert("Please select a contractor to assign to this project");
      return;
    }
    try {
      const res = await fetch(`/api/admin/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "accept",
          contractorId: Number(selectedContractorId),
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to approve project");
      }
    } catch (error) {
      console.error("Error approving project", error);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Ongoing":
        return "bg-primary-container/20 text-primary-dim border-primary/20";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">
            Projects Repository
          </h2>
          <p className="text-on-surface-variant font-body mt-1">
            Manage, approve, and assign contractors to client project requests.
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="bg-primary hover:bg-primary-dim text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition-colors font-headline"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">folder_open</span>
          <p className="text-on-surface-variant font-body">No projects have been requested yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4 gap-2">
                  <h4 className="font-extrabold text-lg text-[#06361f] tracking-tight">{project.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant mb-6 line-clamp-3">
                  {project.description || "No description provided."}
                </p>
                
                <div className="space-y-3 border-t border-slate-50 pt-4 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Client:</span>
                    <span className="font-bold text-[#06361f]">{project.client}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Type:</span>
                    <span className="font-bold text-[#06361f]">{project.type}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Budget:</span>
                    <span className="font-bold text-[#006a28]">{project.budget}</span>
                  </div>
                  {project.location && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-bold text-[#06361f]">{project.location}</span>
                    </div>
                  )}
                  {project.contractor && (
                    <div className="flex justify-between text-xs bg-[#f0fff4] p-2 rounded-xl">
                      <span className="text-[#006a28] font-bold">Contractor:</span>
                      <span className="font-bold text-[#006a28]">{project.contractor}</span>
                    </div>
                  )}
                </div>
              </div>

              {project.status === "Pending" && (
                <div className="flex gap-3 mt-auto pt-2">
                  <button 
                    onClick={() => openApproveModal(project)}
                    className="flex-1 py-3 bg-[#006a28] hover:bg-[#005c22] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(project.id)}
                    className="flex-1 py-3 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Approve Modal */}
      {modalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 mx-4">
            <h3 className="text-2xl font-black text-[#06361f] tracking-tight mb-4">Assign Contractor</h3>
            <p className="text-sm text-slate-500 mb-6">
              Select a qualified contractor to take charge of <strong>{selectedProject.name}</strong>.
            </p>

            <div className="space-y-4 mb-8">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Available Contractors</label>
              <select 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm font-bold text-[#06361f] focus:ring-4 focus:ring-[#006a28]/5 outline-none"
                value={selectedContractorId}
                onChange={(e) => setSelectedContractorId(e.target.value)}
              >
                <option value="">-- Choose Contractor --</option>
                {contractors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name || c.username} ({c.specialization || "General Builders"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleApprove}
                className="flex-1 py-4 bg-[#006a28] hover:bg-[#005c22] text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-[#006a28]/10"
              >
                Confirm Assign
              </button>
              <button 
                onClick={() => setModalOpen(false)}
                className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
