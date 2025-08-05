"use client";
import React from "react";
import { ResearchPaper, Keyword } from "@/types/paper.types";

interface PaperDetailProps {
  paper: ResearchPaper;
  onSave?: (paperId: string) => void;
  isSaved?: boolean;
  onKeywordClick?: (keyword: Keyword) => void;
}

const PaperDetail: React.FC<PaperDetailProps> = ({
  paper,
  onSave,
  isSaved = false,
  onKeywordClick,
}) => {
  // Helper to format date - safely handle various date formats or just a year
  const formatDate = (date: Date | string | number | undefined) => {
    if (!date) return "";

    // Check all possible year field names from your Django model
    // First check the main publication_year field (CharField)
    if (paper.publication_year) {
      return paper.publication_year.toString();
    }

    // Legacy field names for backwards compatibility
    if (paper.publication_date) {
      return paper.publication_date.toString();
    }

    if (paper.publicationYear) {
      return paper.publicationYear.toString();
    }

    // If it's just a year as a number
    if (typeof date === "number") {
      return date.toString();
    }

    // If it's a year as a string
    if (typeof date === "string" && /^\d{4}$/.test(date)) {
      return date;
    }

    try {
      const dateObj = new Date(date);
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return "";
      }
      return dateObj.getFullYear().toString();
    } catch (e) {
      console.error("Error formatting date:", e);
      return "";
    }
  };

  // Helper to format methodology type safely
  const formatMethodologyType = (type?: string) => {
    if (!type || type.toLowerCase() === "unknown") return "";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Safely display authors with fallback
  const displayAuthors = () => {
    if (!paper.authors || paper.authors.length === 0) {
      return "Not specified";
    }

    return paper.authors
      .map((author) => author.name)
      .filter(Boolean) // Filter out undefined or empty names
      .join(", ");
  };

  function toCapitalCase(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced farm-to-sunset gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-300 via-yellow-200 via-orange-200 via-amber-200 via-yellow-100 via-orange-50 to-sky-50"></div>

      {/* Animated overlay patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>

      {/* Custom enhanced animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes borderPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(5, 150, 105, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(5, 150, 105, 0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
          }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }

        .animate-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }

        .card-hover-effect {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover-effect:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
        }

        .pulse-border {
          animation: borderPulse 2s infinite;
        }

        .pulse-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .pulse-on-hover:hover {
          animation: borderPulse 0.5s ease-out;
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }

        /* Enhanced warm gradient animations */
        @keyframes fade-in-view {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-view {
          animation: fade-in-view 0.6s ease-out forwards;
        }

        /* Warm farm-themed gradient color utilities for inner panels */
        .from-cream-50 {
          --tw-gradient-from: rgb(255 248 225 / 1);
        }
        .via-apricot-50 {
          --tw-gradient-to: rgb(255 239 212 / 1);
        }
        .to-cream-100 {
          --tw-gradient-to: rgb(254 243 199 / 1);
        }

        .from-herb-50 {
          --tw-gradient-from: rgb(235 247 227 / 1);
        }
        .via-morning-mist {
          --tw-gradient-to: rgb(243 251 242 / 1);
        }
        .to-herb-100 {
          --tw-gradient-to: rgb(220 252 231 / 1);
        }

        .from-linen-50 {
          --tw-gradient-from: rgb(253 246 237 / 1);
        }
        .via-pastel-gold {
          --tw-gradient-to: rgb(255 244 210 / 1);
        }
        .to-linen-100 {
          --tw-gradient-to: rgb(255 248 225 / 1);
        }

        /* Comprehensive farm color utilities for title cards */
        .from-morning-50\/85 {
          --tw-gradient-from: rgb(240 249 255 / 0.85);
        }
        .via-sky-100\/80 {
          --tw-gradient-to: rgb(224 242 254 / 0.8);
        }
        .to-milk-50\/85 {
          --tw-gradient-to: rgb(250 250 250 / 0.85);
        }
        .from-corn-100\/90 {
          --tw-gradient-from: rgb(254 240 138 / 0.9);
        }
        .via-wheat-200\/85 {
          --tw-gradient-to: rgb(254 215 170 / 0.85);
        }
        .to-cream-100\/90 {
          --tw-gradient-to: rgb(255 248 220 / 0.9);
        }
        .from-blush-50\/85 {
          --tw-gradient-from: rgb(254 242 242 / 0.85);
        }
        .via-clay-100\/80 {
          --tw-gradient-to: rgb(254 226 226 / 0.8);
        }
        .to-vanilla-100\/85 {
          --tw-gradient-to: rgb(255 248 220 / 0.85);
        }
        .from-fern-50\/75 {
          --tw-gradient-from: rgb(240 253 244 / 0.75);
        }
        .via-meadow-100\/70 {
          --tw-gradient-to: rgb(220 252 231 / 0.7);
        }
        .to-frost-50\/75 {
          --tw-gradient-to: rgb(248 250 252 / 0.75);
        }
        .from-lime-50\/85 {
          --tw-gradient-from: rgb(247 254 231 / 0.85);
        }
        .via-green-100\/80 {
          --tw-gradient-to: rgb(220 252 231 / 0.8);
        }
        .to-spring-50\/85 {
          --tw-gradient-to: rgb(240 253 244 / 0.85);
        }
        .from-morning-50\/70 {
          --tw-gradient-from: rgb(240 249 255 / 0.7);
        }
        .via-sky-100\/65 {
          --tw-gradient-to: rgb(224 242 254 / 0.65);
        }
        .to-mist-50\/70 {
          --tw-gradient-to: rgb(248 250 252 / 0.7);
        }

        /* Enhanced ring utilities for borders */
        .ring-sky-200\/60 {
          --tw-ring-color: rgb(186 230 253 / 0.6);
        }
        .ring-yellow-200\/60 {
          --tw-ring-color: rgb(254 240 138 / 0.6);
        }
        .ring-emerald-200\/50 {
          --tw-ring-color: rgb(167 243 208 / 0.5);
        }
        .ring-rose-200\/50 {
          --tw-ring-color: rgb(254 205 211 / 0.5);
        }
        .ring-lime-200\/60 {
          --tw-ring-color: rgb(217 249 157 / 0.6);
        }
        .ring-sky-200\/40 {
          --tw-ring-color: rgb(186 230 253 / 0.4);
        }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Enhanced title card with morning mist gradient */}
        <div className="relative backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8 lg:p-12 mb-10 animate-fade-up card-hover-effect group">
          {/* Morning mist to sky milk gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-morning-50/85 via-sky-100/80 to-milk-50/85 rounded-3xl"></div>

          {/* Enhanced shadow and border effects */}
          <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.04)] ring-1 ring-sky-200/60 shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.6)]"></div>

          {/* Content with enhanced contrast */}
          <div className="relative group-hover:scale-[1.01] transition-transform duration-300">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 bg-clip-text text-transparent drop-shadow-sm">
                  {paper.title}
                </span>
              </h1>

              {formatMethodologyType(paper.methodologyType) && (
                <div className="inline-block text-sm text-white uppercase tracking-wider font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 pulse-glow">
                  {formatMethodologyType(paper.methodologyType)} | RESEARCH
                  PAPER
                </div>
              )}
              {!formatMethodologyType(paper.methodologyType) && (
                <div className="inline-block text-sm text-white uppercase tracking-wider font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 pulse-glow">
                  RESEARCH PAPER
                </div>
              )}
            </div>

            {/* Enhanced save button with adaptive contrast */}
            {onSave && (
              <div className="flex justify-center">
                <button
                  onClick={() => onSave(paper.id)}
                  className={`mt-6 inline-flex items-center px-8 py-4 rounded-full shadow-lg text-base font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
                    isSaved
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-400 hover:from-amber-600 hover:to-orange-600 focus:ring-amber-300 pulse-glow"
                      : "bg-gradient-to-r from-white to-sky-50 text-gray-800 border border-sky-200 hover:from-sky-50 hover:to-sky-100 hover:shadow-xl focus:ring-emerald-300"
                  }`}
                >
                  {isSaved ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                      Saved to Library
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                      Save to Library
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced author info card with corn husk gradient */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl animate-fade-up delay-100 hover-lift group">
          {/* Corn husk to wheat cream gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-corn-100/90 via-wheat-200/85 to-cream-100/90 rounded-3xl"></div>

          {/* Enhanced border and shadow */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-yellow-200/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)]"></div>

          <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white rounded-3xl group-hover:scale-[1.01] transition-transform duration-300">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-6 px-6 text-left uppercase tracking-wider font-black text-lg">
                    Author
                  </th>
                  <th className="py-6 px-6 text-left uppercase tracking-wider font-black text-lg">
                    Source
                  </th>
                  <th className="py-6 px-6 text-left uppercase tracking-wider font-black text-lg">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-6 px-6 font-bold text-lg">
                    {displayAuthors()}
                  </td>
                  <td className="py-6 px-6">
                    <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold hover:bg-white/30 transition-all duration-300">
                      {paper.journal || "Not specified"}
                    </span>
                  </td>
                  <td className="py-6 px-6">
                    <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold hover:bg-white/30 transition-all duration-300">
                      {paper.publication_year ||
                        formatDate(paper.publicationDate) ||
                        "Not specified"}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced abstract card with blush clay gradient */}
        <div className="relative backdrop-blur-lg shadow-2xl rounded-3xl p-8 lg:p-12 card-hover-effect border border-white/40 animate-fade-up delay-200 mb-12 group">
          {/* Blush clay to vanilla silk gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blush-50/85 via-clay-100/80 to-vanilla-100/85 rounded-3xl"></div>

          {/* Enhanced border and shadow effects */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-rose-200/50 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.03)]"></div>

          <div className="relative group-hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl lg:text-3xl font-black text-gray-800 mb-8 text-center flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="bg-gradient-to-r from-slate-800 to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
                Abstract
              </span>
            </h2>
            {/* Enhanced abstract inner panel with warm gradient */}
            <div className="bg-gradient-to-br from-cream-50 via-apricot-50 to-cream-100 rounded-2xl p-8 border border-orange-100/40 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] animate-fade-in-view">
              <p className="text-gray-800 leading-relaxed text-lg font-medium text-justify">
                {paper.abstract}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced publisher link card */}
        {paper.download_url && (
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 lg:p-12 mb-12 text-center animate-fade-up delay-300 hover-lift group">
            {/* Enhanced contrast overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700/15 via-indigo-700/15 to-purple-700/15 rounded-3xl"></div>

            <div className="relative group-hover:scale-[1.01] transition-transform duration-300">
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-white text-xl lg:text-2xl mb-8 font-bold">
                Access the full research paper through the publisher&apos;s
                website
              </p>
              <a
                href={paper.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 text-lg font-black bg-white text-indigo-600 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 pulse-border focus:outline-none focus:ring-4 focus:ring-white/50"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Visit Publisher
                </div>
              </a>
            </div>
          </div>
        )}

        {/* Enhanced keywords card with lime leaf gradient */}
        {paper.keywords && paper.keywords.length > 0 && (
          <div className="relative backdrop-blur-lg shadow-2xl rounded-3xl p-8 lg:p-12 mb-12 card-hover-effect border border-white/40 animate-fade-up delay-300 group">
            {/* Lime leaf to spring haze gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-lime-50/85 via-green-100/80 to-spring-50/85 rounded-3xl"></div>

            {/* Enhanced border effects */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-lime-200/60 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.03)]"></div>

            <div className="relative group-hover:scale-[1.01] transition-transform duration-300">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-black">
                  <span className="bg-gradient-to-r from-slate-800 to-emerald-800 bg-clip-text text-transparent drop-shadow-sm">
                    Keywords
                  </span>
                </h3>
              </div>
              {/* Enhanced keywords inner panel with warm herb gradient */}
              <div className="bg-gradient-to-br from-herb-50 via-morning-mist to-herb-100 rounded-2xl p-6 border border-green-100/40 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] animate-fade-in-view">
                <div className="flex flex-wrap gap-3">
                  {paper.keywords.map((keyword: Keyword, index) => (
                    <span
                      key={keyword.id}
                      className={`bg-gradient-to-r from-emerald-100/95 to-teal-100/95 text-emerald-800 px-6 py-3 rounded-full text-sm font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-emerald-200/80 hover:border-emerald-300 ring-1 ring-white/40 ${
                        onKeywordClick ? "cursor-pointer" : ""
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => onKeywordClick && onKeywordClick(keyword)}
                    >
                      {toCapitalCase(keyword.name)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced floating decorative elements with better contrast */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-200/60 to-orange-200/60 rounded-full opacity-30 float-animation ring-1 ring-yellow-300/40"></div>
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-green-200/60 to-emerald-200/60 rounded-full opacity-30 float-animation ring-1 ring-green-300/40"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-32 left-20 w-12 h-12 bg-gradient-to-r from-blue-200/60 to-sky-200/60 rounded-full opacity-30 float-animation ring-1 ring-blue-300/40"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-60 left-1/2 w-14 h-14 bg-gradient-to-r from-purple-200/60 to-pink-200/60 rounded-full opacity-30 float-animation ring-1 ring-purple-300/40"
        style={{ animationDelay: "0.5s" }}
      ></div>
    </div>
  );
};

export default PaperDetail;
