"use client";
import React, { useEffect, useState } from "react";
import ImportPapers from "../../../../components/research/ImportPapers";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../../lib/api";

export default function ImportPapersPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login?next=/admin/research/import");
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Research Paper Import
          </h1>
          <p className="mt-2 text-gray-600">
            Bulk import research papers from JSON data.
          </p>
        </div>

        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <svg
              className="mr-1.5 -ml-0.5 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>

          <button
            onClick={() => router.push("/research")}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <svg
              className="mr-1.5 -ml-0.5 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
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
            View Research Papers
          </button>
        </div>

        <ImportPapers />

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Import Format Guidelines
          </h2>
          <p className="text-gray-600 mb-4">
            The JSON file should contain an array of paper objects with the
            following structure:
          </p>

          <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
            <pre className="text-xs text-gray-800">
              {`[
  {
    "title": "Paper Title",
    "abstract": "Paper abstract text...",
    "authors": [
      {
        "name": "Author Name",
        "affiliation": "Institution Name",
        "email": "author@example.com" // Optional
      }
    ],
    "publication_date": "YYYY-MM-DD",
    "methodology_type": "qualitative|quantitative|mixed",
    "citation_count": 123,
    "citation_trend": "increasing|stable|decreasing",
    "journal": "Journal Name",
    "keywords": [
      {"name": "keyword1"},
      {"name": "keyword2"}
    ],
    "download_url": "https://example.com/paper.pdf",
    "doi": "10.xxxx/xxxxx", // Optional but recommended
    "volume": "5", // Optional
    "issue": "2", // Optional
    "pages": "123-145" // Optional
  }
]`}
            </pre>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Notes:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>All dates should be in ISO format (YYYY-MM-DD)</li>
              <li>Authors and keywords will be automatically de-duplicated</li>
              <li>DOI is optional but recommended for avoiding duplicates</li>
              <li>
                The system will handle up to 100 papers in a single import
              </li>
              <li>Large imports may take some time to process</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
