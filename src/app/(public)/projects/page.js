"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.projects) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Featured projects: first 2 projects from the list (or those marked featured, or most recent)
  const featuredProjects = projects.slice(0, 2);

  // Filter projects logic
  const filteredProjects = projects.filter((project) => {
    const typeMatch = filterType === "All" || project.type === filterType;
    const statusMatch = filterStatus === "All" || project.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const projectTypes = ["All", "Residential", "Commercial", "Industrial", "Infrastructure", "Renovation"];
  const projectStatuses = ["All", "Ongoing", "Completed", "Pending"];

  return (
    <div className="bg-slate-50 text-slate-900 w-full min-h-screen pb-12">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Our Construction Projects
          </h1>
          <p className="max-w-3xl mx-auto text-slate-200 text-base md:text-lg">
            Explore residential, commercial, and industrial projects delivered
            by Nirman Builders with quality, transparency, and timely execution.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-500 font-medium">Loading projects from backend...</p>
        </div>
      ) : (
        <>
          {/* Featured Projects Section */}
          {featuredProjects.length > 0 && (
            <section id="featured" className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Featured Projects</h2>
                <Link href="#all-projects" className="text-blue-600 font-semibold hover:underline">
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {featuredProjects.map((project) => (
                  <article key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-gray-100">
                    <div>
                      <div className="relative h-64 bg-gray-100 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070&auto=format&fit=crop";
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-blue-600 font-semibold">{project.type}</p>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            project.status === "Completed"
                              ? "bg-blue-100 text-blue-700"
                              : project.status === "Ongoing"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-slate-800">{project.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                          {project.description || "A modern construction project showcasing durability and sophisticated design."}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>📍 {project.location || "Dhaka, Bangladesh"}</span>
                      <span>Budget: {project.budget}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Filter and All Projects Section */}
          <section id="all-projects" className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-200 pb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">All Projects</h2>
              
              <div className="flex flex-wrap gap-4 items-center">
                {/* Type Filter */}
                <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl">
                  {projectTypes.slice(0, 4).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        filterType === type
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                  {/* Select dropdown if too many options */}
                  {projectTypes.length > 4 && (
                    <select
                      value={projectTypes.includes(filterType) && projectTypes.indexOf(filterType) >= 4 ? filterType : "More"}
                      onChange={(e) => {
                        if (e.target.value !== "More") setFilterType(e.target.value);
                      }}
                      className="px-2 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-transparent border-none focus:outline-none"
                    >
                      <option value="More" disabled>Others</option>
                      {projectTypes.slice(4).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Status Filter */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {projectStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                        filterStatus === status
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <span className="text-5xl mb-4 block">🔍</span>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Match Found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters or category selections.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col justify-between hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{project.name}</h3>
                        <span className="text-xs text-blue-600 font-semibold px-2 py-1 bg-blue-50 rounded-full">
                          {project.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {project.description || "A modern construction project showcasing durability and sophisticated design."}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          project.status === "Completed"
                            ? "bg-blue-100 text-blue-700"
                            : project.status === "Ongoing"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {project.progress}% Done
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        📍 {project.location || "Dhaka, Bangladesh"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* CTA section */}
      <section id="contact-cta" className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Have a project in mind?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Let us discuss your ideas and turn them into a reliable, modern, and
            cost-effective construction solution.
          </p>
          <Link
            href="/#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Contact Nirman Builders
          </Link>
        </div>
      </section>
    </div>
  );
}

