"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPaperById } from "../../../../lib/api";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ResearchPaper, Author, Keyword } from "../../../../types/paper.types";
import DebugData from "../../../../components/DebugData";

export default function PaperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "methodology">(
    "overview"
  );
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  useEffect(() => {
    async function loadPaper() {
      if (!params.id) return;

      setIsLoading(true);
      try {
        // In a real app, this would call an API
        const paperData = await getPaperById(params!.id as string);
        console.log("Paper data received:", paperData); // Debug log
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
  }, [params.id]);

  const toggleSaveStatus = () => {
    const savedPapers = JSON.parse(localStorage.getItem("savedPapers") || "[]");

    if (isSaved) {
      const updatedSavedPapers = savedPapers.filter(
        (id: string) => id !== paper?.id
      );
      localStorage.setItem("savedPapers", JSON.stringify(updatedSavedPapers));
    } else {
      savedPapers.push(paper?.id);
      localStorage.setItem("savedPapers", JSON.stringify(savedPapers));
    }

    setIsSaved(!isSaved);
  };

  const handleGoBack = () => {
    router.back();
  };

  // Helper to format date - completely simplified to handle all cases
  const formatDate = (dateOrYear: Date | string | number | undefined) => {
    if (!paper) return "";

    // Check for both camelCase and snake_case versions of publication year
    if (paper.publication_year) return paper.publication_year;
    if (paper.publicationYear) return paper.publicationYear;
    // Add check for publication_date which is what the serializer returns
    if (paper.publication_date) return paper.publication_date;

    // Handle standard date formats
    if (dateOrYear) {
      // If it's a string year
      if (typeof dateOrYear === "string" && /^\d{4}$/.test(dateOrYear)) {
        return dateOrYear;
      }

      // Try to extract year from any date format
      try {
        const date = new Date(dateOrYear);
        if (!isNaN(date.getTime())) {
          return date.getFullYear().toString();
        }
      } catch (e) {}
    }

    return "Not specified";
  };

  // Helper to format methodology type safely
  const formatMethodologyType = (type?: string) => {
    if (!type || type.toLowerCase() === "unknown") return "";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Completely simplified author display function that handles all possible formats
  const displayAuthors = () => {
    if (!paper) return "Not specified";

    // Method 1: Check for both camelCase and snake_case versions of direct author names
    if (paper.author_names) return paper.author_names;

    // Method 2: Handle authors array with name properties
    if (
      paper.authors &&
      Array.isArray(paper.authors) &&
      paper.authors.length > 0
    ) {
      // Parse author objects
      return paper.authors
        .map((author) => {
          if (typeof author === "string") return author;
          if (author && typeof author === "object") {
            // Try all possible name properties
            return (
              author.name ||
              author.author_name ||
              author.fullName ||
              author.full_name ||
              "Unknown"
            );
          }
          return "Unknown";
        })
        .join(", ");
    }

    return "Not specified";
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
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes borderPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(5, 150, 105, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(5, 150, 105, 0);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }

        .card-hover-effect {
          transition: all 0.3s ease;
        }

        .card-hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.1),
            0 8px 10px -6px rgba(59, 130, 246, 0.1);
        }

        .pulse-border {
          animation: borderPulse 2s infinite;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Back button with animation */}
        <div className="mb-8 animate-fade-up">
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

        {/* Title card with animation */}
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

          {/* Save button */}
          <div className="flex justify-center">
            <button
              onClick={toggleSaveStatus}
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
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  Save to Library
                </>
              )}
            </button>
          </div>
        </div>

        {/* Author info card with gradient and animation */}
        <div className="rounded-2xl overflow-hidden mb-10 shadow-lg animate-fade-up delay-100">
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
                      {formatDate(
                        paper.publication_date ||
                          paper.publicationYear ||
                          paper.publication_year ||
                          paper.publicationDate
                      )}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Debug data specifically for authors and publication year */}
        <DebugData
          data={{
            rawAuthors: paper.authors,
            authorDetails: paper.authors
              ? Array.isArray(paper.authors)
                ? paper.authors.map((a) => ({
                    type: typeof a,
                    value: a,
                    hasName:
                      typeof a === "object" && a !== null ? "name" in a : false,
                  }))
                : { type: typeof paper.authors, value: paper.authors }
              : null,
            rawPublicationYear: paper.publicationYear,
            publicationDate: paper.publicationDate,
          }}
          title="Data Format Debug"
          enabled={true}
        />

        {/* Abstract card with animation */}
        <div className="bg-white shadow-lg rounded-2xl p-8 card-hover-effect border border-blue-100 animate-fade-up delay-200">
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

        {/* Link to publisher card with animation */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg p-6 mb-10 text-center animate-fade-up delay-300">
          <p className="text-white text-lg mb-4">
            Access the full research paper through the publisher&apos;s website
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
              Visit Publisher
            </div>
          </a>
        </div>

        {/* Keywords card with animation */}
        {paper.keywords && paper.keywords.length > 0 && (
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-10 card-hover-effect border border-blue-100 animate-fade-up delay-300">
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
              {paper.keywords.map((keyword) => (
                <span
                  key={keyword.id}
                  className="bg-gradient-to-r from-teal-50 to-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow hover:-translate-y-1 border border-emerald-100"
                >
                  {keyword.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Publisher Link Section - replaces citation count card */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg p-6 mb-10 text-center animate-scale-in">
          <p className="text-white text-lg mb-4">
            Access the full research paper through the publisher&apos;s website
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
              Visit Publisher
            </div>
          </a>
        </div>

        {/* Debugging component - set enabled to false in production */}
        <DebugData
          data={{
            id: paper.id,
            title: paper.title,
            authors: paper.authors,
            publicationYear: paper.publicationYear,
            publicationDate: paper.publicationDate,
            paperData: paper,
          }}
          enabled={process.env.NODE_ENV === "development"}
          title="Paper Debug Data"
        />
      </div>
    </div>
  );
}
