"use client";
import React, { useState } from "react";
import { API_BASE_URL } from "../../lib/api";

interface ImportResult {
  success_count: number;
  error_count: number;
  errors: {
    index: number;
    title: string;
    errors: any;
  }[];
}

export default function ImportPapers() {
  const [jsonData, setJsonData] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleData = [
    {
      title: "Sample Research Paper 1",
      abstract: "This is a sample research paper for demonstration.",
      authors: [
        {
          name: "John Doe",
          affiliation: "Sample University",
          email: "john@example.com",
        },
        { name: "Jane Smith", affiliation: "Research Institute" },
      ],
      publication_date: "2023-01-15",
      publication_year: "2023", // Keep as string to match backend model
      methodology_type: "qualitative",
      citation_count: 25,
      citation_trend: "increasing",
      journal: "Journal of Sample Research",
      keywords: [
        { name: "sample" },
        { name: "research" },
        { name: "demonstration" },
      ],
      download_url: "https://example.com/papers/sample1.pdf",
      doi: "10.1234/sample.2023.01",
      volume: "45",
      issue: "2",
      pages: "123-145",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setJsonData(content);
        // Validate JSON
        JSON.parse(content);
        setError(null);
      } catch (err) {
        setError("Invalid JSON file. Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);
    try {
      if (e.target.value) {
        JSON.parse(e.target.value);
        setError(null);
      }
    } catch (err) {
      setError("Invalid JSON format. Please check your input.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jsonData) {
      setError("Please provide JSON data to import.");
      return;
    }

    try {
      // Validate one more time before sending
      const papers = JSON.parse(jsonData);

      if (!Array.isArray(papers)) {
        setError("JSON must be an array of paper objects.");
        return;
      }

      // Additional validation to ensure authors are properly formatted
      for (let i = 0; i < papers.length; i++) {
        const paper = papers[i];

        // Check and format authors if needed
        if (paper.authors) {
          if (!Array.isArray(paper.authors)) {
            setError(
              `Paper at index ${i} has invalid authors format. Authors must be an array.`
            );
            return;
          }

          // Ensure each author has at least a name property
          paper.authors = paper.authors.map((author: any) => {
            if (typeof author === "string") {
              return { name: author };
            }
            return author;
          });
        }

        // Ensure publication_year is a string
        if (
          paper.publication_year &&
          typeof paper.publication_year !== "string"
        ) {
          paper.publication_year = String(paper.publication_year);
        }
      }

      setUploading(true);
      setError(null);
      setResult(null);

      // Use the validated and transformed papers
      const validatedJsonData = JSON.stringify(papers);
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/research/papers/bulk-import/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: validatedJsonData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || "Failed to import papers");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during import");
    } finally {
      setUploading(false);
    }
  };

  const clearForm = () => {
    setJsonData("");
    setResult(null);
    setError(null);
    setUploading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Bulk Import Research Papers
      </h2>
      <p className="text-gray-600 mb-6">
        Upload a JSON file containing an array of research papers or paste JSON
        data directly.
      </p>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Successfully imported {result.success_count} papers.
                {result.error_count > 0 &&
                  ` ${result.error_count} papers had errors.`}
              </p>
            </div>
          </div>

          {result.error_count > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Import Errors:
              </h3>
              <div className="bg-white rounded border border-red-200 p-3 max-h-60 overflow-y-auto">
                <ul className="list-disc pl-5 space-y-1">
                  {result.errors.map((err, index) => (
                    <li key={index} className="text-sm text-red-700">
                      <strong>{err.title}</strong>:{" "}
                      {typeof err.errors === "string"
                        ? err.errors
                        : Object.entries(err.errors)
                            .map(
                              ([key, value]) =>
                                `${key}: ${
                                  Array.isArray(value)
                                    ? value.join(", ")
                                    : value
                                }`
                            )
                            .join("; ")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearForm}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Import More Papers
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload JSON File
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Or Paste JSON Data
            </label>
            <button
              type="button"
              onClick={() => setJsonData(JSON.stringify(sampleData, null, 2))}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Load Sample Data
            </button>
          </div>
          <textarea
            value={jsonData}
            onChange={handleTextAreaChange}
            rows={12}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
            placeholder="[{...}, {...}]"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={clearForm}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={uploading || !jsonData}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              uploading || !jsonData ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Importing..." : "Import Papers"}
          </button>
        </div>
      </form>
    </div>
  );
}
