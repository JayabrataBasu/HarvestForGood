"use client";

import React, { useState, useEffect } from "react";
import PaperFilter from "../components/research/PaperFilter";
import PaperGrid from "../components/research/PaperGrid";
// Client-side filtering removed to prevent double-filtering.
// filterPapers import removed - backend handles all filtering
import { researchAPI } from "../lib/api";
import {
  Keyword,
  ResearchPaper,
  PaperFilterOptions,
} from "../types/paper.types";

export const ResearchPapersPage: React.FC = () => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedPaperIds, setSavedPaperIds] = useState<string[]>([]);
  const [searchWords] = useState<string[]>([]);
  const [filters, setFilters] = useState<PaperFilterOptions>({
    dateRange: { startDate: null, endDate: null },
    methodologyTypes: [],
    keywords: [],
    minCitations: 0,
  });

  // Load saved papers from localStorage
  useEffect(() => {
    const savedPapers = JSON.parse(localStorage.getItem("savedPapers") || "[]");
    setSavedPaperIds(savedPapers);
  }, []);

  // Handle saving/unsaving papers
  const handleSavePaper = (paperId: string, isSaving: boolean) => {
    const updatedSavedPapers = isSaving
      ? [...savedPaperIds, paperId]
      : savedPaperIds.filter((id) => id !== paperId);

    setSavedPaperIds(updatedSavedPapers);
    localStorage.setItem("savedPapers", JSON.stringify(updatedSavedPapers));
  };

  // Fetch papers and keywords from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching initial data...");

        const papersResponse = await researchAPI.fetchPapers(
          { q: searchWords, keyword: searchWords, keyword_logic: "and" }, // Changed from "or" to "and"
          1
        );
        if (!papersResponse.success) {
          throw new Error(papersResponse.message || "Failed to fetch papers");
        }

        const keywordsResponse = await researchAPI.fetchKeywords();
        if (!keywordsResponse.success) {
          throw new Error(
            keywordsResponse.message || "Failed to fetch keywords"
          );
        }

        console.log("Papers response:", papersResponse.data);
        console.log("Keywords response:", keywordsResponse.data);

        const papersData =
          papersResponse.data.results || papersResponse.data || [];
        const keywordsData =
          keywordsResponse.data.results || keywordsResponse.data || [];

        setPapers(Array.isArray(papersData) ? papersData : []);
        setKeywords(Array.isArray(keywordsData) ? keywordsData : []);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load research papers. Please try again later.";
        console.error("Error fetching research data:", err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchWords]);

  // Client-side filtering removed to prevent double-filtering.
  // Papers are displayed exactly as received from backend API
  const displayPapers = papers;

  const handleFilterChange = (newFilters: PaperFilterOptions) => {
    setFilters(newFilters);
  };

  const handleKeywordSelect = (keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      keywords: prev.keywords.includes(keyword)
        ? prev.keywords.filter((k) => k !== keyword)
        : [...prev.keywords, keyword],
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Research Papers</h1>
        <p className="mt-2 text-lg text-gray-600">
          Explore our collection of research papers on sustainable food systems
          and community agriculture
        </p>
      </header>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading research papers...</span>
        </div>
      ) : (
        <div className="flex gap-6">
          <div className="w-1/4">
            <PaperFilter
              keywordCategories={
                keywords.length > 0
                  ? [
                      {
                        id: "default",
                        name: "All Keywords",
                        keywords: keywords.map((k) => ({
                          id: k.id,
                          name: k.name,
                        })),
                      },
                    ]
                  : []
              }
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>
          <div className="w-3/4">
            <PaperGrid
              papers={displayPapers}
              availableKeywords={keywords}
              isLoading={false}
              selectedKeywords={filters.keywords}
              onKeywordSelect={handleKeywordSelect}
              savedPaperIds={savedPaperIds}
              onSavePaper={handleSavePaper}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default ResearchPapersPage;
