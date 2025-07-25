import React, { useState, useEffect } from "react";
import {
  ResearchPaper,
  PaperFilterOptions,
  Keyword,
  MethodologyType,
} from "../../types/paper.types";
import PaperCard from "./PaperCard";

interface PaperGridProps {
  papers: ResearchPaper[];
  availableKeywords: Keyword[];
  isLoading?: boolean;
  pageSize?: number;
  savedPaperIds?: string[];
  onSavePaper?: (paperId: string, isSaving: boolean) => void;
}

export const PaperGrid: React.FC<PaperGridProps> = ({
  papers,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  availableKeywords,
  isLoading = false,
  pageSize = 12,
  savedPaperIds = [],
  onSavePaper = () => {},
}) => {
  const [filteredPapers, setFilteredPapers] = useState(papers);
  const [filters, setFilters] = useState<PaperFilterOptions>({
    dateRange: { startDate: null, endDate: null },
    methodologyTypes: [],
    keywords: [],
    minCitations: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isGridView, setIsGridView] = useState(true);

  // Apply filters when they change or when papers change
  useEffect(() => {
    if (isLoading) return;

    const filtered = papers.filter((paper) => {
      // Date range filter
      if (
        filters.dateRange.startDate &&
        paper.publicationDate &&
        new Date(paper.publicationDate) < filters.dateRange.startDate
      ) {
        return false;
      }

      if (
        filters.dateRange.endDate &&
        paper.publicationDate &&
        new Date(paper.publicationDate) > filters.dateRange.endDate
      ) {
        return false;
      }

      // Methodology filter
      if (
        filters.methodologyTypes.length > 0 &&
        !filters.methodologyTypes.includes(
          paper.methodologyType as MethodologyType
        )
      ) {
        return false;
      }

      // Citation count filter
      if (paper.citationCount < filters.minCitations) {
        return false;
      }

      // Keywords filter
      if (filters.keywords.length > 0) {
        const paperKeywordNames = paper.keywords.map((k) => k.name);
        // Check if any of the paper's keywords match any of the filter keywords
        const hasMatchingKeyword = filters.keywords.some((keyword) =>
          paperKeywordNames.includes(keyword)
        );
        if (!hasMatchingKeyword) return false;
      }

      return true;
    });

    setFilteredPapers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, papers, isLoading]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFilterChange = (newFilters: PaperFilterOptions) => {
    setFilters(newFilters);
  };

  // Handle keyword click from PaperCard
  const handleKeywordClick = (keyword: Keyword) => {
    setFilters((prev) => {
      // If keyword is already in filters, don't add it again
      if (prev.keywords.includes(keyword.name)) return prev;
      return {
        ...prev,
        keywords: [...prev.keywords, keyword.name],
      };
    });
  };

  // Calculate pagination values
  const totalPapers = filteredPapers.length;
  const totalPages = Math.ceil(totalPapers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalPapers);
  const currentPagePapers = filteredPapers.slice(startIndex, endIndex);

  // Toggle between grid and list views
  const toggleViewMode = () => {
    setIsGridView((prev) => !prev);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Results header */}
      <div className="flex justify-between items-center p-4 border-b">
        {isLoading ? (
          <div>Loading papers...</div>
        ) : (
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{endIndex} of {totalPapers} papers
          </div>
        )}

        {/* View toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">View:</span>
          <button
            onClick={toggleViewMode}
            className={`p-1.5 rounded ${
              isGridView
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
            title="Grid view"
          >
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
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            onClick={toggleViewMode}
            className={`p-1.5 rounded ${
              !isGridView
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
            title="List view"
          >
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading research papers...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredPapers.length === 0 && (
        <div className="text-center py-12 px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No papers found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your filters to find more research papers.
          </p>
          <button
            onClick={() =>
              setFilters({
                dateRange: { startDate: null, endDate: null },
                methodologyTypes: [],
                keywords: [],
                minCitations: 0,
              })
            }
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Papers grid/list */}
      {!isLoading && filteredPapers.length > 0 && (
        <div
          className={
            isGridView
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
              : "divide-y"
          }
        >
          {currentPagePapers.map((paper) => (
            <div key={paper.id} className={isGridView ? "" : "p-4"}>
              <PaperCard
                paper={paper}
                onSave={(paperId) =>
                  onSavePaper(paperId, !savedPaperIds.includes(paperId))
                }
                isSaved={savedPaperIds.includes(paper.id)}
                onKeywordClick={handleKeywordClick}
                isListView={!isGridView}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{endIndex}</span> of{" "}
                <span className="font-medium">{totalPapers}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Show page numbers with ellipsis if needed */}
                {Array.from({ length: totalPages })
                  .slice(0, Math.min(5, totalPages))
                  .map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === idx + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
