"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useSavedPapers } from "@/hooks/useSavedPapers";
import Link from "next/link";

export default function Dashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const {
    savedPapers,
    isLoading: savedPapersLoading,
    removeSavedPaper,
    clearAllSavedPapers,
  } = useSavedPapers();

  useEffect(() => {
    // If user is not logged in and the auth check is complete, redirect to login
    if (!user && !isLoading) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const handleRemovePaper = (paperId: string) => {
    if (
      window.confirm(
        "Are you sure you want to remove this paper from your saved list?"
      )
    ) {
      removeSavedPaper(paperId);
    }
  };

  const handleClearAllPapers = () => {
    if (
      window.confirm(
        "Are you sure you want to remove all saved papers? This action cannot be undone."
      )
    ) {
      clearAllSavedPapers();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-soft-green to-background py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary-dark">
              User Dashboard
            </h1>
            <button
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-300 flex items-center disabled:opacity-50"
            >
              {isLogoutLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              Logout
            </button>
          </div>

          <div className="mb-8 p-4 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              {user.first_name && (
                <div>
                  <p className="text-gray-600">First Name</p>
                  <p className="font-medium">{user.first_name}</p>
                </div>
              )}
              {user.last_name && (
                <div>
                  <p className="text-gray-600">Last Name</p>
                  <p className="font-medium">{user.last_name}</p>
                </div>
              )}
              <div>
                <p className="text-gray-600">Email Verified</p>
                <p
                  className={`font-medium ${
                    user.email_verified ? "text-green-600" : "text-orange-500"
                  }`}
                >
                  {user.email_verified ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Saved Papers Section */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-800">
                Saved Research Papers
              </h2>
              {savedPapers.length > 0 && (
                <button
                  onClick={handleClearAllPapers}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {savedPapersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : savedPapers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-blue-600 mb-2">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">No saved papers yet</p>
                <Link
                  href="/research"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse Research Papers →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {paper.slug ? (
                            <Link
                              href={`/research/papers/${paper.slug}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {paper.title}
                            </Link>
                          ) : (
                            <Link
                              href={`/research/paper/${paper.id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {paper.title}
                            </Link>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                          <strong>Authors:</strong>{" "}
                          {paper.authors.join(", ") || "Unknown"}
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                          <strong>Year:</strong> {paper.publicationYear}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Saved on{" "}
                          {new Date(paper.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemovePaper(paper.id)}
                        className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                        title="Remove from saved papers"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-green-800">
                Forum Activities
              </h3>
              <p className="text-gray-600 mb-4">
                View and manage your forum posts and comments.
              </p>
              <Link
                href="/forums/posts"
                className="text-green-700 hover:text-green-900 font-medium"
              >
                Go to Forums →
              </Link>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">
                Research Papers
              </h3>
              <p className="text-gray-600 mb-4">
                Access research papers and academic resources.
              </p>
              <Link
                href="/research"
                className="text-blue-700 hover:text-blue-900 font-medium"
              >
                Browse Research →
              </Link>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-3 text-purple-800">
                Categories
              </h3>
              <p className="text-gray-600 mb-4">
                Explore different food and agriculture categories.
              </p>
              <Link
                href="/categories"
                className="text-purple-700 hover:text-purple-900 font-medium"
              >
                View Categories →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
