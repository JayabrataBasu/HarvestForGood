"use client";

import React, { useState, useEffect } from "react";
import { PaperGrid } from "../components/research/PaperGrid";
import { Paper, Keyword } from "../types/paper.types";
import { researchAPI } from "../lib/api";

export const ResearchPapersPage: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedPaperIds, setSavedPaperIds] = useState<string[]>([]);

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
        // Fetch papers from your Django API
        const papersResponse = await researchAPI.fetchPapers();
        if (!papersResponse.success) {
          throw new Error(papersResponse.message || "Failed to fetch papers");
        }

        // Fetch keywords from your Django API
        const keywordsResponse = await researchAPI.fetchKeywords();
        if (!keywordsResponse.success) {
          throw new Error(
            keywordsResponse.message || "Failed to fetch keywords"
          );
        }

        setPapers(papersResponse.data.results || papersResponse.data || []);
        setKeywords(
          keywordsResponse.data.results || keywordsResponse.data || []
        );
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load research papers. Please try again later.";
        setError(errorMessage);
        console.error("Error fetching research data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <PaperGrid
          papers={papers}
          availableKeywords={keywords}
          savedPaperIds={savedPaperIds}
          onSavePaper={handleSavePaper}
        />
      )}
    </div>
  );
};
