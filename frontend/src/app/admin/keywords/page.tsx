"use client";
import React, { useState, useEffect } from "react";
import { researchAPI } from "@/lib/api";
import { Keyword, KeywordCategory } from "@/types/paper.types";

export default function KeywordManagement() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [keywordCategories, setKeywordCategories] = useState<KeywordCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [categoryFormVisible, setCategoryFormVisible] = useState(false);

  // Form states
  const [keywordName, setKeywordName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  // Fetch all keywords and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch keywords
        const keywordsResult = await researchAPI.fetchKeywords();
        if (keywordsResult.success && keywordsResult.data) {
          setKeywords(keywordsResult.data);
        } else {
          throw new Error(keywordsResult.message || "Failed to fetch keywords");
        }

        // Try to fetch categories if available
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
        console.error("Error loading keyword data:", err);
        setError("Failed to load keywords. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter keywords based on search term
  const filteredKeywords = keywords.filter((keyword) =>
    keyword.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group keywords by category
  const keywordsByCategory: Record<string, Keyword[]> = {};

  // Add an "Uncategorized" group
  keywordsByCategory["uncategorized"] = [];

  // Add a group for each category
  keywordCategories.forEach((category) => {
    keywordsByCategory[category.id] = [];
  });

  // Group keywords
  filteredKeywords.forEach((keyword) => {
    // In a real app, each keyword would have a categoryId property
    // For this example, we'll assign all to uncategorized
    const categoryId = "uncategorized";
    // Ensure the array exists before pushing
    if (!keywordsByCategory[categoryId]) {
      keywordsByCategory[categoryId] = [];
    }
    keywordsByCategory[categoryId].push(keyword);
  });

  // Handle selecting a keyword for editing
  const handleSelectKeyword = (keyword: Keyword) => {
    setSelectedKeyword(keyword);
    setKeywordName(keyword.name);
    setSelectedCategoryId("uncategorized"); // Default value, would use actual category in real app
    setIsEditing(true);
    setShowAddForm(true);
  };

  // Handle keyword form submission (add or update)
  const handleSubmitKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywordName.trim()) return;

    setLoading(true);
    try {
      if (isEditing && selectedKeyword) {
        // Update existing keyword
        // In a real app, you would call an API method like:
        // await researchAPI.updateKeyword(selectedKeyword.id, { name: keywordName, categoryId: selectedCategoryId });

        // For now, just update the local state
        setKeywords((prevKeywords) =>
          prevKeywords.map((kw) =>
            kw.id === selectedKeyword.id ? { ...kw, name: keywordName } : kw
          )
        );
      } else {
        // Add new keyword
        // In a real app, you would call an API method like:
        // const result = await researchAPI.createKeyword({ name: keywordName, categoryId: selectedCategoryId });

        // For now, just add to the local state with a fake ID
        const newKeyword: Keyword = {
          id: `temp-${Date.now()}`,
          name: keywordName,
        };
        setKeywords((prevKeywords) => [...prevKeywords, newKeyword]);
      }

      // Reset form
      setKeywordName("");
      setSelectedCategoryId("");
      setSelectedKeyword(null);
      setIsEditing(false);
      setShowAddForm(false);
    } catch (err) {
      console.error("Error saving keyword:", err);
      setError("Failed to save keyword. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle category form submission
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    try {
      // In a real app, you would call an API method like:
      // const result = await researchAPI.createKeywordCategory({ name: newCategoryName });

      // For now, just add to the local state with a fake ID
      const newCategory: KeywordCategory = {
        id: `temp-${Date.now()}`,
        name: newCategoryName,
        keywords: [],
      };
      setKeywordCategories((prevCategories) => [
        ...prevCategories,
        newCategory,
      ]);

      // Reset form
      setNewCategoryName("");
      setCategoryFormVisible(false);
    } catch (err) {
      console.error("Error saving category:", err);
      setError("Failed to save category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle keyword deletion
  const handleDeleteKeyword = async (keyword: Keyword) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the keyword "${keyword.name}"?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would call an API method like:
      // await researchAPI.deleteKeyword(keyword.id);

      // For now, just remove from the local state
      setKeywords((prevKeywords) =>
        prevKeywords.filter((kw) => kw.id !== keyword.id)
      );
    } catch (err) {
      console.error("Error deleting keyword:", err);
      setError("Failed to delete keyword. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Keyword Management
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Organize research papers by managing keywords and categories
      </p>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
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

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex-grow">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search keywords
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search keywords"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(true);
                setIsEditing(false);
                setKeywordName("");
                setSelectedKeyword(null);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add Keyword
            </button>

            <button
              type="button"
              onClick={() => setCategoryFormVisible(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Keyword add/edit form */}
        {showAddForm && (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              {isEditing ? "Edit Keyword" : "Add New Keyword"}
            </h3>
            <form onSubmit={handleSubmitKeyword} className="space-y-4">
              <div>
                <label
                  htmlFor="keyword-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Keyword Name
                </label>
                <input
                  type="text"
                  name="keyword-name"
                  id="keyword-name"
                  value={keywordName}
                  onChange={(e) => setKeywordName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Enter keyword name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                >
                  <option value="uncategorized">Uncategorized</option>
                  {keywordCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setIsEditing(false);
                    setSelectedKeyword(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {isEditing ? "Update" : "Add"} Keyword
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Category add form */}
        {categoryFormVisible && (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Add New Category
            </h3>
            <form onSubmit={handleSubmitCategory} className="space-y-4">
              <div>
                <label
                  htmlFor="category-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  name="category-name"
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setCategoryFormVisible(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Keywords list */}
        <div className="border-t border-gray-200">
          {loading && keywords.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-500">Loading keywords...</p>
            </div>
          ) : keywords.length === 0 ? (
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No keywords found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new keyword.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(true);
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Keyword
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Render keywords by category */}
              {Object.entries(keywordsByCategory).map(
                ([categoryId, categoryKeywords]) => {
                  if (categoryKeywords.length === 0) return null;

                  const category = keywordCategories.find(
                    (c) => c.id === categoryId
                  );
                  const categoryName = category
                    ? category.name
                    : "Uncategorized";

                  return (
                    <div
                      key={categoryId}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <div className="bg-gray-50 px-4 py-3">
                        <h3 className="text-sm font-medium text-gray-700">
                          {categoryName}
                        </h3>
                      </div>

                      <ul className="divide-y divide-gray-200">
                        {categoryKeywords.map((keyword) => (
                          <li
                            key={keyword.id}
                            className="flex items-center justify-between py-3 px-4 hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900 font-medium">
                                {keyword.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => handleSelectKeyword(keyword)}
                                className="text-blue-600 hover:text-blue-800"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteKeyword(keyword)}
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
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
