"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPaperBySlug } from "../../../../lib/api";
import PaperDetail from "../../../../components/research/PaperDetail";
import { ResearchPaper } from "../../../../types/paper.types";

export default function PaperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadPaper() {
      if (!params.slug) return;

      setIsLoading(true);
      try {
        // In a real app, this would call an API
        const paperData = await getPaperBySlug(params.slug as string);
        setPaper(paperData);

        // Check if paper is saved in localStorage
        const savedPapers = JSON.parse(
          localStorage.getItem("savedPapers") || "[]"
        );
        setIsSaved(savedPapers.includes(paperData.id));
      } catch (err) {
        setError("Failed to load paper details. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadPaper();
  }, [params.slug]);

  const toggleSaveStatus = () => {
    if (!paper) return;

    const savedPapers = JSON.parse(localStorage.getItem("savedPapers") || "[]");

    if (isSaved) {
      const updatedSavedPapers = savedPapers.filter(
        (id: string) => id !== paper.id
      );
      localStorage.setItem("savedPapers", JSON.stringify(updatedSavedPapers));
    } else {
      savedPapers.push(paper.id);
      localStorage.setItem("savedPapers", JSON.stringify(savedPapers));
    }

    setIsSaved(!isSaved);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse flex flex-col space-y-6">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-72 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Oops! Something went wrong.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-500">
            {error || "We couldn't find the paper you're looking for."}
          </p>
          <div className="mt-8">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Results
          </button>
        </div>

        {/* Paper Detail Component */}
        <PaperDetail
          paper={paper}
          onSave={toggleSaveStatus}
          isSaved={isSaved}
        />
      </div>
    </div>
  );
}
