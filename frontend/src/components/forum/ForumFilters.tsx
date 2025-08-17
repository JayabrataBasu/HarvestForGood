import React, { useState, useEffect } from "react";

interface ForumFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    tags: string;
    dateFrom: string;
    dateTo: string;
  }) => void;
}

interface PopularTag {
  name: string;
  usage_count: number;
}

const ForumFilters: React.FC<ForumFiltersProps> = ({ onFiltersChange }) => {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  useEffect(() => {
    // Fetch popular tags
    fetch("/api/forum/tags/popular/?limit=15")
      .then((res) => res.json())
      .then((data) => setPopularTags(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Debounce filter changes
    const timeoutId = setTimeout(() => {
      onFiltersChange({ search, tags, dateFrom, dateTo });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, tags, dateFrom, dateTo, onFiltersChange]);

  const addTagToSearch = (tagName: string) => {
    const currentTags = tags.split(" ").filter((t) => t.trim());
    const newTag = `#${tagName}`;

    if (!currentTags.includes(newTag)) {
      const newTags = [...currentTags, newTag].join(" ");
      setTags(newTags);
    }
    setShowTagSuggestions(false);
  };

  const clearFilters = () => {
    setSearch("");
    setTags("");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters = search || tags || dateFrom || dateTo;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Posts
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles and content..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Tag Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            onFocus={() => setShowTagSuggestions(true)}
            placeholder="e.g., #organic #soil"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            Case sensitive • Multiple tags = AND search
          </div>

          {/* Tag Suggestions */}
          {showTagSuggestions && popularTags.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
              <div className="p-2 text-xs font-medium text-gray-500 border-b">
                Popular Tags
              </div>
              {popularTags.map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addTagToSearch(tag.name)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between text-sm"
                >
                  <span>#{tag.name}</span>
                  <span className="text-xs text-gray-500">
                    {tag.usage_count} posts
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="Filter posts from this date"
            placeholder="YYYY-MM-DD"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            title="Filter posts up to this date"
            placeholder="YYYY-MM-DD"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Popular Tags Display */}
      {popularTags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Popular Tags:
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.slice(0, 10).map((tag, index) => (
              <button
                key={index}
                onClick={() => addTagToSearch(tag.name)}
                className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-800 text-xs font-medium rounded-full transition-colors"
              >
                #{tag.name}
                <span className="ml-1 text-gray-500">({tag.usage_count})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumFilters;
