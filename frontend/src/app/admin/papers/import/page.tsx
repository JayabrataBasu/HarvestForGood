"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CsvImportComponent from "@/components/research/CsvImportComponent";
import { isAuthenticated } from "@/lib/api";

export default function ImportPapersPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login?next=/admin/papers/import");
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bulk Import Research Papers
            </h1>
            <p className="mt-2 text-gray-600">
              Import multiple research papers at once using a CSV file.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/papers")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
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
            Back to Papers
          </button>
        </div>

        <CsvImportComponent />

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            CSV Import Guidelines
          </h2>

          <div className="prose max-w-none">
            <p>
              The CSV file should have the following columns. Required columns
              are marked with an asterisk (*).
            </p>

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Column
                    </th>
                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Format
                    </th>
                    <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Example
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      title *
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Full title of the paper
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">Text</td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      "Impact of Urban Farming on Food Security"
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      abstract *
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Paper abstract
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">Text</td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      "This study examines how urban farming..."
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      journal *
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Journal name
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">Text</td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      "Journal of Sustainable Agriculture"
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      publication_date *
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Date of publication
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      YYYY-MM-DD
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      "2023-05-15"
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      authors *
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Paper authors with affiliations
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Name (Affiliation); Name (Affiliation)
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      "Dr. Jane Smith (University of California); Prof. Robert
                      Johnson (Stanford)"
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      keywords *
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Paper keywords
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Keyword1; Keyword2; Keyword3
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      "Urban Farming; Food Security; Sustainability"
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      methodology_type
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Research methodology
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      qualitative, quantitative, or mixed
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">"mixed"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      citation_count
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Number of citations
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">Number</td>
                    <td className="px-3 py-3 text-sm text-gray-500">"12"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      citation_trend
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Citation trend
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      increasing, stable, or decreasing
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      "increasing"
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      doi
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Digital Object Identifier
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      10.xxxx/xxxxx
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      "10.1234/example.2023.001"
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      download_url
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      URL to download the paper
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">URL</td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      "https://example.com/paper.pdf"
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      volume
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Journal volume
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">Text</td>
                    <td className="px-3 py-3 text-sm text-gray-500">"45"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      issue
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Journal issue
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">Text</td>
                    <td className="px-3 py-3 text-sm text-gray-500">"3"</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      pages
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      Page range
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500">Text</td>
                    <td className="px-3 py-3 text-sm text-gray-500">
                      "123-145"
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                Best Practices
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>
                  Ensure your CSV file has headers that match exactly the column
                  names listed above
                </li>
                <li>
                  For large imports, consider importing in batches of 50-100
                  papers
                </li>
                <li>
                  Make sure text fields that may contain commas are properly
                  quoted
                </li>
                <li>Use ISO date format (YYYY-MM-DD) for publication dates</li>
                <li>Separate multiple authors and keywords with semicolons</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
