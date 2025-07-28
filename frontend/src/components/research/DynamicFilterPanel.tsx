"use client";
import React, { useState, useEffect } from "react";

interface FilterOptions {
  methodology_types: string[];
  year_range: { min: number; max: number };
  years_available: number[];
  region_keywords: Array<{ id: number; name: string }>;
  general_keywords: Array<{ id: number; name: string }>;
  keyword_categories: Array<{
    id: number;
    name: string;
    description: string;
    keywords: Array<{ id: number; name: string }>;
  }>;
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

  const [expandedSections, setExpandedSections] = useState<string[]>(
    currentFilters.expandedSections || ["years", "methodology"]
  );

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

  const filteredKeywords = filterOptions.general_keywords.filter((keyword) =>
    keyword.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );

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

      {/* Keywords */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("keywords")}
          className="flex justify-between items-center w-full text-left"
        >
          <h3 className="font-medium text-gray-900">Keywords</h3>
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
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filteredKeywords.map((keyword) => (
                <label key={keyword.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.keywords.includes(keyword.name)}
                    onChange={() => handleKeywordToggle(keyword.name)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{keyword.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <button
        onClick={applyFilters}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Apply Filters
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
