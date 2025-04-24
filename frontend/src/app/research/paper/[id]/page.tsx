"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPaperById } from "@/lib/api"; // We'll create this function
import { ResearchPaper } from "@/types/paper.types";

export default function PaperDetailPage() {
  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const params = useParams();
  const router = useRouter();
  const paperId = params.id as string;

  useEffect(() => {
    const fetchPaper = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from your API
        const data = await getPaperById(paperId);
        setPaper(data);

        // Check if paper is saved in local storage
        const savedPapers = JSON.parse(
          localStorage.getItem("savedPapers") || "[]"
        );
        setIsSaved(savedPapers.includes(paperId));
      } catch (err) {
        console.error("Error fetching paper:", err);
        setError("Failed to load paper details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaper();
  }, [paperId]);

  const toggleSave = () => {
    const savedPapers = JSON.parse(localStorage.getItem("savedPapers") || "[]");
    if (isSaved) {
      localStorage.setItem(
        "savedPapers",
        JSON.stringify(savedPapers.filter((id: string) => id !== paperId))
      );
    } else {
      localStorage.setItem(
        "savedPapers",
        JSON.stringify([...savedPapers, paperId])
      );
    }
    setIsSaved(!isSaved);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error || "Paper not found"}</p>
        </div>
        <div className="mt-6">
          <Link
            href="/research"
            className="text-blue-600 hover:underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Research Papers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          href="/research"
          className="text-blue-600 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Research Papers
        </Link>
      </div>

      <article className="bg-white rounded-xl shadow-card p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900 max-w-4xl">
            {paper.title}
          </h1>
          <button
            onClick={toggleSave}
            className={`text-lg flex items-center gap-1 px-4 py-2 rounded-full ${
              isSaved
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <span>{isSaved ? "★" : "☆"}</span>
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Authors</h2>
          <div className="flex flex-wrap gap-4">
            {paper.authors.map((author) => (
              <div key={author.id} className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium">{author.name}</p>
                <p className="text-sm text-gray-600">{author.affiliation}</p>
                {author.email && (
                  <a
                    href={`mailto:${author.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {author.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-2 mb-3">
            <div>
              <span className="font-medium">Published:</span>{" "}
              {new Date(paper.publicationDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Journal:</span> {paper.journal}
            </div>
            <div>
              <span className="font-medium">Methodology:</span>{" "}
              {paper.methodologyType}
            </div>
            <div>
              <span className="font-medium">Citations:</span>{" "}
              {paper.citationCount.toLocaleString()}
              <span className="ml-1 text-xs">
                {paper.citationTrend === "increasing" && "↑"}
                {paper.citationTrend === "decreasing" && "↓"}
                {paper.citationTrend === "stable" && "→"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Abstract</h2>
          <div className="prose max-w-none">
            <p className="text-gray-800 leading-relaxed">{paper.abstract}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {paper.keywords.map((keyword) => (
              <span
                key={keyword.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {keyword.name}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <a
            href={paper.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Paper from Publisher
          </a>
          <p className="mt-2 text-sm text-gray-500">
            This link will take you to the publisher's website where you can
            access the full paper.
          </p>
        </div>
      </article>
    </div>
  );
}
