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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<"overview" | "methodology">(
    "overview"
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <div className="min-h-screen relative overflow-hidden">
        {/* Farm-to-sunset gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-lime-300 via-yellow-200 via-orange-200 via-amber-200 via-yellow-100 via-orange-50 to-sky-50"></div>

        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced loading with glassmorphism */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
              <div className="animate-pulse flex flex-col space-y-8">
                <div className="flex space-x-4">
                  <div className="h-8 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full w-32 shimmer"></div>
                </div>
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-3/4 shimmer"></div>
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/2 shimmer"></div>
                <div className="h-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl shimmer"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6 shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-4/6 shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Farm-to-sunset gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-lime-300 via-yellow-200 via-orange-200 via-amber-200 via-yellow-100 via-orange-50 to-sky-50"></div>

        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center py-16 px-8">
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-12 hover-lift">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl mb-6">
                <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Oops! Something went wrong.
                </span>
              </h2>
              <p className="text-lg leading-6 text-gray-700 mb-8 font-medium">
                {error || "We couldn't find the paper you're looking for."}
              </p>
              <button
                onClick={handleGoBack}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 pulse-on-hover"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced farm-to-sunset gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-300 via-yellow-200 via-orange-200 via-amber-200 via-yellow-100 via-orange-50 to-sky-50"></div>

      {/* Animated overlay patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>

      {/* Custom enhanced animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
          }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }

        .animate-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
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
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover-effect:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
        }

        .pulse-border {
          animation: borderPulse 2s infinite;
        }

        .pulse-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .pulse-on-hover:hover {
          animation: borderPulse 0.5s ease-out;
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Enhanced back button with glassmorphism */}
        <div className="mb-10 animate-fade-up">
          <button
            onClick={handleGoBack}
            className="group inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-full shadow-lg text-sm font-bold text-gray-700 hover:bg-white/90 hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
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

        {/* Enhanced title card with glassmorphism and animations */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8 lg:p-12 mb-10 animate-fade-up card-hover-effect">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                {paper.title}
              </span>
            </h1>

            {formatMethodologyType(paper.methodologyType) && (
              <div className="inline-block text-sm text-white uppercase tracking-wider font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 pulse-glow">
                {formatMethodologyType(paper.methodologyType)} | RESEARCH PAPER
              </div>
            )}
            {!formatMethodologyType(paper.methodologyType) && (
              <div className="inline-block text-sm text-white uppercase tracking-wider font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 pulse-glow">
                RESEARCH PAPER
              </div>
            )}
          </div>

          {/* Enhanced save button */}
          <div className="flex justify-center">
            <button
              onClick={toggleSaveStatus}
              className={`mt-6 inline-flex items-center px-8 py-4 rounded-full shadow-lg text-base font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
                isSaved
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white border border-amber-300 hover:from-amber-500 hover:to-orange-500 focus:ring-amber-300 pulse-glow"
                  : "bg-white/90 text-gray-700 border border-white/60 hover:bg-white hover:shadow-xl focus:ring-emerald-300"
              }`}
            >
              {isSaved ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
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
                    className="h-5 w-5 mr-2"
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

        {/* Enhanced author info card with gradient */}
        <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl animate-fade-up delay-100 hover-lift">
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-6 px-6 text-left uppercase tracking-wider font-black text-lg">
                    Author
                  </th>
                  <th className="py-6 px-6 text-left uppercase tracking-wider font-black text-lg">
                    Source
                  </th>
                  <th className="py-6 px-6 text-left uppercase tracking-wider font-black text-lg">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-6 px-6 font-bold text-lg">
                    {displayAuthors()}
                  </td>
                  <td className="py-6 px-6">
                    <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold hover:bg-white/30 transition-all duration-300">
                      {paper.journal || "Not specified"}
                    </span>
                  </td>
                  <td className="py-6 px-6">
                    <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold hover:bg-white/30 transition-all duration-300">
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

        {/* Debug data with glassmorphism */}
        <div className="mb-12">
          <DebugData
            data={{
              rawAuthors: paper.authors,
              authorDetails: paper.authors
                ? Array.isArray(paper.authors)
                  ? paper.authors.map((a) => ({
                      type: typeof a,
                      value: a,
                      hasName:
                        typeof a === "object" && a !== null
                          ? "name" in a
                          : false,
                    }))
                  : { type: typeof paper.authors, value: paper.authors }
                : null,
              rawPublicationYear: paper.publicationYear,
              publicationDate: paper.publicationDate,
            }}
            title="Data Format Debug"
            enabled={true}
          />
        </div>

        {/* Enhanced abstract card with glassmorphism */}
        <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-8 lg:p-12 card-hover-effect border border-white/40 animate-fade-up delay-200 mb-12">
          <h2 className="text-2xl lg:text-3xl font-black text-gray-800 mb-8 text-center flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
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
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Abstract
            </span>
          </h2>
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
            <p className="text-gray-700 leading-relaxed text-lg font-medium">
              {paper.abstract}
            </p>
          </div>
        </div>

        {/* Enhanced publisher link card */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl shadow-2xl p-8 lg:p-12 mb-12 text-center animate-fade-up delay-300 hover-lift">
          <div className="mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
          <p className="text-white text-xl lg:text-2xl mb-8 font-bold">
            Access the full research paper through the publisher&apos;s website
          </p>
          <a
            href={paper.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 text-lg font-black bg-white text-indigo-600 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 pulse-border focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3"
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

        {/* Enhanced keywords card */}
        {paper.keywords && paper.keywords.length > 0 && (
          <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-8 lg:p-12 mb-12 card-hover-effect border border-white/40 animate-fade-up delay-300">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
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
              </div>
              <h3 className="text-2xl font-black">
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Keywords
                </span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {paper.keywords.map((keyword, index) => (
                <span
                  key={keyword.id}
                  className="bg-gradient-to-r from-teal-50 to-emerald-50 text-emerald-700 px-6 py-3 rounded-full text-sm font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-emerald-200 hover:border-emerald-300 pulse-glow"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {keyword.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Debugging component with glassmorphism */}
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6">
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

      {/* Enhanced floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-20 float-animation"></div>
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-32 left-20 w-12 h-12 bg-gradient-to-r from-blue-300 to-sky-300 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-60 left-1/2 w-14 h-14 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-20 float-animation"
        style={{ animationDelay: "0.5s" }}
      ></div>
    </div>
  );
}
