"use client";

import React, { useState, useEffect, useCallback } from "react";

const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Infrastructure",
  "Renovation",
];

const EMPTY_FORM = {
  name: "",
  project_type: "Residential",
  location: "",
  description: "",
  budget: "",
};

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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/user/projects");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load projects");
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/user/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          project_type: form.project_type,
          location: form.location,
          description: form.description,
          budget: form.budget,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");

      setProjects((prev) => [data.project, ...prev]);
      setShowModal(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#06361f] tracking-tight">
            My Projects
          </h2>
          <p className="text-[#548064] font-medium text-sm mt-1">
            {loading
              ? "Loading..."
              : `${projects.length} project${projects.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowModal(true);
            setError("");
          }}
          className="bg-[#006a28] text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#006a28]/20 hover:bg-[#005a22] transition-all active:scale-95 text-sm uppercase tracking-widest"
        >
          <span className="material-symbols-outlined">add</span>
          Start New Project
        </button>
      </div>

      {error && !showModal && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

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
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#548064]">
            search
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {["All", "Ongoing", "Pending", "Completed"].map((f) => (
            <button
              key={f}
              type="button"
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

      {/* Loading / Empty */}
      {loading && (
        <div className="flex justify-center py-20">
          <span className="material-symbols-outlined text-4xl text-[#006a28] animate-spin">
            progress_activity
          </span>
        </div>
      )}

      {!loading && filteredProjects.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-[#006a28]/20">
          <span className="material-symbols-outlined text-5xl text-[#006a28]/40 mb-4">
            architecture
          </span>
          <h3 className="text-xl font-black text-[#06361f] mb-2">
            {projects.length === 0
              ? "No projects yet"
              : "No projects match your filters"}
          </h3>
          <p className="text-[#548064] text-sm mb-6 max-w-md mx-auto">
            {projects.length === 0
              ? "Start your first construction project and track it from here."
              : "Try a different search or filter."}
          </p>
          {projects.length === 0 && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-[#006a28] text-white font-black px-8 py-3 rounded-2xl text-sm uppercase tracking-widest hover:bg-[#005a22] transition-colors"
            >
              Start New Project
            </button>
          )}
        </div>
      )}

      {/* Project Grid */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <span
                    className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-wider ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-6">
                  <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    {project.type}
                  </p>
                  <h3 className="text-white font-black text-xl tracking-tight">
                    {project.name}
                  </h3>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-[10px] text-[#548064] font-bold uppercase tracking-widest mb-1">
                      Client
                    </p>
                    <p className="font-bold text-[#06361f]">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#548064] font-bold uppercase tracking-widest mb-1">
                      Budget
                    </p>
                    <p className="font-black text-[#006a28]">{project.budget}</p>
                  </div>
                </div>

                {project.location && (
                  <p className="text-xs text-[#548064] font-medium mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      location_on
                    </span>
                    {project.location}
                  </p>
                )}

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black text-[#39644a] uppercase tracking-wider">
                      Completion
                    </span>
                    <span className="text-xl font-black text-[#006a28]">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#f0fff4] rounded-full overflow-hidden p-0.5 border border-[#006a28]/5">
                    <div
                      className="h-full bg-gradient-to-r from-[#00b042] to-[#006a28] rounded-full shadow-[0_0_8px_rgba(0,106,40,0.3)] transition-all duration-1000 ease-out"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex-1 bg-[#006a28] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#005a22] transition-colors shadow-lg shadow-[#006a28]/20 active:scale-95"
                  >
                    View Full Site
                  </button>
                  <button
                    type="button"
                    className="w-14 h-14 bg-[#f0fff4] text-[#006a28] rounded-2xl flex items-center justify-center hover:bg-[#c7fdd8] transition-colors border border-[#006a28]/10 active:scale-95"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-[#006a28]/10">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-black text-[#06361f]">
                  Start New Project
                </h3>
                <p className="text-sm text-[#548064] font-medium mt-1">
                  Tell us about your construction plan
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setForm(EMPTY_FORM);
                  setError("");
                }}
                className="w-10 h-10 rounded-xl bg-[#f0fff4] text-[#006a28] flex items-center justify-center hover:bg-[#c7fdd8] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-8 space-y-5">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-[#39644a] uppercase tracking-wider mb-2">
                  Project Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. Banani Villa"
                  className="w-full bg-[#f0fff4] border border-[#006a28]/10 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#006a28]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#39644a] uppercase tracking-wider mb-2">
                  Project Type *
                </label>
                <select
                  name="project_type"
                  value={form.project_type}
                  onChange={handleFormChange}
                  className="w-full bg-[#f0fff4] border border-[#006a28]/10 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#006a28]/30"
                >
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#39644a] uppercase tracking-wider mb-2">
                  Location
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleFormChange}
                  placeholder="e.g. Banani, Dhaka"
                  className="w-full bg-[#f0fff4] border border-[#006a28]/10 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#006a28]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#39644a] uppercase tracking-wider mb-2">
                  Estimated Budget (BDT)
                </label>
                <input
                  name="budget"
                  type="number"
                  min="0"
                  step="1000"
                  value={form.budget}
                  onChange={handleFormChange}
                  placeholder="e.g. 15000000"
                  className="w-full bg-[#f0fff4] border border-[#006a28]/10 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#006a28]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#39644a] uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Brief scope, size, or requirements..."
                  className="w-full bg-[#f0fff4] border border-[#006a28]/10 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#006a28]/30 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setForm(EMPTY_FORM);
                    setError("");
                  }}
                  className="flex-1 py-4 rounded-2xl font-black text-sm text-[#39644a] bg-[#f0fff4] hover:bg-[#c7fdd8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#006a28] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#005a22] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">
                        progress_activity
                      </span>
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
