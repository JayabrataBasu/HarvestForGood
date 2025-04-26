"use client";
import React, { useState, useRef } from "react";
import { researchAPI } from "@/lib/api";
import { BulkImportResult, PaperFormData } from "@/types/paper.types";
import Papa from "papaparse";

const TEMPLATE_HEADERS = [
  "title",
  "abstract",
  "journal",
  "publication_date",
  "methodology_type",
  "citation_count",
  "citation_trend",
  "authors",
  "keywords",
  "doi",
  "download_url",
  "volume",
  "issue",
  "pages",
];

// Sample data for the template
const TEMPLATE_DATA = [
  [
    "Impact of Urban Farming on Food Security",
    "This study examines how urban farming initiatives contribute to local food security in metropolitan areas.",
    "Journal of Sustainable Agriculture",
    "2023-05-15", // YYYY-MM-DD format
    "mixed", // qualitative, quantitative, or mixed
    "12", // citation count (number)
    "increasing", // increasing, stable, or decreasing
    "Dr. Jane Smith (University of California); Prof. Robert Johnson (Stanford University)", // Format: Name (Affiliation); Name (Affiliation)
    "Urban Farming; Food Security; Sustainability", // Semicolon-separated keywords
    "10.1234/example.2023.001", // DOI
    "https://example.com/paper.pdf", // Download URL
    "45", // Volume
    "3", // Issue
    "123-145", // Pages
  ],
  [
    "Comparative Analysis of Organic Farming Methods",
    "This paper compares different organic farming techniques and their impact on crop yield and soil health.",
    "Environmental Science Journal",
    "2022-11-22",
    "quantitative",
    "8",
    "stable",
    "Dr. Michael Brown (Cornell University); Prof. Sarah Lee (University of Wisconsin)",
    "Organic Farming; Crop Yield; Soil Health; Agriculture",
    "10.5678/example.2022.002",
    "https://example.com/organic-farming.pdf",
    "32",
    "2",
    "78-95",
  ],
];

// Define the csv mapping to our API format
interface CsvRow {
  title: string;
  abstract: string;
  journal: string;
  publication_date: string;
  methodology_type: string;
  citation_count: string;
  citation_trend: string;
  authors: string;
  keywords: string;
  doi?: string;
  download_url?: string;
  volume?: string;
  issue?: string;
  pages?: string;
}

export default function CsvImportComponent() {
  const [step, setStep] = useState<
    "upload" | "preview" | "importing" | "results"
  >("upload");
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CsvRow[]>([]);
  const [errors, setErrors] = useState<
    { rowIndex: number; errors: string[] }[]
  >([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(
    null
  );
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateTemplateFile = () => {
    // Create CSV content
    const csvContent = [
      TEMPLATE_HEADERS.join(","),
      ...TEMPLATE_DATA.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "research_papers_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as CsvRow[];
        setParsedData(data);
        validateData(data);
        setStep("preview");
      },
      error: (error) => {
        setValidationErrors(["Failed to parse CSV file: " + error.message]);
      },
    });
  };

  const validateData = (data: CsvRow[]) => {
    const rowErrors: { rowIndex: number; errors: string[] }[] = [];
    const generalErrors: string[] = [];

    if (data.length === 0) {
      generalErrors.push("The CSV file is empty.");
      setValidationErrors(generalErrors);
      return;
    }

    // Check headers
    const requiredHeaders = [
      "title",
      "abstract",
      "journal",
      "publication_date",
      "authors",
      "keywords",
    ];
    const firstRow = data[0];
    const missingHeaders = requiredHeaders.filter(
      (header) => !(header in firstRow)
    );

    if (missingHeaders.length > 0) {
      generalErrors.push(
        `Missing required columns: ${missingHeaders.join(", ")}`
      );
    }

    // Validate each row
    data.forEach((row, index) => {
      const rowError: string[] = [];

      if (!row.title?.trim()) rowError.push("Title is required");
      if (!row.abstract?.trim()) rowError.push("Abstract is required");
      if (!row.journal?.trim()) rowError.push("Journal is required");

      if (!row.publication_date?.trim()) {
        rowError.push("Publication date is required");
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(row.publication_date)) {
        rowError.push("Publication date must be in YYYY-MM-DD format");
      }

      if (
        row.methodology_type &&
        !["qualitative", "quantitative", "mixed"].includes(row.methodology_type)
      ) {
        rowError.push(
          "Methodology type must be one of: qualitative, quantitative, mixed"
        );
      }

      if (
        row.citation_trend &&
        !["increasing", "stable", "decreasing"].includes(row.citation_trend)
      ) {
        rowError.push(
          "Citation trend must be one of: increasing, stable, decreasing"
        );
      }

      if (!row.authors?.trim()) {
        rowError.push("At least one author is required");
      }

      if (!row.keywords?.trim()) {
        rowError.push("At least one keyword is required");
      }

      if (row.download_url && !/^https?:\/\//.test(row.download_url)) {
        rowError.push("Download URL must start with http:// or https://");
      }

      if (rowError.length > 0) {
        rowErrors.push({ rowIndex: index, errors: rowError });
      }
    });

    setErrors(rowErrors);
    setValidationErrors(generalErrors);
  };

  const transformDataForImport = (data: CsvRow[]): PaperFormData[] => {
    return data.map((row) => {
      // Parse authors
      const authors = row.authors.split(";").map((authorStr) => {
        const match = authorStr.trim().match(/^(.*?)(?:\s*\((.*?)\))?$/);
        if (match) {
          const [_, name, affiliation] = match;
          return {
            name: name.trim(),
            affiliation: affiliation?.trim() || "",
          };
        }
        return { name: authorStr.trim(), affiliation: "" };
      });

      // Parse keywords
      const keywords = row.keywords.split(";").map((keyword) => ({
        name: keyword.trim(),
      }));

      return {
        title: row.title.trim(),
        abstract: row.abstract.trim(),
        journal: row.journal.trim(),
        publication_date: row.publication_date.trim(),
        methodology_type: (row.methodology_type?.trim() || "mixed") as any,
        citation_count: parseInt(row.citation_count || "0", 10),
        citation_trend: (row.citation_trend?.trim() || "stable") as any,
        authors,
        keywords,
        doi: row.doi?.trim() || "",
        download_url: row.download_url?.trim() || "",
        volume: row.volume?.trim() || "",
        issue: row.issue?.trim() || "",
        pages: row.pages?.trim() || "",
      };
    });
  };

  const startImport = async () => {
    if (errors.length > 0 || validationErrors.length > 0) {
      if (
        !confirm(
          "There are validation errors. Do you want to proceed anyway? Only valid entries will be imported."
        )
      ) {
        return;
      }
    }

    setStep("importing");
    setProgress(0);

    try {
      // Transform data to match API format
      const transformedData = transformDataForImport(parsedData);

      // Remove rows with validation errors
      const validData = transformedData.filter(
        (_, index) => !errors.some((error) => error.rowIndex === index)
      );

      if (validData.length === 0) {
        setValidationErrors([
          "No valid data to import after filtering out errors.",
        ]);
        setStep("preview");
        return;
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 5;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 200);

      // Submit the import request
      const result = await researchAPI.bulkImportPapers(validData);

      clearInterval(progressInterval);

      if (result.success && result.data) {
        setImportResult(result.data);
        setProgress(100);
      } else {
        throw new Error(result.message || "Import failed");
      }
    } catch (error) {
      setValidationErrors([
        `Import failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      ]);
      setProgress(0);
    } finally {
      setStep("results");
    }
  };

  const resetForm = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setValidationErrors([]);
    setImportResult(null);
    setProgress(0);
    setStep("upload");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Bulk Import Research Papers
        </h2>
      </div>

      <div className="p-6">
        {/* Progress steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  step === "upload"
                    ? "border-primary bg-primary text-white"
                    : step === "preview" ||
                      step === "importing" ||
                      step === "results"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                1
              </div>
              <div className="text-xs mt-1">Upload</div>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                step === "preview" || step === "importing" || step === "results"
                  ? "bg-primary"
                  : "bg-gray-200"
              }`}
            ></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  step === "preview"
                    ? "border-primary bg-primary text-white"
                    : step === "importing" || step === "results"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                2
              </div>
              <div className="text-xs mt-1">Preview</div>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                step === "importing" || step === "results"
                  ? "bg-primary"
                  : "bg-gray-200"
              }`}
            ></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  step === "results"
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                3
              </div>
              <div className="text-xs mt-1">Results</div>
            </div>
          </div>
        </div>

        {/* Upload step */}
        {step === "upload" && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0 text-blue-400">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Import multiple research papers at once using a CSV file.
                    Make sure your CSV file has the correct format.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload CSV File
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Select a CSV file containing research paper data. Required
                  columns include title, abstract, journal, publication date,
                  authors, and keywords.
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={generateTemplateFile}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg
                    className="mr-2 h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  Download Template
                </button>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                {file
                  ? file.name
                  : "Drag and drop your CSV file here, or click to select"}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="mt-4 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary-dark"
              />
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Format Instructions
              </h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>The CSV file must include headers for each column</li>
                  <li>
                    Required columns: title, abstract, journal,
                    publication_date, authors, keywords
                  </li>
                  <li>
                    Authors format: "Name (Affiliation); Name (Affiliation)"
                  </li>
                  <li>Keywords format: "Keyword1; Keyword2; Keyword3"</li>
                  <li>Date format: YYYY-MM-DD (e.g., 2023-05-15)</li>
                  <li>Methodology type: qualitative, quantitative, or mixed</li>
                  <li>Citation trend: increasing, stable, or decreasing</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Preview step */}
        {step === "preview" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Preview Data
              </h3>
              <div className="text-sm text-gray-500">
                {parsedData.length}{" "}
                {parsedData.length === 1 ? "paper" : "papers"} ready to import
              </div>
            </div>

            {/* General validation errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
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
                    <h3 className="text-sm font-medium text-red-800">
                      Validation Errors
                    </h3>
                    <div className="mt-1 text-sm text-red-700">
                      <ul className="list-disc list-inside space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data preview table */}
            <div className="overflow-x-auto border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Authors
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Journal
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Published
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedData.map((row, index) => {
                    const hasErrors = errors.some(
                      (error) => error.rowIndex === index
                    );
                    return (
                      <tr key={index} className={hasErrors ? "bg-red-50" : ""}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900">
                          <div className="font-medium">{row.title}</div>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                            {row.abstract}
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {row.authors}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {row.journal}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row.publication_date}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {hasErrors ? (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <svg
                                className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400"
                                fill="currentColor"
                                viewBox="0 0 8 8"
                              >
                                <circle cx="4" cy="4" r="3" />
                              </svg>
                              Error
                            </div>
                          ) : (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg
                                className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
                                fill="currentColor"
                                viewBox="0 0 8 8"
                              >
                                <circle cx="4" cy="4" r="3" />
                              </svg>
                              Valid
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Row validation errors */}
            {errors.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Row Validation Errors
                </h4>
                <div className="bg-red-50 p-4 rounded-md max-h-60 overflow-y-auto">
                  {errors.map((error, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <h5 className="text-sm font-semibold text-red-800">
                        Row {error.rowIndex + 1}:{" "}
                        {parsedData[error.rowIndex]?.title || "Unknown paper"}
                      </h5>
                      <ul className="list-disc list-inside space-y-1 mt-1 text-sm text-red-700">
                        {error.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Importing step */}
        {step === "importing" && (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <svg
                className="animate-spin mx-auto h-10 w-10 text-primary"
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
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Importing Papers
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Please wait while we process your data. This may take a few
                moments...
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-lg mx-auto">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="text-center text-sm text-gray-500">
              {Math.round(progress)}% complete
            </div>
          </div>
        )}

        {/* Results step */}
        {step === "results" && importResult && (
          <div className="space-y-6">
            <div
              className={`p-4 rounded-md ${
                importResult.success_count > 0 && importResult.error_count === 0
                  ? "bg-green-50"
                  : importResult.success_count > 0 &&
                    importResult.error_count > 0
                  ? "bg-yellow-50"
                  : "bg-red-50"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {importResult.success_count > 0 &&
                  importResult.error_count === 0 ? (
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : importResult.success_count > 0 &&
                    importResult.error_count > 0 ? (
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
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
                  )}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${
                      importResult.success_count > 0 &&
                      importResult.error_count === 0
                        ? "text-green-800"
                        : importResult.success_count > 0 &&
                          importResult.error_count > 0
                        ? "text-yellow-800"
                        : "text-red-800"
                    }`}
                  >
                    Import Complete
                  </h3>
                  <div className="mt-2 text-sm">
                    <p
                      className={
                        importResult.success_count > 0 &&
                        importResult.error_count === 0
                          ? "text-green-700"
                          : importResult.success_count > 0 &&
                            importResult.error_count > 0
                          ? "text-yellow-700"
                          : "text-red-700"
                      }
                    >
                      Successfully imported {importResult.success_count} papers.
                      {importResult.error_count > 0 &&
                        ` Failed to import ${importResult.error_count} papers.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Successfully Imported
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {importResult.success_count}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Failed to Import
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {importResult.error_count}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Attempted
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {importResult.success_count +
                              importResult.error_count}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error details */}
            {importResult.error_count > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">
                  Error Details
                </h4>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {importResult.errors.map((error, index) => (
                      <li key={index} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-primary truncate">
                            {error.title}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Error
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {typeof error.errors === "string" ? (
                            <p>{error.errors}</p>
                          ) : (
                            <ul className="list-disc list-inside space-y-1">
                              {Object.entries(error.errors).map(
                                ([field, msgs], i) => (
                                  <li key={i}>
                                    <span className="font-medium">
                                      {field}:
                                    </span>{" "}
                                    {Array.isArray(msgs)
                                      ? msgs.join(", ")
                                      : msgs}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-8 flex justify-end space-x-3 border-t border-gray-200 pt-6">
          {step === "upload" && (
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
          )}

          {step === "preview" && (
            <>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Back
              </button>
              <button
                type="button"
                onClick={startImport}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Start Import
              </button>
            </>
          )}

          {step === "results" && (
            <>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Import More Papers
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = "/admin/papers")}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                View All Papers
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
