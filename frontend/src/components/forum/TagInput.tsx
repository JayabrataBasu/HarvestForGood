import React, { useState, useRef, useEffect } from "react";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onTagsChange,
  placeholder = "Add tags (e.g., #organic #soil)",
  maxTags = 10,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<
    Array<{ name: string; usage_count: number }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch tag suggestions when input changes
    if (inputValue.length > 1) {
      const searchTerm = inputValue.startsWith("#")
        ? inputValue.slice(1)
        : inputValue;
      fetch(`/api/forum/tags/?search=${encodeURIComponent(searchTerm)}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data.results || data);
          setShowSuggestions(true);
        })
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const addTag = (tagName: string) => {
    const cleanTag = tagName.trim().toLowerCase().replace(/^#+/, "");
    if (cleanTag && !tags.includes(cleanTag) && tags.length < maxTags) {
      onTagsChange([...tags, cleanTag]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: { name: string }) => {
    addTag(suggestion.name);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 min-h-[42px]">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
          >
            #{tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 outline-none min-w-[120px] bg-transparent"
          disabled={tags.length >= maxTags}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
            >
              <span>#{suggestion.name}</span>
              <span className="text-xs text-gray-500">
                {suggestion.usage_count} uses
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-1">
        {tags.length}/{maxTags} tags • Press Enter or Space to add tags
      </div>
    </div>
  );
};

export default TagInput;
