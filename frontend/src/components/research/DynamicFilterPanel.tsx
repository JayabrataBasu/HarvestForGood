"use client";
import React, { useState } from "react";

interface FilterOptions {
  methodology_types: string[];
  year_range: { min: number; max: number };
  years_available: number[];
  region_keywords: Array<{ id: string; name: string }>;
  general_keywords: Array<{ id: string; name: string }>;
  keyword_categories: Array<{
    id: string;
    name: string;
    description: string;
    keywords: Array<{ id: string; name: string }>;
  }>;
  stats: {
    total_papers: number;
    total_regions: number;
    total_general_keywords: number;
  };
}

interface DynamicFilterPanelProps {
  filterOptions: FilterOptions;
  onFilterApply: (filters: any) => void;
  currentFilters: any;
}

export default function DynamicFilterPanel({
  filterOptions,
  onFilterApply,
  currentFilters,
}: DynamicFilterPanelProps) {
  const [filters, setFilters] = useState({
    year_from: currentFilters.year_from || null,
    year_to: currentFilters.year_to || null,
    methodology_type: currentFilters.methodology_type || [],
    keywords: currentFilters.keyword || [],
    regions: [],
    q: currentFilters.q || "",
  });

  const [expandedSections, setExpandedSections] = useState({
    methodology: true,
    regions: false,
    keywords: false,
  });

  const [keywordSearch, setKeywordSearch] = useState("");

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMethodologyChange = (methodology: string) => {
    setFilters((prev) => {
      const current = Array.isArray(prev.methodology_type)
        ? prev.methodology_type
        : [];
      const updated = current.includes(methodology)
        ? current.filter((m) => m !== methodology)
        : [...current, methodology];
      return { ...prev, methodology_type: updated };
    });
  };

  const handleKeywordChange = (keyword: string) => {
    setFilters((prev) => {
      const current = Array.isArray(prev.keywords) ? prev.keywords : [];
      const updated = current.includes(keyword)
        ? current.filter((k) => k !== keyword)
        : [...current, keyword];
      return { ...prev, keywords: updated };
    });
  };

  const handleRegionChange = (region: string) => {
    setFilters((prev) => {
      const current = Array.isArray(prev.regions) ? prev.regions : [];
      const updated = current.includes(region)
        ? current.filter((r) => r !== region)
        : [...current, region];
      return { ...prev, regions: updated };
    });
  };

  const applyFilters = () => {
    const apiFilters: any = {};

    if (filters.q) apiFilters.q = filters.q;
    if (filters.year_from) apiFilters.year_from = filters.year_from;
    if (filters.year_to) apiFilters.year_to = filters.year_to;
    if (filters.methodology_type.length > 0)
      apiFilters.methodology_type = filters.methodology_type;

    // Combine keywords and regions for the keyword filter
    const allKeywords = [...filters.keywords, ...filters.regions];
    if (allKeywords.length > 0) apiFilters.keyword = allKeywords;

    onFilterApply(apiFilters);
  };

  const resetFilters = () => {
    setFilters({
      year_from: null,
      year_to: null,
      methodology_type: [],
      keywords: [],
      regions: [],
      q: "",
    });
    setKeywordSearch("");
    onFilterApply({});
  };

  const getFilteredKeywords = () => {
    if (!keywordSearch.trim()) return filterOptions.general_keywords;

    return filterOptions.general_keywords.filter((keyword) =>
      keyword.name.toLowerCase().includes(keywordSearch.toLowerCase())
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <p className="text-sm text-gray-500 mt-1">
          {filterOptions.stats.total_papers} papers available
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Year Range Filter */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Year of Publication
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filters.year_from || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    year_from: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">From</option>
                {filterOptions.years_available.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={filters.year_to || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    year_to: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">To</option>
                {filterOptions.years_available.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs text-gray-500">
              Available: {filterOptions.year_range.min} -{" "}
              {filterOptions.year_range.max}
            </div>
          </div>
        </div>

        {/* Methodology Types */}
        <div>
          <button
            onClick={() => toggleSection("methodology")}
            className="w-full flex items-center justify-between text-left font-medium text-gray-900 mb-3"
          >
            <span>Data Type</span>
            <span className="text-gray-400">
              {expandedSections.methodology ? "−" : "+"}
            </span>
          </button>

          {expandedSections.methodology && (
            <div className="space-y-2">
              {filterOptions.methodology_types.map((methodology) => (
                <label
                  key={methodology}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={filters.methodology_type.includes(methodology)}
                    onChange={() => handleMethodologyChange(methodology)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{methodology}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Regions */}
        <div>
          <button
            onClick={() => toggleSection("regions")}
            className="w-full flex items-center justify-between text-left font-medium text-gray-900 mb-3"
          >
            <span>Region ({filterOptions.stats.total_regions})</span>
            <span className="text-gray-400">
              {expandedSections.regions ? "−" : "+"}
            </span>
          </button>

          {expandedSections.regions && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filterOptions.region_keywords.map((region) => (
                <label key={region.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.regions.includes(region.name)}
                    onChange={() => handleRegionChange(region.name)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{region.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Keywords */}
        <div>
          <button
            onClick={() => toggleSection("keywords")}
            className="w-full flex items-center justify-between text-left font-medium text-gray-900 mb-3"
          >
            <span>Keywords ({filterOptions.stats.total_general_keywords})</span>
            <span className="text-gray-400">
              {expandedSections.keywords ? "−" : "+"}
            </span>
          </button>

          {expandedSections.keywords && (
            <div className="space-y-3">
              {/* Keyword search */}
              <input
                type="text"
                placeholder="Search keywords..."
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              {/* Filtered keywords */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {getFilteredKeywords().map((keyword) => (
                  <label
                    key={keyword.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={filters.keywords.includes(keyword.name)}
                      onChange={() => handleKeywordChange(keyword.name)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {keyword.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Filters Summary */}
        {(filters.methodology_type.length > 0 ||
          filters.keywords.length > 0 ||
          filters.regions.length > 0) && (
          <div className="pt-4 border-t border-gray-200">
            <h5 className="font-medium text-gray-900 mb-2">
              Selected Filters:
            </h5>
            <div className="flex flex-wrap gap-1">
              {filters.methodology_type.map((method) => (
                <span
                  key={method}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {method}
                  <button
                    onClick={() => handleMethodologyChange(method)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.regions.map((region) => (
                <span
                  key={region}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {region}
                  <button
                    onClick={() => handleRegionChange(region)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {keyword}
                  <button
                    onClick={() => handleKeywordChange(keyword)}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={applyFilters}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
