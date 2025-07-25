"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { researchAPI } from "@/lib/api";

interface DashboardStats {
  totalPapers: number;
  totalAuthors: number;
  totalKeywords: number;
  methodologyBreakdown: {
    qualitative: number;
    quantitative: number;
    mixed: number;
  };
  recentPapers: {
    id: string;
    title: string;
    authors: string[];
    dateAdded: string;
    slug?: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPapers: 0,
    totalAuthors: 0,
    totalKeywords: 0,
    methodologyBreakdown: { qualitative: 0, quantitative: 0, mixed: 0 },
    recentPapers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        // In a real application, you'd have a dedicated endpoint for this
        // For now, we'll fetch papers and calculate stats from them
        const result = await researchAPI.fetchPapers({ page_size: "100" });

        if (result.success && result.data) {
          const papers = result.data.results;

          // Extract and count unique authors
          const authorsSet = new Set();
          papers.forEach(
            (paper: { authors: { id: string; name: string }[] }) => {
              paper.authors.forEach((author: { id: string; name: string }) =>
                authorsSet.add(author.id)
              );
            }
          );

          // Extract and count unique keywords
          const keywordsSet = new Set();
          papers.forEach((paper: { keywords: { id: string }[] }) => {
            paper.keywords.forEach((keyword: { id: string }) =>
              keywordsSet.add(keyword.id)
            );
          });

          // Count methodology types
          const methodologyCount = {
            qualitative: papers.filter(
              (p: { methodologyType: string }) =>
                p.methodologyType === "qualitative"
            ).length,
            quantitative: papers.filter(
              (p: { methodologyType: string }) =>
                p.methodologyType === "quantitative"
            ).length,
            mixed: papers.filter(
              (p: { methodologyType: string }) => p.methodologyType === "mixed"
            ).length,
          };

          // Extract recent papers (sort by creation date if available)
          const sortedPapers = [...papers].sort((a, b) => {
            const dateA = new Date(a.publicationDate).getTime();
            const dateB = new Date(b.publicationDate).getTime();
            return dateB - dateA;
          });

          const recentPapers = sortedPapers.slice(0, 5).map((paper) => ({
            id: paper.id,
            title: paper.title,
            authors: paper.authors.map((a: { name: string }) => a.name),
            dateAdded: new Date(paper.publicationDate).toLocaleDateString(),
            slug: paper.slug,
          }));

          setStats({
            totalPapers: papers.length,
            totalAuthors: authorsSet.size,
            totalKeywords: keywordsSet.size,
            methodologyBreakdown: methodologyCount,
            recentPapers,
          });
        } else {
          throw new Error(result.message || "Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
        setError(
          "Failed to load dashboard statistics. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Administrator Dashboard
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Overview of research papers and system statistics
      </p>

      {loading ? (
        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white overflow-hidden shadow rounded-lg animate-pulse"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gray-200 h-10 w-10 rounded-md"></div>
                  <div className="ml-5 w-full">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="mt-2 h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Papers */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <svg
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
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Papers
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.totalPapers}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/papers"
                    className="font-medium text-indigo-600 hover:text-indigo-900"
                  >
                    View all papers
                  </Link>
                </div>
              </div>
            </div>

            {/* Total Authors */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Authors
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.totalAuthors}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className="font-medium text-green-600">
                    Contributing researchers
                  </span>
                </div>
              </div>
            </div>

            {/* Total Keywords */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <svg
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
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Keywords
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.totalKeywords}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/keywords"
                    className="font-medium text-yellow-600 hover:text-yellow-900"
                  >
                    Manage keywords
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Quick Actions
                      </dt>
                      <dd className="mt-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href="/admin/papers/new"
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          >
                            Add Paper
                          </Link>
                          <Link
                            href="/admin/papers/import"
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          >
                            Import
                          </Link>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/keywords/new"
                    className="font-medium text-blue-600 hover:text-blue-900"
                  >
                    Add new keyword
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Methodology breakdown */}
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Methodology Breakdown
              </h3>
            </div>
            <div className="p-5">
              <div className="relative">
                {/* Bar chart visualization */}
                <div className="flex items-end">
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-500">
                        Qualitative
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {stats.methodologyBreakdown.qualitative}
                        <span className="text-gray-500 ml-1 text-xs">
                          (
                          {Math.round(
                            (stats.methodologyBreakdown.qualitative /
                              stats.totalPapers) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden bg-gray-200 rounded-full h-3">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{
                          width: `${
                            (stats.methodologyBreakdown.qualitative /
                              stats.totalPapers) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-end mt-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-500">
                        Quantitative
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {stats.methodologyBreakdown.quantitative}
                        <span className="text-gray-500 ml-1 text-xs">
                          (
                          {Math.round(
                            (stats.methodologyBreakdown.quantitative /
                              stats.totalPapers) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden bg-gray-200 rounded-full h-3">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${
                            (stats.methodologyBreakdown.quantitative /
                              stats.totalPapers) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-end mt-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-500">
                        Mixed Methods
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {stats.methodologyBreakdown.mixed}
                        <span className="text-gray-500 ml-1 text-xs">
                          (
                          {Math.round(
                            (stats.methodologyBreakdown.mixed /
                              stats.totalPapers) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden bg-gray-200 rounded-full h-3">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{
                          width: `${
                            (stats.methodologyBreakdown.mixed /
                              stats.totalPapers) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Papers */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Papers
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  The latest research papers added to the system.
                </p>
              </div>
              <Link
                href="/admin/papers"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                View all
              </Link>
            </div>
            <div className="border-t border-gray-200">
              <ul role="list" className="divide-y divide-gray-200">
                {stats.recentPapers.length > 0 ? (
                  stats.recentPapers.map((paper) => (
                    <li
                      key={paper.id}
                      className="px-4 py-4 sm:px-6 hover:bg-gray-50"
                    >
                      <Link
                        href={`/admin/papers/edit/${paper.slug || paper.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-primary truncate">
                              {paper.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {paper.authors.join(", ")}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="text-xs text-gray-500">
                              {paper.dateAdded}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-8 sm:px-6 text-center text-gray-500">
                    No papers found.
                    <Link
                      href="/admin/papers/new"
                      className="ml-1 text-primary hover:text-primary-dark"
                    >
                      Add your first paper
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
