import React, { useState, useEffect } from 'react';
import { PaperFilterOptions, MethodologyType, Keyword } from '../../types/paper.types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface PaperFilterProps {
  availableKeywords: Keyword[];
  onFilterChange: (filters: PaperFilterOptions) => void;
  initialFilters?: Partial<PaperFilterOptions>;
}

const PaperFilter: React.FC<PaperFilterProps> = ({
  availableKeywords,
  onFilterChange,
  initialFilters
}) => {
  const [filters, setFilters] = useState<PaperFilterOptions>({
    dateRange: {
      startDate: null,
      endDate: null,
    },
    methodologyTypes: [],
    keywords: [],
    minCitations: 0,
    ...initialFilters
  });
  
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleMethodologyChange = (type: MethodologyType) => {
    setFilters(prev => {
      if (prev.methodologyTypes.includes(type)) {
        return {
          ...prev,
          methodologyTypes: prev.methodologyTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          methodologyTypes: [...prev.methodologyTypes, type]
        };
      }
    });
  };

  const handleKeywordChange = (keywordName: string) => {
    setFilters(prev => {
      if (prev.keywords.includes(keywordName)) {
        return {
          ...prev,
          keywords: prev.keywords.filter(k => k !== keywordName)
        };
      } else {
        return {
          ...prev,
          keywords: [...prev.keywords, keywordName]
        };
      }
    });
  };

  const handleCitationChange = (value: number) => {
    setFilters(prev => ({
      ...prev,
      minCitations: value
    }));
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { startDate, endDate }
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {
        startDate: null,
        endDate: null,
      },
      methodologyTypes: [],
      keywords: [],
      minCitations: 0
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center w-full font-medium text-lg"
      >
        <span>Filter Research Papers</span>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-6">
          {/* Date range filter */}
          <div>
            <h3 className="font-medium mb-2">Publication Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DatePicker
                selected={filters.dateRange.startDate}
                onChange={(date) => handleDateRangeChange(date, filters.dateRange.endDate)}
                selectsStart
                startDate={filters.dateRange.startDate}
                endDate={filters.dateRange.endDate}
                placeholderText="Start Date"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <DatePicker
                selected={filters.dateRange.endDate}
                onChange={(date) => handleDateRangeChange(filters.dateRange.startDate, date)}
                selectsEnd
                startDate={filters.dateRange.startDate}
                endDate={filters.dateRange.endDate}
                minDate={filters.dateRange.startDate || undefined}
                placeholderText="End Date"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Methodology type filter */}
          <div>
            <h3 className="font-medium mb-2">Methodology Type</h3>
            <div className="flex flex-wrap gap-2">
              {(['qualitative', 'quantitative', 'mixed'] as MethodologyType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleMethodologyChange(type)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                    filters.methodologyTypes.includes(type)
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  } border hover:bg-opacity-80 transition-colors`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Keywords filter */}
          <div>
            <h3 className="font-medium mb-2">Keywords/Topics</h3>
            <div className="flex flex-wrap gap-2">
              {availableKeywords.map((keyword) => (
                <button
                  key={keyword.id}
                  onClick={() => handleKeywordChange(keyword.name)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    filters.keywords.includes(keyword.name)
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  } border hover:bg-opacity-80 transition-colors`}
                >
                  {keyword.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Citation threshold filter */}
          <div>
            <h3 className="font-medium mb-2">Minimum Citations: {filters.minCitations}</h3>
            <input
              type="range"
              min="0"
              max="100"
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
