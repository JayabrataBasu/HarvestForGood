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
      <div className="min-h-screen relative overflow-hidden">
        {/* Farm-to-sunset gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-lime-300 via-yellow-200 via-orange-200 via-amber-200 via-yellow-100 via-orange-50 to-sky-50"></div>

        <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced loading animation */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
              <div className="animate-pulse flex flex-col space-y-8">
                <div className="flex space-x-4">
                  <div className="h-8 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full w-32"></div>
                </div>
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-3/4"></div>
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/2"></div>
                <div className="h-80 bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-4/6"></div>
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
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-12">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
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
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
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
      {/* Farm-to-sunset gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-300 via-yellow-200 via-orange-200 via-amber-200 via-yellow-100 via-orange-50 to-sky-50"></div>

      {/* Animated overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Enhanced back button */}
        <div className="mb-10 animate-fade-in-up">
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

        {/* Enhanced Paper Detail Component Container */}
        <div
          className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-12 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <PaperDetail
            paper={paper}
            onSave={toggleSaveStatus}
            isSaved={isSaved}
          />
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-emerald-300 to-teal-300 rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute top-60 right-20 w-12 h-12 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-40 left-32 w-20 h-20 bg-gradient-to-r from-blue-300 to-sky-300 rounded-full opacity-20 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
