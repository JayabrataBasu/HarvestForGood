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
  const displayCitationCount = () => {
    // Ensure citation count is a valid number
    const count = paper.citationCount;
    if (count === undefined || count === null || isNaN(Number(count))) {
      return "0";
    }
    return count.toString();
  };

  // Determine citation trend icon and color
  const getCitationTrendIcon = () => {
    switch (paper.citationTrend) {
      case "increasing":
        return (
          <span className="inline-flex items-center text-emerald-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            Rising
          </span>
        );
      case "decreasing":
        return (
          <span className="inline-flex items-center text-rose-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
              />
            </svg>
            Declining
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-amber-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14"
              />
            </svg>
            Steady
          </span>
        );
    }
  };

  return (
    <div className="paper-section">
      {/* Paper header */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8 animate-fade-up">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">
            {paper.title}
          </h1>
          {formatMethodologyType(paper.methodologyType) && (
            <div className="text-md text-indigo-600 uppercase tracking-wider font-medium mb-2 inline-block bg-indigo-50 px-4 py-1 rounded-full">
              {formatMethodologyType(paper.methodologyType)} | RESEARCH PAPER
            </div>
          )}
          {!formatMethodologyType(paper.methodologyType) && (
            <div className="text-md text-indigo-600 uppercase tracking-wider font-medium mb-2 inline-block bg-indigo-50 px-4 py-1 rounded-full">
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
                  ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
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
      {/* Author info */}
      <div className="rounded-2xl overflow-hidden mb-10 shadow-lg">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
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
                    {/* Use the updated formatDate function or direct field access */}
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

      {/* Abstract */}
      <div className="mb-10">
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
        <div className="bg-white shadow-lg rounded-2xl p-8 card-hover-effect border border-blue-100">
          <p className="text-gray-700 leading-relaxed">{paper.abstract}</p>
        </div>
      </div>

      {/* Keywords */}
      {paper.keywords && paper.keywords.length > 0 && (
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-10 card-hover-effect border border-blue-100">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-indigo-500"
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
                className={`bg-gradient-to-r from-teal-50 to-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow hover:-translate-y-1 border border-emerald-100 ${
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

      {/* Publisher Link Section - replaces citation info */}
      {paper.downloadUrl && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg p-6 mb-10 text-center">
          <p className="text-white text-lg mb-4">
            Access the full research paper
          </p>
          <a
            href={paper.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-base font-medium bg-white text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors shadow-md hover:shadow-lg pulse-border"
          >
            <div className="flex items-center">
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
              View Full Paper
            </div>
          </a>
        </div>
      )}
    </div>
  );
};

export default PaperDetail;
