"use client";
import React, { Suspense } from "react";
import PaperSearch from "@/components/research/PaperSearch";
import { useSearchParams } from "next/navigation";

// Inner client component for Suspense boundary
function PaperSearchWithKeyword() {
  const searchParams = useSearchParams();
  const keyword = searchParams?.get("keyword") || "";
  return <PaperSearch initialKeyword={keyword} />;
}

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
          {/* Enhanced header section with farm-themed title card */}
          <div className="text-center mb-12 lg:mb-16">
            {/* Enhanced badge with soft gradient */}
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 mb-8 animate-pulse shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-lime-50/95 to-spring-100/95 backdrop-blur-sm rounded-full px-6 py-2 shadow-inner">
                <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider drop-shadow-sm">
                  🌾 Sustainable Agriculture Research
                </span>
              </div>
            </div>

            {/* Enhanced title card with farm gradient */}
            <div className="relative mx-auto max-w-4xl mb-8 group">
              {/* Soft farm gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-corn-50/80 via-wheat-100/75 to-vanilla-50/80 rounded-3xl shadow-2xl"></div>

              {/* Subtle border and inner shadow */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-wheat-200/60 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.03)]"></div>

              {/* Content with enhanced typography */}
              <div className="relative p-8 lg:p-12 rounded-3xl backdrop-blur-sm group-hover:scale-[1.02] transition-transform duration-500">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-green-700 bg-clip-text text-transparent drop-shadow-sm">
                    Research Papers
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium">
                  Explore our comprehensive collection of research papers on
                  <span className="text-emerald-700 font-semibold">
                    {" "}
                    sustainable agriculture
                  </span>{" "}
                  and
                  <span className="text-teal-700 font-semibold">
                    {" "}
                    innovative food systems
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced paper search with farm-themed gradient and improved contrast */}
          <div className="relative">
            {/* Card background with farm-themed gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-sage-50/90 via-yellow-50/90 to-sky-50/90 rounded-3xl"></div>

            {/* Border glow effect */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/40 shadow-2xl"></div>
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]"></div>

            {/* Content container */}
            <div className="relative backdrop-blur-lg rounded-3xl border border-white/30 p-8 lg:p-12">
              <Suspense fallback={<div>Loading search...</div>}>
                <PaperSearchWithKeyword />
              </Suspense>
            </div>
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

      {/* Enhanced styles for farm color palette */}
      <style jsx global>{`
        /* Farm-themed gradient color utilities */
        .from-lime-50\/95 {
          --tw-gradient-from: rgb(247 254 231 / 0.95);
        }
        .to-spring-100\/95 {
          --tw-gradient-to: rgb(220 252 231 / 0.95);
        }
        .from-corn-50\/80 {
          --tw-gradient-from: rgb(254 252 232 / 0.8);
        }
        .via-wheat-100\/75 {
          --tw-gradient-to: rgb(254 249 195 / 0.75);
        }
        .to-vanilla-50\/80 {
          --tw-gradient-to: rgb(254 252 232 / 0.8);
        }
        .ring-wheat-200\/60 {
          --tw-ring-color: rgb(254 240 138 / 0.6);
        }
      `}</style>
    </div>
  );
}
