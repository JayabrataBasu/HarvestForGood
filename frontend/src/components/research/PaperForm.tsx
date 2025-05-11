"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { researchAPI } from "@/lib/api";
import {
  PaperFormData,
  ResearchPaper,
  Keyword,
  KeywordCategory,
  MethodologyType,
  CitationTrend,
} from "@/types/paper.types";
import { getFieldErrors } from "@/lib/errorHandler";

interface PaperFormProps {
  initialData?: ResearchPaper;
  isEditMode?: boolean;
}

export default function PaperForm({
  initialData,
  isEditMode = false,
}: PaperFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [keywordSearch, setKeywordSearch] = useState("");
  const [keywordCategories, setKeywordCategories] = useState<KeywordCategory[]>(
    []
  );
  const [allKeywords, setAllKeywords] = useState<Keyword[]>([]);
  const [filteredKeywords, setFilteredKeywords] = useState<Keyword[]>([]);
  const [authorSearchTerm, setAuthorSearchTerm] = useState("");
  const [authorSuggestions, setAuthorSuggestions] = useState<
    { id: string; name: string; affiliation?: string }[]
  >([]);

  // Form state
  const [formData, setFormData] = useState<PaperFormData>({
    title: "",
    abstract: "",
    authors: [{ name: "", affiliation: "" }],
    publication_date: "",
    methodology_type: "mixed",
    citation_count: 0,
    citation_trend: "stable",
    journal: "",
    keywords: [],
    download_url: "",
    doi: "",
    volume: "",
    issue: "",
    pages: "",
  });

  // Initialize the form with existing data if editing
  useEffect(() => {
    if (isEditMode && initialData) {
      const mappedData: PaperFormData = {
        title: initialData.title,
        abstract: initialData.abstract,
        authors: initialData.authors.map((author) => ({
          name: author.name,
          affiliation: author.affiliation || "",
          email: author.email || "",
        })),
        publication_date: initialData.publicationDate
          ? new Date(initialData.publicationDate).toISOString().split("T")[0]
          : "",
        methodology_type: initialData.methodologyType,
        citation_count: initialData.citationCount,
        citation_trend: initialData.citationTrend,
        journal: initialData.journal,
        keywords: initialData.keywords.map((kw) => ({ name: kw.name })),
        download_url: initialData.downloadUrl || "",
        doi: initialData.doi || "",
        volume: initialData.volume || "",
        issue: initialData.issue || "",
        pages: initialData.pages || "",
      };

      setFormData(mappedData);
    }
  }, [initialData, isEditMode]);

  // Load keywords and categories
  useEffect(() => {
    const loadKeywords = async () => {
      setLoading(true);
      try {
        // Fetch all keywords
        const keywordsResult = await researchAPI.fetchKeywords();
        if (keywordsResult.success && keywordsResult.data) {
          setAllKeywords(keywordsResult.data);
          setFilteredKeywords(keywordsResult.data);
        }

        // Fetch keyword categories if available
        try {
          const categoriesResult = await researchAPI.fetchKeywordCategories();
          if (categoriesResult.success && categoriesResult.data) {
            setKeywordCategories(categoriesResult.data);
          }
        } catch (err) {
          console.warn("Keyword categories not available:", err);
          // Not critical, so we don't show an error to the user
        }
      } catch (err) {
        console.error("Failed to load keywords:", err);
        setError("Failed to load keywords. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    loadKeywords();
  }, []);

  // Filter keywords when search term changes
  useEffect(() => {
    if (keywordSearch.trim() === "") {
      setFilteredKeywords(allKeywords);
    } else {
      const filtered = allKeywords.filter((keyword) =>
        keyword.name.toLowerCase().includes(keywordSearch.toLowerCase())
      );
      setFilteredKeywords(filtered);
    }
  }, [keywordSearch, allKeywords]);

  // Search for authors
  useEffect(() => {
    const searchAuthors = async () => {
      if (authorSearchTerm.trim().length < 2) {
        setAuthorSuggestions([]);
        return;
      }

      try {
        const result = await researchAPI.fetchAuthors(authorSearchTerm);
        if (result.success && result.data) {
          setAuthorSuggestions(result.data);
        }
      } catch (err) {
        console.error("Failed to search authors:", err);
      }
    };

    const timer = setTimeout(() => {
      searchAuthors();
    }, 300);

    return () => clearTimeout(timer);
  }, [authorSearchTerm]);

  // Form field change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Author field change handler
  const handleAuthorChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newAuthors = [...prev.authors];
      newAuthors[index] = { ...newAuthors[index], [field]: value };
      return { ...prev, authors: newAuthors };
    });

    // Clear error for authors
    if (formErrors.authors) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.authors;
        return newErrors;
      });
    }
  };

  // Add a new empty author
  const addAuthor = () => {
    setFormData((prev) => ({
      ...prev,
      authors: [...prev.authors, { name: "", affiliation: "", email: "" }],
    }));
  };

  // Remove an author at specified index
  const removeAuthor = (index: number) => {
    if (formData.authors.length <= 1) return; // Keep at least one author

    setFormData((prev) => {
      const newAuthors = [...prev.authors];
      newAuthors.splice(index, 1);
      return { ...prev, authors: newAuthors };
    });
  };

  // Use existing author from suggestions
  const selectAuthor = (
    index: number,
    author: { id: string; name: string; affiliation?: string }
  ) => {
    setFormData((prev) => {
      const newAuthors = [...prev.authors];
      newAuthors[index] = {
        name: author.name,
        affiliation: author.affiliation || "",
        email: "", // We don't typically get email from suggestions for privacy
      };
      return { ...prev, authors: newAuthors };
    });

    setAuthorSearchTerm("");
    setAuthorSuggestions([]);
  };

  // Toggle keyword selection
  const toggleKeyword = (keyword: Keyword) => {
    setFormData((prev) => {
      const isSelected = prev.keywords.some((k) => k.name === keyword.name);

      if (isSelected) {
        // Remove keyword
        return {
          ...prev,
          keywords: prev.keywords.filter((k) => k.name !== keyword.name),
        };
      } else {
        // Add keyword
        return {
          ...prev,
          keywords: [...prev.keywords, { name: keyword.name }],
        };
      }
    });

    // Clear error for keywords
    if (formErrors.keywords) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.keywords;
        return newErrors;
      });
    }
  };

  // Add custom keyword
  const addCustomKeyword = () => {
    if (!keywordSearch.trim()) return;

    const normalizedKeyword = keywordSearch.trim().toLowerCase();

    // Check if already added
    if (
      formData.keywords.some((k) => k.name.toLowerCase() === normalizedKeyword)
    ) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      keywords: [...prev.keywords, { name: keywordSearch.trim() }],
    }));

    setKeywordSearch("");
  };

  // Validate the form
  const validateForm = (): boolean => {
    const errors: Record<string, string[]> = {};

    // Required fields
    if (!formData.title.trim()) {
      errors.title = ["Title is required"];
    }

    if (!formData.abstract.trim()) {
      errors.abstract = ["Abstract is required"];
    }

    if (!formData.journal.trim()) {
      errors.journal = ["Journal name is required"];
    }

    if (!formData.publication_date) {
      errors.publication_date = ["Publication date is required"];
    }

    // Authors validation
    if (formData.authors.length === 0) {
      errors.authors = ["At least one author is required"];
    } else {
      for (let i = 0; i < formData.authors.length; i++) {
        if (!formData.authors[i].name.trim()) {
          errors.authors = errors.authors || [];
          errors.authors.push(`Author ${i + 1} name is required`);
          break;
        }
      }
    }

    // Keywords validation
    if (formData.keywords.length === 0) {
      errors.keywords = ["At least one keyword is required"];
    }

    // Additional validation for URL format
    if (formData.download_url && !isValidUrl(formData.download_url)) {
      errors.download_url = ["Please enter a valid URL"];
    }

    // DOI format validation (simple check)
    if (formData.doi && !formData.doi.includes("/")) {
      errors.doi = [
        "Please enter a valid DOI (should contain '/'), e.g., 10.1000/xyz123",
      ];
    }

    // Citation count should be non-negative
    if (formData.citation_count < 0) {
      errors.citation_count = ["Citation count cannot be negative"];
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // URL format validation helper
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        const element = document.getElementsByName(firstErrorField)[0];
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let result;

      if (isEditMode && initialData) {
        // Update existing paper
        result = await researchAPI.updatePaper(
          initialData.slug || initialData.id,
          formData
        );
      } else {
        // Create new paper
        result = await researchAPI.createPaper(formData);
      }

      if (result.success) {
        // Redirect on success
        if (isEditMode) {
          router.push(`/admin/papers`);
        } else {
          router.push(`/admin/papers`);
        }
      } else {
        setError(result.message || "Failed to save paper");

        // Handle field-specific errors from the API
        if (result.error && result.error.fieldErrors) {
          setFormErrors(result.error.fieldErrors);
        }
      }
    } catch (err) {
      console.error("Error saving paper:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditMode ? "Edit Research Paper" : "Add New Research Paper"}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 my-4">
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
      )}

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-8">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.title ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Enter the full title of the research paper"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.title[0]}
                  </p>
                )}
              </div>

              {/* Abstract */}
              <div>
                <label
                  htmlFor="abstract"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Abstract <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="abstract"
                  id="abstract"
                  rows={4}
                  value={formData.abstract}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.abstract ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Provide a summary of the research paper"
                ></textarea>
                {formErrors.abstract && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.abstract[0]}
                  </p>
                )}
              </div>

              {/* Journal */}
              <div>
                <label
                  htmlFor="journal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Journal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="journal"
                  id="journal"
                  value={formData.journal}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.journal ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Name of the journal"
                />
                {formErrors.journal && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.journal[0]}
                  </p>
                )}
              </div>

              {/* Publication Date */}
              <div>
                <label
                  htmlFor="publication_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Publication Date <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="publication_date"
                    id="publication_date"
                    value={formData.publication_date}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.publication_date
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  />
                  <div>
                    <label
                      htmlFor="publication_year"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Publication Year
                    </label>
                    <input
                      type="number"
                      name="publication_year"
                      id="publication_year"
                      placeholder="e.g., 2023"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.publication_year || ""}
                      onChange={(e) => {
                        const year = parseInt(e.target.value);
                        // Set both year and date for compatibility
                        setFormData({
                          ...formData,
                          publication_year: year,
                          publication_date: year
                            ? `${year}-01-01`
                            : formData.publication_date,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                {formErrors.publication_date && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.publication_date[0]}
                  </p>
                )}
              </div>

              {/* Methodology Type */}
              <div>
                <label
                  htmlFor="methodology_type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Methodology Type
                </label>
                <select
                  name="methodology_type"
                  id="methodology_type"
                  value={formData.methodology_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="qualitative">Qualitative</option>
                  <option value="quantitative">Quantitative</option>
                  <option value="mixed">Mixed Methods</option>
                </select>
              </div>

              {/* Citation Count */}
              <div>
                <label
                  htmlFor="citation_count"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Citation Count
                </label>
                <input
                  type="number"
                  name="citation_count"
                  id="citation_count"
                  min="0"
                  value={formData.citation_count}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.citation_count
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                />
                {formErrors.citation_count && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.citation_count[0]}
                  </p>
                )}
              </div>

              {/* Citation Trend */}
              <div>
                <label
                  htmlFor="citation_trend"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Citation Trend
                </label>
                <select
                  name="citation_trend"
                  id="citation_trend"
                  value={formData.citation_trend}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="increasing">Increasing</option>
                  <option value="stable">Stable</option>
                  <option value="decreasing">Decreasing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Authors Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Authors <span className="text-red-500">*</span>
              </h3>
              <button
                type="button"
                onClick={addAuthor}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg
                  className="h-4 w-4 mr-1"
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
                Add Author
              </button>
            </div>

            {formErrors.authors && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                {formErrors.authors.map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              {formData.authors.map((author, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4 bg-white"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Author {index + 1}
                    </h4>
                    {formData.authors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAuthor(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg
                          className="h-5 w-5"
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
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Author Name */}
                    <div className="relative">
                      <label
                        htmlFor={`author-name-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`author-name-${index}`}
                        value={author.name}
                        onChange={(e) => {
                          handleAuthorChange(index, "name", e.target.value);
                          if (e.target.value.length >= 2) {
                            setAuthorSearchTerm(e.target.value);
                          } else {
                            setAuthorSearchTerm("");
                          }
                        }}
                        placeholder="Author name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />

                      {/* Author suggestions dropdown */}
                      {authorSuggestions.length > 0 &&
                        index === formData.authors.length - 1 && (
                          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                            {authorSuggestions.map((suggestion) => (
                              <div
                                key={suggestion.id}
                                className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                                onClick={() => selectAuthor(index, suggestion)}
                              >
                                <div className="font-medium">
                                  {suggestion.name}
                                </div>
                                {suggestion.affiliation && (
                                  <div className="text-xs text-gray-500">
                                    {suggestion.affiliation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* Author Affiliation */}
                    <div>
                      <label
                        htmlFor={`author-affiliation-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Affiliation
                      </label>
                      <input
                        type="text"
                        id={`author-affiliation-${index}`}
                        value={author.affiliation}
                        onChange={(e) =>
                          handleAuthorChange(
                            index,
                            "affiliation",
                            e.target.value
                          )
                        }
                        placeholder="University or organization"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>

                    {/* Author Email */}
                    <div>
                      <label
                        htmlFor={`author-email-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id={`author-email-${index}`}
                        value={author.email || ""}
                        onChange={(e) =>
                          handleAuthorChange(index, "email", e.target.value)
                        }
                        placeholder="Optional contact email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Keywords <span className="text-red-500">*</span>
            </h3>

            {formErrors.keywords && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                {formErrors.keywords.map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              {/* Selected keywords */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No keywords selected yet
                    </p>
                  ) : (
                    formData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {keyword.name}
                        <button
                          type="button"
                          onClick={() =>
                            toggleKeyword({
                              id: `temp-${index}`,
                              name: keyword.name,
                            })
                          }
                          className="ml-1.5 -mr-1 h-5 w-5 text-green-400 hover:text-green-600"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Search/Add keywords */}
              <div className="mb-4">
                <label
                  htmlFor="keyword-search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search or Add Keywords
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="keyword-search"
                    value={keywordSearch}
                    onChange={(e) => setKeywordSearch(e.target.value)}
                    placeholder="Search existing or add new keyword"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={addCustomKeyword}
                    disabled={!keywordSearch.trim()}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Keyword list */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Available Keywords
                </h4>

                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {keywordCategories.length > 0 ? (
                      // Display keywords by category
                      <div className="space-y-4">
                        {keywordCategories.map((category) => (
                          <div key={category.id}>
                            <h5 className="text-sm font-medium text-gray-600 mb-2">
                              {category.name}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {category.keywords
                                .filter(
                                  (kw) =>
                                    !keywordSearch ||
                                    kw.name
                                      .toLowerCase()
                                      .includes(keywordSearch.toLowerCase())
                                )
                                .map((keyword) => {
                                  const isSelected = formData.keywords.some(
                                    (k) => k.name === keyword.name
                                  );
                                  return (
                                    <button
                                      key={keyword.id}
                                      type="button"
                                      onClick={() => toggleKeyword(keyword)}
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        isSelected
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                      }`}
                                    >
                                      {keyword.name}
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Display all keywords without categories
                      <div className="flex flex-wrap gap-2">
                        {filteredKeywords.length > 0 ? (
                          filteredKeywords.map((keyword) => {
                            const isSelected = formData.keywords.some(
                              (k) => k.name === keyword.name
                            );
                            return (
                              <button
                                key={keyword.id}
                                type="button"
                                onClick={() => toggleKeyword(keyword)}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  isSelected
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                              >
                                {keyword.name}
                              </button>
                            );
                          })
                        ) : keywordSearch ? (
                          <p className="text-sm text-gray-500 py-2">
                            No matching keywords. You can add "{keywordSearch}"
                            as a new keyword.
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500 py-2">
                            No keywords available. Try adding some.
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Additional Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              {/* DOI */}
              <div>
                <label
                  htmlFor="doi"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  DOI (Digital Object Identifier)
                </label>
                <input
                  type="text"
                  name="doi"
                  id="doi"
                  value={formData.doi}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.doi ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="e.g., 10.1000/xyz123"
                />
                {formErrors.doi && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.doi[0]}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Format: 10.xxxx/xxxxx
                </p>
              </div>

              {/* Download URL */}
              <div>
                <label
                  htmlFor="download_url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Download URL
                </label>
                <input
                  type="text"
                  name="download_url"
                  id="download_url"
                  value={formData.download_url}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.download_url
                      ? "border-red-300"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="https://example.com/paper.pdf"
                />
                {formErrors.download_url && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.download_url[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Volume */}
                <div>
                  <label
                    htmlFor="volume"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Volume
                  </label>
                  <input
                    type="text"
                    name="volume"
                    id="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., 12"
                  />
                </div>

                {/* Issue */}
                <div>
                  <label
                    htmlFor="issue"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Issue
                  </label>
                  <input
                    type="text"
                    name="issue"
                    id="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., 3"
                  />
                </div>

                {/* Pages */}
                <div>
                  <label
                    htmlFor="pages"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pages
                  </label>
                  <input
                    type="text"
                    name="pages"
                    id="pages"
                    value={formData.pages}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., 123-145"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center">
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
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update Paper"
              ) : (
                "Save Paper"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
