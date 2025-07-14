"use client";
import React from "react";
import PaperSearch from "@/components/research/PaperSearch";

export default function ResearchPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Multi-color farm-to-sunset gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-300 via-yellow-200 via-orange-200 via-amber-200 via-yellow-100 via-orange-50 to-sky-50 opacity-90"></div>

      {/* Animated overlay pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 px-4 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced header section */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 mb-6 animate-pulse">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-2">
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
                  🌾 Sustainable Agriculture Research
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                Research Papers
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
              Explore our comprehensive collection of research papers on
              <span className="text-emerald-600 font-semibold">
                {" "}
                sustainable agriculture
              </span>{" "}
              and
              <span className="text-teal-600 font-semibold">
                {" "}
                innovative food systems
              </span>
            </p>
          </div>

          {/* Enhanced paper search with glassmorphism */}
          <div className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-12">
            <PaperSearch />
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-20 animate-bounce"></div>
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full opacity-20 animate-bounce"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-32 left-20 w-12 h-12 bg-gradient-to-r from-blue-300 to-sky-300 rounded-full opacity-20 animate-bounce"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
}
