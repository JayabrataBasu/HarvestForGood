"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { researchAPI } from "@/lib/api";
import { PaperFilterParams, ResearchPaper } from "@/types/paper.types";
import Link from "next/link";

interface Column {
  key: string;
  header: string;
  sortable: boolean;
  render?: (paper: ResearchPaper) => React.ReactNode;
}

export default function PaperListTable() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters] = useState<PaperFilterParams>({});
  const [sortField, setSortField] = useState<string>("publication_date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);

  const router = useRouter();

  const columns: Column[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (paper) => (
        <div>
          <div className="font-medium text-primary-dark">{paper.title}</div>
          <div className="text-xs text-gray-500 mt-1">
            {paper.authors.map((a: { name: string }) => a.name).join(", ")}
          </div>
        </div>
      ),
    },
    {
      key: "publication_date",
      header: "Published",
      sortable: true,
      render: (paper) => (
        <span>
          {paper.publicationDate
            ? new Date(paper.publicationDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "methodology_type",
      header: "Methodology",
      sortable: true,
      render: (paper) => (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
          {paper.methodologyType}
        </span>
      ),
    },
    {
      key: "journal",
      header: "Journal",
      sortable: true,
    },
    {
      key: "citation_count",
      header: "Citations",
      sortable: true,
      render: (paper) => (
        <div className="flex items-center">
          <span className="mr-1">{paper.citationCount}</span>
          {paper.citationTrend === "increasing" && (
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          )}
          {paper.citationTrend === "decreasing" && (
            <svg
              className="w-4 h-4 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (paper) => (
        <div className="flex space-x-2">
          <Link
            href={`/admin/papers/edit/${paper.slug || paper.id}`}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Link>
          <Link
            href={`/research/papers/${paper.slug || paper.id}`}
            className="text-green-600 hover:text-green-800"
            title="View"
            target="_blank"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(paper.id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
      ),
    },
  ];

  // Set up debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch papers when filters, pagination or sorting changes
  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      setError("");

      try {
        // Prepare API parameters
        const params: PaperFilterParams = {
          ...filters,
          page: page.toString(),
          page_size: pageSize.toString(),
        };

        // Add search term if present
        if (debouncedSearch) {
          params.q = debouncedSearch;
        }

        // Add sorting
        if (sortField) {
          params.ordering = `${
            sortDirection === "desc" ? "-" : ""
          }${sortField}`;
        }

        const result = await researchAPI.fetchPapers(params);

        if (result.success && result.data) {
          setPapers(result.data.results);
          setTotalPages(Math.ceil(result.data.count / pageSize));
        } else {
          setError(result.message || "Failed to load research papers");
        }
      } catch (err) {
        setError("An error occurred while fetching papers.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [debouncedSearch, filters, page, pageSize, sortField, sortDirection]);

  const handleSort = (key: string) => {
    if (sortField === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(key);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPapers(papers.map((p) => p.id));
    } else {
      setSelectedPapers([]);
    }
  };

  const handleSelectPaper = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPapers([...selectedPapers, id]);
    } else {
      setSelectedPapers(selectedPapers.filter((p) => p !== id));
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this paper? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const result = await researchAPI.deletePaper(id);

      if (result.success) {
        // Remove from the current list
        setPapers(papers.filter((p) => p.id !== id));
        // Also remove from selected if present
        setSelectedPapers(selectedPapers.filter((p) => p !== id));
      } else {
        alert(`Failed to delete paper: ${result.message}`);
      }
    } catch (err) {
      console.error("Error deleting paper:", err);
      alert("An error occurred while deleting the paper.");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedPapers.length === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedPapers.length} selected papers? This action cannot be undone.`
      )
    ) {
      return;
    }

    let successCount = 0;
    let failCount = 0;

    setLoading(true);

    // Process deletions sequentially to avoid rate limiting
    for (const id of selectedPapers) {
      try {
        const result = await researchAPI.deletePaper(id);
        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        console.error(`Error deleting paper ${id}:`, err);
        failCount++;
      }
    }

    // Refresh the paper list
    const params: PaperFilterParams = {
      ...filters,
      page: page.toString(),
      page_size: pageSize.toString(),
    };

    if (debouncedSearch) {
      params.q = debouncedSearch;
    }

    try {
      const result = await researchAPI.fetchPapers(params);
      if (result.success && result.data) {
        setPapers(result.data.results);
        setTotalPages(Math.ceil(result.data.count / pageSize));
      }
    } catch (err) {
      console.error("Error refreshing papers:", err);
    }

    setLoading(false);
    setSelectedPapers([]);

    alert(
      `Deleted ${successCount} papers successfully. ${
        failCount > 0 ? `Failed to delete ${failCount} papers.` : ""
      }`
    );
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
          Research Papers
        </h2>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search papers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={() => router.push("/admin/papers/new")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Paper
          </button>
          <button
            onClick={() => router.push("/admin/papers/import")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Import Papers
          </button>
        </div>
      </div>

      {selectedPapers.length > 0 && (
        <div className="bg-blue-50 px-4 py-3 border-b border-blue-200 flex justify-between items-center">
          <span className="text-blue-700 text-sm">
            {selectedPapers.length} paper
            {selectedPapers.length !== 1 ? "s" : ""} selected
          </span>
          <button
            onClick={handleDeleteSelected}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Selected
          </button>
        </div>
      )}

      {loading && papers.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-500">Loading papers...</p>
        </div>
      ) : error ? (
        <div className="px-4 py-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-md">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        </div>
      ) : papers.length === 0 ? (
        <div className="px-4 py-12 text-center">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-4 text-gray-500">No papers found</p>
          {debouncedSearch && (
            <p className="mt-2 text-gray-400">
              Try adjusting your search or filters
            </p>
          )}
          <div className="mt-6">
            <Link
              href="/admin/papers/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Your First Paper
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        checked={
                          selectedPapers.length === papers.length &&
                          papers.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </div>
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.sortable ? (
                        <button
                          className="group inline-flex items-center hover:text-gray-700"
                          onClick={() => handleSort(column.key)}
                        >
                          {column.header}
                          <span className="flex-none rounded ml-1 group-hover:bg-gray-200 p-0.5">
                            {sortField === column.key &&
                            sortDirection === "asc" ? (
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            ) : sortField === column.key &&
                              sortDirection === "desc" ? (
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="h-4 w-4 text-transparent group-hover:text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                                />
                              </svg>
                            )}
                          </span>
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {papers.map((paper) => (
                  <tr key={paper.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        checked={selectedPapers.includes(paper.id)}
                        onChange={(e) =>
                          handleSelectPaper(paper.id, e.target.checked)
                        }
                      />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-3 py-4 whitespace-nowrap"
                      >
                        {column.render
                          ? column.render(paper)
                          : (paper as never)[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{papers.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      let pageNum = page;
                      // Show pages around the current page
                      if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      // Skip rendering if out of range
                      if (pageNum <= 0 || pageNum > totalPages) {
                        return null;
                      }

                      // Ellipsis for first page when current page is far ahead
                      if (i === 0 && pageNum > 1) {
                        return (
                          <React.Fragment key="first">
                            <button
                              onClick={() => setPage(1)}
                              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50`}
                            >
                              1
                            </button>
                            {pageNum > 2 && (
                              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                              </span>
                            )}
                          </React.Fragment>
                        );
                      }

                      // Ellipsis for last page when current page is far behind the end
                      if (i === 4 && pageNum < totalPages) {
                        return (
                          <React.Fragment key="last">
                            {pageNum < totalPages - 1 && (
                              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => setPage(totalPages)}
                              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50`}
                            >
                              {totalPages}
                            </button>
                          </React.Fragment>
                        );
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            page === pageNum
                              ? "z-10 bg-primary border-primary text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          } text-sm font-medium`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 ${
                      page === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
