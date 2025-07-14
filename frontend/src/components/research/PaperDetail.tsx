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

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
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

      {/* Paper header */}
      <div className="bg-gradient-to-br from-[#FDF6ED] to-[#FFF4D2] rounded-2xl shadow-md border border-orange-100/60 p-8 mb-8 animate-fade-in-up hover:shadow-lg transition-all duration-300">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
            {paper.title}
          </h1>
          {formatMethodologyType(paper.methodologyType) && (
            <div className="text-md text-indigo-700 uppercase tracking-wider font-medium mb-2 inline-block bg-indigo-100/80 px-4 py-1 rounded-full shadow-sm">
              {formatMethodologyType(paper.methodologyType)} | RESEARCH PAPER
            </div>
          )}
          {!formatMethodologyType(paper.methodologyType) && (
            <div className="text-md text-indigo-700 uppercase tracking-wider font-medium mb-2 inline-block bg-indigo-100/80 px-4 py-1 rounded-full shadow-sm">
              RESEARCH PAPER
            </div>
          )}
        </div>
        {/* Save button (if function provided) */}
        {onSave && (
          <div className="flex justify-center">
            <button
              onClick={() => onSave(paper.id)}
              className={`mt-4 inline-flex items-center px-4 py-2 rounded-full shadow-sm text-sm font-medium transition-all ${
                isSaved
                  ? "bg-amber-100/90 text-amber-800 border border-amber-200 hover:bg-amber-200/90"
                  : "bg-white/90 text-gray-800 border border-gray-200 hover:bg-gray-50/90"
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

      {/* Enhanced Author info with warm linen gradient */}
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
                  <td className="py-4 px-4 font-medium">{displayAuthors()}</td>
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

      {/* Enhanced Abstract with cream to apricot mist gradient */}
      <div className="mb-10 animate-fade-in-up animate-delay-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-blue-500"
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
          Abstract
        </h2>
        <div className="bg-gradient-to-br from-[#FFF8E1] to-[#FFEFD4] shadow-md rounded-2xl p-8 border border-orange-100/40 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
          <p className="text-gray-800 leading-relaxed font-medium">
            {paper.abstract}
          </p>
        </div>
      </div>

      {/* Enhanced Keywords with soft herb gradient */}
      {paper.keywords && paper.keywords.length > 0 && (
        <div className="bg-gradient-to-br from-[#EBF7E3] to-[#F3FBF2] shadow-md rounded-2xl p-6 mb-10 border border-green-100/40 animate-fade-in-up animate-delay-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-emerald-600"
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
            <h3 className="font-bold text-gray-800">Keywords</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {paper.keywords.map((keyword: Keyword) => (
              <span
                key={keyword.id}
                className={`bg-gradient-to-r from-emerald-100/90 to-teal-100/90 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow-md hover:-translate-y-1 border border-emerald-200/60 ${
                  onKeywordClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onKeywordClick && onKeywordClick(keyword)}
              >
                {keyword.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Publisher Link Section with warm gradient */}
      {paper.download_url && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-md p-6 mb-10 text-center hover:shadow-lg transition-all duration-300">
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
            <h3 className="text-white text-xl font-bold">Link to Publisher</h3>
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
  );
};

export default PaperDetail;
