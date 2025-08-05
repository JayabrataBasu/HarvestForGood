"use client";
import React, { useState, useEffect } from "react";

interface FilterOptions {
  methodology_types: string[];
  year_range: { min: number; max: number };
  years_available: number[];
  keyword_categories: Array<{
    id: string | number;
    name: string;
    description: string;
    keywords: Array<{ id: number; name: string }>;
  }>;
  stats: {
    total_papers: number;
    total_categories: number;
    total_keywords: number;
  };
}

interface DynamicFilterPanelProps {
  filterOptions: FilterOptions;
  onFilterApply: (
    filters: Partial<{
      year_from: number;
      year_to: number;
      methodology_type: string[];
      keyword: string[];
      regions: string[];
    }>
  ) => void;
  currentFilters: Partial<{
    year_from: number;
    year_to: number;
    methodology_type: string[];
    keyword: string[];
    regions: string[];
    expandedSections: string[];
  }>;
}

const DynamicFilterPanel: React.FC<DynamicFilterPanelProps> = ({
  filterOptions,
  onFilterApply,
  currentFilters,
}) => {
  interface FiltersState {
    yearRange: { start: number; end: number };
    methodology_types: string[];
    keywords: string[];
    regions: string[];
    searchTerm: string;
  }

  const [filters, setFilters] = useState<FiltersState>({
    yearRange: {
      start: filterOptions.year_range.min,
      end: filterOptions.year_range.max,
    },
    methodology_types: [],
    keywords: [],
    regions: [],
    searchTerm: "",
  });

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>(
    currentFilters.expandedSections || ["years", "methodology"]
  );
  const [keywordLogic, setKeywordLogic] = useState<"and" | "or">("and");

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      yearRange: {
        start: currentFilters.year_from || filterOptions.year_range.min,
        end: currentFilters.year_to || filterOptions.year_range.max,
      },
      methodology_types: currentFilters.methodology_type || [],
      keywords: currentFilters.keyword || [],
      regions: currentFilters.regions || [],
    }));
  }, [
    currentFilters,
    filterOptions.year_range.min,
    filterOptions.year_range.max,
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Replace handleYearChange to handle direct input
  const handleYearInputChange = (type: "start" | "end", value: string) => {
    const year =
      parseInt(value) ||
      (type === "start"
        ? filterOptions.year_range.min
        : filterOptions.year_range.max);
    setFilters((prev) => ({
      ...prev,
      yearRange: {
        ...prev.yearRange,
        [type]: Math.max(
          filterOptions.year_range.min,
          Math.min(year, filterOptions.year_range.max)
        ),
      },
    }));
  };

  const handleMethodologyToggle = (methodology: string) => {
    setFilters((prev) => ({
      ...prev,
      methodology_types: prev.methodology_types.includes(methodology)
        ? prev.methodology_types.filter((m) => m !== methodology)
        : [...prev.methodology_types, methodology],
    }));
  };

  const handleKeywordToggle = (keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      keywords: prev.keywords.includes(keyword)
        ? prev.keywords.filter((k) => k !== keyword)
        : [...prev.keywords, keyword],
    }));
  };

  const handleRegionToggle = (region: string) => {
    setFilters((prev) => ({
      ...prev,
      regions: prev.regions.includes(region)
        ? prev.regions.filter((r) => r !== region)
        : [...prev.regions, region],
    }));
  };

  const applyFilters = () => {
    const apiFilters: Partial<{
      year_from: number;
      year_to: number;
      methodology_type: string[];
      keyword: string[];
      regions: string[];
      keyword_logic: string;
    }> = {};

    if (filters.yearRange.start !== filterOptions.year_range.min) {
      apiFilters.year_from = filters.yearRange.start;
    }
    if (filters.yearRange.end !== filterOptions.year_range.max) {
      apiFilters.year_to = filters.yearRange.end;
    }
    if (filters.methodology_types.length > 0) {
      apiFilters.methodology_type = filters.methodology_types;
    }
    if (filters.keywords.length > 0) {
      apiFilters.keyword = filters.keywords;
      apiFilters.keyword_logic = keywordLogic;
    }
    if (filters.regions.length > 0) {
      apiFilters.keyword = [...(apiFilters.keyword || []), ...filters.regions];
    }

    onFilterApply(apiFilters);
  };

  const resetFilters = () => {
    setFilters({
      yearRange: {
        start: filterOptions.year_range.min,
        end: filterOptions.year_range.max,
      },
      methodology_types: [],
      keywords: [],
      regions: [],
      searchTerm: "",
    });
    onFilterApply({});
  };

  // Only use keywords from the "Region" category for the Regions filter
  const regionCategory = filterOptions.keyword_categories.find(
    (cat) => cat.name.toLowerCase() === "region"
  );
  const regionKeywords = regionCategory ? regionCategory.keywords : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Reset All
        </button>
      </div>

      {/* Year Range Slider */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("years")}
          className="flex justify-between items-center w-full text-left"
        >
          <h3 className="font-medium text-gray-900">Year of Publication</h3>
          <svg
            className={`h-5 w-5 transition-transform ${
              expandedSections.includes("years") ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {expandedSections.includes("years") && (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex flex-col">
                <label
                  htmlFor="year-start"
                  className="text-sm text-gray-700 mb-1"
                >
                  From Year
                </label>
                <input
                  id="year-start"
                  type="number"
                  min={filterOptions.year_range.min}
                  max={filterOptions.year_range.max}
                  value={filters.yearRange.start}
                  onChange={(e) =>
                    handleYearInputChange("start", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md w-28"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="year-end"
                  className="text-sm text-gray-700 mb-1"
                >
                  To Year
                </label>
                <input
                  id="year-end"
                  type="number"
                  min={filterOptions.year_range.min}
                  max={filterOptions.year_range.max}
                  value={filters.yearRange.end}
                  onChange={(e) => handleYearInputChange("end", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md w-28"
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{filterOptions.year_range.min}</span>
              <span>{filterOptions.year_range.max}</span>
            </div>
          </div>
        )}
      </div>

      {/* Methodology Types */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("methodology")}
          className="flex justify-between items-center w-full text-left"
        >
          <h3 className="font-medium text-gray-900">Methodology Types</h3>
          <svg
            className={`h-5 w-5 transition-transform ${
              expandedSections.includes("methodology") ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {expandedSections.includes("methodology") && (
          <div className="space-y-2">
            {filterOptions.methodology_types.map((methodology) => (
              <label key={methodology} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.methodology_types.includes(methodology)}
                  onChange={() => handleMethodologyToggle(methodology)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{methodology}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Regions */}
      {regionKeywords.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection("regions")}
            className="flex justify-between items-center w-full text-left"
          >
            <h3 className="font-medium text-gray-900">Regions</h3>
            <svg
              className={`h-5 w-5 transition-transform ${
                expandedSections.includes("regions") ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {expandedSections.includes("regions") && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {regionKeywords.map((region) => (
                <label key={region.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.regions.includes(region.name)}
                    onChange={() => handleRegionToggle(region.name)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{region.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Keywords by Categories */}
      <div className="space-y-3">
        <div className="flex items-center mb-2">
          <span className="text-xs text-gray-500 mr-2">Keyword Match:</span>
          <button
            type="button"
            className={`px-2 py-1 rounded-l border ${
              keywordLogic === "and"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setKeywordLogic("and")}
          >
            ALL
          </button>
          <button
            type="button"
            className={`px-2 py-1 rounded-r border ${
              keywordLogic === "or"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setKeywordLogic("or")}
          >
            ANY
          </button>
        </div>

        <button
          onClick={() => toggleSection("keywords")}
          className="flex justify-between items-center w-full text-left"
        >
          <h3 className="font-medium text-gray-900">
            Keywords by Category ({filters.keywords.length} selected)
          </h3>
          <svg
            className={`h-5 w-5 transition-transform ${
              expandedSections.includes("keywords") ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {expandedSections.includes("keywords") && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search keywords..."
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {filterOptions.keyword_categories.map((category) => {
                const filteredKeywords = category.keywords.filter((keyword) =>
                  keyword.name
                    .toLowerCase()
                    .includes(filters.searchTerm.toLowerCase())
                );

                if (filteredKeywords.length === 0 && filters.searchTerm)
                  return null;

                return (
                  <div
                    key={category.id}
                    className="border border-gray-200 rounded-md"
                  >
                    <button
                      onClick={() => toggleCategory(String(category.id))}
                      className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 text-left rounded-t-md"
                    >
                      <div>
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({filteredKeywords.length} keywords)
                        </span>
                      </div>
                      <svg
                        className={`h-4 w-4 transition-transform ${
                          expandedCategories.includes(String(category.id))
                            ? "rotate-180"
                            : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {expandedCategories.includes(String(category.id)) && (
                      <div className="p-3 border-t border-gray-200 bg-white rounded-b-md">
                        <div className="grid grid-cols-1 gap-2">
                          {filteredKeywords.map((keyword) => (
                            <label
                              key={keyword.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={filters.keywords.includes(
                                  keyword.name
                                )}
                                onChange={() =>
                                  handleKeywordToggle(keyword.name)
                                }
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
                );
              })}
            </div>

            {/* Selected Keywords Summary */}
            {filters.keywords.length > 0 && (
              <div className="border-t pt-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Selected Keywords ({filters.keywords.length}):
                </h4>
                <div className="flex flex-wrap gap-1">
                  {filters.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {keyword}
                      <button
                        onClick={() => handleKeywordToggle(keyword)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apply Button */}
      <button
        onClick={applyFilters}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Apply Filters
        {(filters.keywords.length > 0 ||
          filters.methodology_types.length > 0) && (
          <span className="ml-2 bg-blue-500 px-2 py-1 rounded-full text-xs">
            {filters.keywords.length + filters.methodology_types.length}
          </span>
        )}
      </button>

      {/* Custom CSS for dual range slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default DynamicFilterPanel;
