"use client";
import React, { useState, useEffect } from "react";
import { researchAPI } from "@/lib/api";
import {
  PaginatedResponse,
  ResearchPaper,
  PaperFilterParams,
} from "@/types/paper.types";
import Link from "next/link";
import DynamicFilterPanel from "./DynamicFilterPanel";

interface PaperSearchProps {
  initialFilters?: PaperFilterParams;
}

export default function PaperSearch({ initialFilters = {} }: PaperSearchProps) {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaperFilterParams>(initialFilters);
  const [searchTerm, setSearchTerm] = useState(initialFilters.q || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // New state for filter options
  const [filterOptions, setFilterOptions] = useState(null);
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);

  // Load filter options once when component mounts
  useEffect(() => {
    const loadFilterOptions = async () => {
      setFilterOptionsLoading(true);
      try {
        const result = await researchAPI.fetchFilterOptions();
        if (result.success) {
          setFilterOptions(result.data);
        } else {
          console.error("Failed to load filter options:", result.message);
        }
      } catch (error) {
        console.error("Error loading filter options:", error);
      } finally {
        setFilterOptionsLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Load papers when filters or page changes
  useEffect(() => {
    async function loadPapers() {
      setLoading(true);
      setError(null);

      try {
        const result = await researchAPI.fetchPapers(filters, page);

        if (result.success) {
          const responseData = result.data as PaginatedResponse<ResearchPaper>;

          // Remove potential duplicates based on paper ID
          const uniquePapers = responseData.results.filter(
            (paper, index, self) =>
              index === self.findIndex((p) => p.id === paper.id)
          );

          setPapers(uniquePapers);
          setTotalCount(responseData.count);

          // Calculate total pages (assuming default pageSize of 10)
          const pageSize = 10;
          setTotalPages(Math.ceil(responseData.count / pageSize));
        } else {
          setError(result.message || "Failed to load papers");
        }
      } catch (err) {
        setError("An error occurred while fetching the papers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPapers();
  }, [filters, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, q: searchTerm });
    setPage(1);
  };

  const handleFilterApply = (newFilters: unknown) => {
    // Convert the filter UI state to API parameters
    setFilters(newFilters as PaperFilterParams);
    setPage(1);
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
    }).format(date);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filter Panel - Left Side */}
      <div className="lg:col-span-1">
        {filterOptionsLoading ? (
          <div className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : filterOptions ? (
          <DynamicFilterPanel
            filterOptions={filterOptions}
            onFilterApply={handleFilterApply}
            currentFilters={{
              ...filters,
              keyword: Array.isArray(filters.keyword)
                ? filters.keyword
                : filters.keyword
                ? [filters.keyword]
                : undefined,
            }}
          />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-red-600">Failed to load filter options</p>
          </div>
        )}
      </div>

      {/* Main Content - Right Side */}
      <div className="lg:col-span-3 space-y-6">
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            placeholder="Search for papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Search
          </button>
        </form>

        {/* Results info */}
        <div className="text-gray-500">
          {loading
            ? "Loading results..."
            : `Showing ${papers.length} of ${totalCount} results`}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Results list */}
        {!loading && papers.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-500">
              No papers found matching your criteria.
            </p>
            <p className="mt-2 text-gray-400">
              Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {papers.map((paper, index) => (
              <div
                key={`${paper.id}-${index}`}
                className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <Link href={`/research/papers/${paper.slug || paper.id}`}>
                  <h3 className="text-xl font-bold text-primary-dark mb-2 hover:text-primary">
                    {paper.title}
                  </h3>
                </Link>

                <div className="flex flex-wrap text-sm text-gray-500 mb-3 gap-x-4">
                  <span>{paper.authors.map((a) => a.name).join(", ")}</span>
                  <span>•</span>
                  <span>{paper.journal}</span>
                  <span>•</span>
                  <span>
                    {paper.publicationDate
                      ? formatDate(new Date(paper.publicationDate))
                      : "N/A"}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {paper.abstract}
                </p>

                <div className="flex flex-wrap gap-2">
                  {paper.keywords.map((keyword) => (
                    <span
                      key={keyword.id}
                      className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full cursor-pointer hover:bg-green-100"
                    >
                      {keyword.name}
                    </span>
                  ))}

                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                    {paper.methodologyType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = page;
                if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                if (pageNum <= 0 || pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => changePage(pageNum)}
                    className={`px-4 py-2 border border-gray-300 ${
                      page === pageNum
                        ? "bg-primary text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
