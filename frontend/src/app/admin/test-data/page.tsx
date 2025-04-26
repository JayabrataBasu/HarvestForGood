"use client";

import React, { useState } from "react";
import { generateBrowserTestData } from "@/utils/testDataGenerator";
import { ResearchPaper } from "@/types/paper.types";

export default function TestDataPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [paperCount, setPaperCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"view" | "json">("view");

  const handleGenerateData = () => {
    setLoading(true);
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      try {
        const data = generateBrowserTestData(paperCount);
        setPapers(data.papers);
        setLoading(false);
      } catch (error) {
        console.error("Error generating test data:", error);
        setLoading(false);
      }
    }, 100);
  };

  const downloadJson = () => {
    if (papers.length === 0) return;

    const dataStr = JSON.stringify(papers, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileName = `research-papers-${papers.length}-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Test Data Generator</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Generate Research Papers</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
          <div className="w-full md:w-1/3">
            <label
              htmlFor="paperCount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Number of Papers
            </label>
            <input
              type="number"
              id="paperCount"
              min="1"
              max="200"
              value={paperCount}
              onChange={(e) => setPaperCount(parseInt(e.target.value) || 10)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <button
            onClick={handleGenerateData}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              "Generate Test Data"
            )}
          </button>

          {papers.length > 0 && (
            <button
              onClick={downloadJson}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg
                className="h-4 w-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
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
              Download JSON
            </button>
          )}
        </div>

        {papers.length > 0 && (
          <>
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab("view")}
                  className={`${
                    activeTab === "view"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm`}
                >
                  View Papers
                </button>
                <button
                  onClick={() => setActiveTab("json")}
                  className={`${
                    activeTab === "json"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm`}
                >
                  JSON Data
                </button>
              </nav>
            </div>

            <div className="mt-4">
              {activeTab === "view" ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Title
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Journal
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Publication Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Authors
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Keywords
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {papers.map((paper) => (
                        <tr key={paper.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                            {paper.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {paper.journal}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(
                              paper.publicationDate
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                            {paper.authors.map((a) => a.name).join(", ")}
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {paper.keywords.map((kw) => (
                                <span
                                  key={kw.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {kw.name}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  className="mt-4 bg-gray-800 text-gray-300 p-4 rounded-md overflow-auto"
                  style={{ maxHeight: "600px" }}
                >
                  <pre className="text-xs">
                    {JSON.stringify(papers, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Usage Instructions</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            This tool allows you to generate realistic test data for development
            and testing purposes. The generated papers include varied metadata,
            multiple authors with realistic affiliations, and a comprehensive
            set of categorized keywords.
          </p>

          <h3 className="text-lg font-medium mt-4">How to use:</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Set the number of papers you want to generate (1-200)</li>
            <li>Click "Generate Test Data" to create the sample papers</li>
            <li>View the generated papers in the table or JSON format</li>
            <li>
              Download the JSON data for importing into your development
              environment
            </li>
          </ol>

          <h3 className="text-lg font-medium mt-4">
            Features of the generated data:
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Research papers with realistic titles and abstracts</li>
            <li>Authors with proper names and university affiliations</li>
            <li>Categorized keywords related to sustainable agriculture</li>
            <li>Varied methodology types and citation trends</li>
            <li>Journal names from relevant publications</li>
            <li>Realistic publication dates, DOIs, and other metadata</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
