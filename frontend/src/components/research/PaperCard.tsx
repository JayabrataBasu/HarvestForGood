"use client";
import React from "react";
import { ResearchPaper, Keyword } from "../../types/paper.types";
import { useRouter } from "next/navigation";

export interface PaperCardProps {
  paper: ResearchPaper;
  onSave: (paperId: string) => void;
  isSaved: boolean;
  onKeywordClick: (keyword: Keyword) => void;
  isListView?: boolean;
}

const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  onSave,
  isSaved,
  onKeywordClick,
  isListView,
}) => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or links inside the card
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a")
    ) {
      return;
    }

    router.push(`/research/paper/${paper.id}`);
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

  // Get methodology badge color
  const getMethodologyColor = () => {
    switch (paper.methodologyType) {
      case "quantitative":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "qualitative":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "mixed":
        return "bg-teal-100 text-teal-800 border-teal-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className={`bg-white border rounded-xl shadow-sm hover-card-rise cursor-pointer transition-all duration-300 overflow-hidden ${
        isListView ? "flex flex-col md:flex-row" : ""
      }`}
      onClick={handleCardClick}
    >
      <div className={`p-5 ${isListView ? "flex-1" : ""}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 hover:text-emerald-700 transition-colors">
            {paper.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(paper.id);
            }}
            className={`ml-2 flex-shrink-0 p-1.5 rounded-full transition-colors ${
              isSaved
                ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {isSaved ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getMethodologyColor()}`}
          >
            {paper.methodologyType.charAt(0).toUpperCase() +
              paper.methodologyType.slice(1)}
          </span>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md border border-gray-200">
            {new Date(paper.publicationDate).getFullYear()}
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-3 flex flex-wrap items-center">
          {paper.authors.map((author, index) => (
            <span key={author.id} className="mr-1">
              {author.name}
              {index < paper.authors.length - 1 ? ", " : ""}
            </span>
          ))}
          <span className="mx-1.5 text-gray-400">•</span>
          <span className="text-gray-500 italic">{paper.journal}</span>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3 text-sm">
          {paper.abstract}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {paper.keywords.map((keyword) => (
            <button
              key={keyword.id}
              onClick={(e) => {
                e.stopPropagation();
                onKeywordClick(keyword);
              }}
              className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-xs hover:bg-emerald-100 transition-colors"
            >
              {keyword.name}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              {paper.citationCount} citations
            </span>
            <span className="mx-2 text-gray-300">|</span>
            {getCitationTrendIcon()}
          </div>

          <a
            href={paper.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
          >
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            View Paper
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaperCard;
