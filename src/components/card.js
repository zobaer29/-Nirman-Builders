"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Card() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const projects = [1, 2, 3, 4, 5, 6];

  const slideSize = 3; // per slide
  const slides = [];

  for (let i = 0; i < projects.length; i += slideSize) {
    slides.push(projects.slice(i, i + slideSize));
  }

  // auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

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

      {/* Slider */}
      <div className="w-full max-w-6xl overflow-hidden">
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
                  key={item}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden h-64">
                    <img
                      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                      alt="Projects"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-bold px-4 py-2 bg-emerald-500 rounded-full">
                        View Details
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                        In Progress
                      </span>
                      <span className="text-xs text-gray-500">
                        Completion: 75%
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 mb-2">
                      Luxury Apartment Complex {item}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      A modern construction project showcasing durability and
                      sophisticated design.
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors duration-300">
                        Learn More
                      </button>
                      <span className="text-sm text-gray-500">
                        📍 Dhaka, Bangladesh
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all ${
              currentSlide === index
                ? "w-6 bg-blue-600"
                : "w-2.5 bg-gray-400"
            }`}
          />
        ))}
      </div>

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