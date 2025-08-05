import React, { useState, useEffect } from "react";
import { PaperFilterOptions } from "../../types/paper.types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * Define the KeywordCategory type locally if not exported from paper.types.
 */
type KeywordCategory = {
  id: string;
  name: string;
  keywords: { id: string; name: string }[];
};

interface PaperFilterProps {
  keywordCategories: KeywordCategory[];
  onFilterChange: (filters: PaperFilterOptions) => void;
  initialFilters?: Partial<PaperFilterOptions>;
}

const PaperFilter: React.FC<PaperFilterProps> = ({
  keywordCategories,
  onFilterChange,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<PaperFilterOptions>({
    dateRange: {
      startDate: null,
      endDate: null,
    },
    methodologyTypes: [], // Keep for backward compatibility but don't render
    keywords: [],
    minCitations: 0,
    ...initialFilters,
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  function toCapitalCase(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const handleKeywordChange = (keywordName: string) => {
    const capitalKeyword = toCapitalCase(keywordName);
    setFilters((prev) => {
      if (prev.keywords.includes(capitalKeyword)) {
        return {
          ...prev,
          keywords: prev.keywords.filter((k) => k !== capitalKeyword),
        };
      } else {
        return {
          ...prev,
          keywords: [...prev.keywords, capitalKeyword],
        };
      }
    });
  };

  const handleCitationChange = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      minCitations: value,
    }));
  };

  const handleDateRangeChange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { startDate, endDate },
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: { startDate: null, endDate: null },
      methodologyTypes: [],
      keywords: [],
      minCitations: 0,
    });
    setSearchTerm("");
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Filter keywords based on search term
  const getFilteredKeywords = () => {
    if (!searchTerm.trim()) {
      return null;
    }

    const term = searchTerm.toLowerCase();
    const results = keywordCategories.flatMap((category) =>
      category.keywords.filter((keyword) =>
        keyword.name.toLowerCase().includes(term)
      )
    );

    return results;
  };

  const filteredKeywords = getFilteredKeywords();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      {/* Search for keywords */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Basic filters always visible */}
      <div className="space-y-4">
        {/* Citation threshold filter */}
        <div>
          <h3 className="font-medium mb-2">
            Minimum Citations: {filters.minCitations}
          </h3>
          <input
            type="range"
            min="0"
            max="1000000"
            value={filters.minCitations}
            onChange={(e) => handleCitationChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100+</span>
          </div>
        </div>
      </div>

      {/* Expandable filters */}
      {isExpanded && (
        <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
          {/* Date range filter */}
          <div>
            <h3 className="font-medium mb-2">Publication Date</h3>
            <div className="flex space-x-2">
              <DatePicker
                selected={filters.dateRange.startDate}
                onChange={(date) =>
                  handleDateRangeChange(date, filters.dateRange.endDate)
                }
                selectsStart
                startDate={filters.dateRange.startDate}
                endDate={filters.dateRange.endDate}
                placeholderText="Start Date"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <DatePicker
                selected={filters.dateRange.endDate}
                onChange={(date) =>
                  handleDateRangeChange(filters.dateRange.startDate, date)
                }
                selectsEnd
                startDate={filters.dateRange.startDate}
                endDate={filters.dateRange.endDate}
                minDate={filters.dateRange.startDate || undefined}
                placeholderText="End Date"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Keywords section */}
          <div>
            <h3 className="font-medium mb-3">Keywords</h3>

            {/* Display search results if searching */}
            {filteredKeywords ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-2">
                  Search results ({filteredKeywords.length}):
                </p>
                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                  {filteredKeywords.map((keyword) => (
                    <button
                      key={keyword.id}
                      onClick={() => handleKeywordChange(keyword.name)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        filters.keywords.includes(toCapitalCase(keyword.name))
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      } border hover:bg-opacity-80 transition-colors`}
                    >
                      {toCapitalCase(keyword.name)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Display categories when not searching
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {keywordCategories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200 rounded-md overflow-hidden"
                  >
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="font-medium">{category.name}</span>
                      <svg
                        className={`h-5 w-5 transition-transform ${
                          expandedCategories.includes(category.id)
                            ? "transform rotate-180"
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

                    {expandedCategories.includes(category.id) && (
                      <div className="p-3 bg-white">
                        <div className="flex flex-wrap gap-2">
                          {category.keywords.map((keyword) => (
                            <button
                              key={keyword.id}
                              onClick={() => handleKeywordChange(keyword.name)}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                                filters.keywords.includes(
                                  toCapitalCase(keyword.name)
                                )
                                  ? "bg-blue-100 text-blue-800 border-blue-300"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                              } border hover:bg-opacity-80 transition-colors`}
                            >
                              {toCapitalCase(keyword.name)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected keywords display */}
          {filters.keywords.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">
                Selected Keywords ({filters.keywords.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {filters.keywords.map((keywordName) => (
                  <div
                    key={keywordName}
                    className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium flex items-center"
                  >
                    {keywordName}
                    <button
                      onClick={() => handleKeywordChange(keywordName)}
                      className="ml-1.5 text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Filters
            </button>

            <button
              onClick={() => onFilterChange(filters)}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperFilter;

// Example usage inside your filter logic:
