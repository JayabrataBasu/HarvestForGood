"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import PaperCard from "../research/PaperCard";
import { ResearchPaper, Keyword } from "../../types/paper.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export function HomeResearchSection() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedPapers, setSavedPapers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchLatestPapers();
    loadSavedPapers();
  }, []);

  const fetchLatestPapers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the latest 6 papers, ordered by publication year (newest first)
      const response = await fetch(
        `${API_BASE_URL}/research/papers/?ordering=-publication_year&limit=6`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle both paginated and non-paginated responses
      const papersData = data.results || data;

      // Transform the data to match our frontend types
      const transformedPapers = papersData.map((paper: any) => ({
        id: paper.id,
        title: paper.title,
        abstract: paper.abstract,
        authors: paper.authors || [],
        journal: paper.journal || "Unknown Journal",
        publication_year: paper.publication_year,
        publication_date: paper.publication_date,
        publicationYear: paper.publication_year,
        publicationDate: paper.publication_date,
        keywords: paper.keywords || [],
        citationCount: paper.citation_count || 0,
        citationTrend: paper.citation_trend || "stable",
        methodologyType: paper.methodology_type || "Unknown",
        downloadUrl: paper.download_url || "#",
        created_at: paper.created_at,
        updated_at: paper.updated_at,
        slug: paper.slug,
      }));

      setPapers(transformedPapers);
    } catch (err) {
      console.error("Error fetching papers:", err);
      setError(
        "Failed to load research papers. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSavedPapers = () => {
    try {
      const saved = localStorage.getItem("savedPapers");
      if (saved) {
        setSavedPapers(new Set(JSON.parse(saved)));
      }
    } catch (err) {
      console.error("Error loading saved papers:", err);
    }
  };

  const handleSavePaper = (paperId: string) => {
    const newSavedPapers = new Set(savedPapers);

    if (savedPapers.has(paperId)) {
      newSavedPapers.delete(paperId);
    } else {
      newSavedPapers.add(paperId);
    }

    setSavedPapers(newSavedPapers);
    localStorage.setItem("savedPapers", JSON.stringify([...newSavedPapers]));
  };

  const handleKeywordClick = (keyword: Keyword) => {
    // Navigate to research page with keyword filter
    window.location.href = `/research?keyword=${encodeURIComponent(
      keyword.name
    )}`;
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-600 text-lg">
          Loading latest research papers...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <svg
            className="h-12 w-12 text-red-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Papers
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchLatestPapers}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <svg
            className="h-12 w-12 text-gray-400 mx-auto mb-4"
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Papers Available
          </h3>
          <p className="text-gray-600 mb-4">
            No research papers have been published yet.
          </p>
          <Link
            href="/contact"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors inline-block"
          >
            Contribute Research
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
          Latest Research Papers
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore the newest research in sustainable agriculture and discover
          insights that are shaping the future of farming in the Global South.
        </p>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {papers.map((paper) => (
          <PaperCard
            key={paper.id}
            paper={paper}
            onSave={handleSavePaper}
            isSaved={savedPapers.has(paper.id)}
            onKeywordClick={handleKeywordClick}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <Link
          href="/research"
          className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <span>View All Research Papers</span>
          <svg
            className="ml-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
