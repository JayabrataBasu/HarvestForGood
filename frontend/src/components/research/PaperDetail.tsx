"use client";
import React from "react";
import { ResearchPaper, Keyword } from "../../types/paper.types";

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

  // Safely display citation count

  return (
    <div className="paper-section">
      {/* Enhanced styles for warm farm gradients and animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-in forwards;
        }

        .animate-delay-100 {
          animation-delay: 0.1s;
        }

        .animate-delay-200 {
          animation-delay: 0.2s;
        }

        .animate-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>

      {/* Overall content wrapper with unified farm theme */}
      <div className="bg-gradient-to-br from-[#FDF6E3] to-[#E7F3C6] rounded-2xl p-8 shadow-md">
        {/* Enhanced Title Card with parchment-like gradient */}
        <div className="bg-gradient-to-tr from-[#F4F1DE] to-[#EAE7C6] rounded-3xl shadow-lg p-6 mb-8 border border-[#D9CBA3] animate-fade-in-up hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] relative overflow-hidden">
          {/* Decorative wheat stem SVG */}
          <div className="absolute top-4 right-4 opacity-10">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#8B7355]"
            >
              <path d="M12 2L8 8h8l-4-6z M8 8v2h8V8H8z M8 10v2h8v-2H8z M8 12v2h8v-2H8z M8 14v2h8v-2H8z M8 16v2h8v-2H8z M10 18v4h4v-4h-4z" />
            </svg>
          </div>

          <div className="text-center mb-4 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#2F3E46] leading-tight">
              {paper.title}
            </h1>
            {formatMethodologyType(paper.methodologyType) && (
              <div className="text-md text-[#3F6212] uppercase tracking-wider font-medium mb-2 inline-block bg-[#DDEAC1]/80 px-4 py-1 rounded-full shadow-sm border border-[#C7D2A1]">
                {formatMethodologyType(paper.methodologyType)} | RESEARCH PAPER
              </div>
            )}
            {!formatMethodologyType(paper.methodologyType) && (
              <div className="text-md text-[#3F6212] uppercase tracking-wider font-medium mb-2 inline-block bg-[#DDEAC1]/80 px-4 py-1 rounded-full shadow-sm border border-[#C7D2A1]">
                RESEARCH PAPER
              </div>
            )}
          </div>

          {/* Save button (if function provided) */}
          {onSave && (
            <div className="flex justify-center relative z-10">
              <button
                onClick={() => onSave(paper.id)}
                className={`mt-4 inline-flex items-center px-6 py-3 rounded-full shadow-sm text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  isSaved
                    ? "bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white border border-[#F59E0B] hover:from-[#D97706] hover:to-[#B45309] shadow-md"
                    : "bg-gradient-to-r from-white to-[#F9FAFB] text-[#2F3E46] border border-[#D9CBA3] hover:from-[#F9FAFB] hover:to-[#F3F4F6] shadow-md"
                }`}
              >
                {isSaved ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5"
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
                      className="h-4 w-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 002-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    Save to Library
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Author info - keeping green gradient completely unchanged */}
        <div className="rounded-2xl overflow-hidden mb-10 shadow-md animate-fade-in-up animate-delay-100 hover:shadow-lg transition-all duration-300">
          <div className="bg-gradient-to-br from-[#FDF6ED] to-[#FFF4D2] p-2 rounded-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-4 px-4 text-left uppercase tracking-wider font-medium">
                      Author
                    </th>
                    <th className="py-4 px-4 text-left uppercase tracking-wider font-medium">
                      Source
                    </th>
                    <th className="py-4 px-4 text-left uppercase tracking-wider font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 px-4 font-medium">
                      {displayAuthors()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
                        {paper.journal || "Not specified"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
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
        </div>

        {/* Enhanced Abstract with warm gradient and entrance animation */}
        <div className="mb-10 animate-fade-in-up animate-delay-200">
          <h2 className="text-xl font-semibold text-[#3F6212] underline underline-offset-4 mb-4 flex items-center">
            <span className="mr-2 text-2xl">📄</span>
            Abstract
          </h2>
          <div className="bg-gradient-to-br from-[#FFF8E1] to-[#FFEFD4] shadow-md rounded-2xl p-6 mt-6 border border-orange-100/40 hover:shadow-lg transition-all duration-500 ease-in animate-fade-in transform hover:scale-[1.01] relative overflow-hidden">
            {/* Decorative seedling SVG */}
            <div className="absolute bottom-4 left-4 opacity-10">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-[#8B7355]"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <p className="text-[#2F3E46] leading-relaxed font-medium relative z-10">
              {paper.abstract}
            </p>
          </div>
        </div>

        {/* Enhanced Keywords with farm-themed styling */}
        {paper.keywords && paper.keywords.length > 0 && (
          <div className="bg-gradient-to-r from-[#FFF8E1] to-[#FFF0CC] shadow-md rounded-2xl p-6 mb-10 border border-green-100/40 animate-fade-in-up animate-delay-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
            <div className="flex items-center mb-4">
              <span className="mr-2 text-xl">🏷️</span>
              <h3 className="text-xl font-semibold text-[#3F6212] underline underline-offset-4">
                Keywords
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((keyword: Keyword, index: number) => (
                <span
                  key={keyword.id}
                  className={`bg-[#DDEAC1] text-[#355E3B] px-3 py-1 rounded-full text-sm font-medium shadow-sm mr-2 transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-[#C7D2A1] hover:bg-[#D1E7B8] ${
                    onKeywordClick ? "cursor-pointer hover:scale-105" : ""
                  }`}
                  onClick={() => onKeywordClick && onKeywordClick(keyword)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {keyword.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Publisher Link Section with warm gradient */}
        {paper.download_url && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-md p-6 mb-10 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
            <div className="flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <h3 className="text-white text-xl font-bold">
                Link to Publisher
              </h3>
            </div>
            <p className="text-white/90 text-base mb-4">
              Access the original publication from the publisher
            </p>
            <a
              href={paper.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 text-base font-medium bg-white text-emerald-600 rounded-full hover:bg-emerald-50 transition-colors shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-center">
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Visit Publisher
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperDetail;
