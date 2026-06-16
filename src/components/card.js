"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Card() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.projects) {
          // Prioritize ongoing projects for the home page slider
          const ongoing = data.projects.filter((p) => p.status === "Ongoing");
          setProjects(ongoing.length > 0 ? ongoing : data.projects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const slideSize = 3; // per slide
  const slides = [];

  for (let i = 0; i < projects.length; i += slideSize) {
    slides.push(projects.slice(i, i + slideSize));
  }

  // auto slide
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="flex flex-col items-center gap-10 py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Ongoing Projects
        </h2>
        <p className="text-gray-600 max-w-2xl">
          Discover our latest construction projects across the country
        </p>
      </div>

      {/* Slider / Content */}
      <div className="w-full max-w-6xl overflow-hidden min-h-[400px] flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-500 font-medium">Loading projects...</p>
          </div>
        ) : slides.length === 0 ? (
          <div className="text-center py-16 px-8 bg-white rounded-2xl shadow-md border border-gray-100 max-w-md w-full">
            <span className="text-5xl mb-4 block">🏗️</span>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Projects Found</h3>
            <p className="text-gray-500">
              There are no ongoing projects in our database at the moment.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {slide.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative overflow-hidden h-60 bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070&auto=format&fit=crop";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Link href="/projects" className="text-white font-bold px-5 py-2.5 bg-emerald-500 rounded-full shadow-lg hover:bg-emerald-600 transition-colors">
                              View Details
                            </Link>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              item.status === 'Completed'
                                ? 'bg-blue-100 text-blue-700'
                                : item.status === 'Ongoing'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              Progress: {item.progress}%
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                item.status === 'Completed' ? 'bg-blue-600' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>

                          <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {item.name}
                          </h2>

                          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                            {item.description || "A modern construction project showcasing durability and sophisticated design."}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex items-center justify-between">
                        <Link href="/projects">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors duration-300 shadow-md shadow-blue-100 hover:shadow-lg">
                            Learn More
                          </button>
                        </Link>
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          📍 {item.location || "Dhaka, Bangladesh"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dots */}
      {!loading && slides.length > 1 && (
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-6 bg-blue-600"
                  : "w-2.5 bg-gray-400 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      )}

      {/* Button */}
      <div className="flex justify-center mt-6">
        <Link href="/projects">
          <button className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-2">
            View All Projects
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </Link>
      </div>
    </section>
  );
}