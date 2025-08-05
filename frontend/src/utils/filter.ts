import { ResearchPaper } from "../types/paper.types";

/**
 * Optimized partial keyword matching filter function with AND logic
 * 1. The user selects a list of keywords (chosenKeywords).
 * 2. Each item has a list of keywords (itemKeywords).
 * 3. An item should pass the filter if it contains ALL chosen keywords (AND logic), but it can have extra keywords.
 * 4. Matching should ignore order and treat keywords as case-insensitive.
 * 5. If chosenKeywords is empty, return true (no filtering applied).
 * 6. Optimize for large datasets by using Sets for lookups.
 */
function matchesKeywords(itemKeywords: string[], chosenKeywords: string[]): boolean {
  // If no keywords chosen, no filtering applied
  if (chosenKeywords.length === 0) {
    return true;
  }

  // Convert item keywords to lowercase Set for fast lookup
  const itemKeywordSet = new Set(
    itemKeywords.map(keyword => keyword.toLowerCase().trim())
  );

  // Check if ALL chosen keywords are present in item keywords (AND logic)
  return chosenKeywords.every(chosenKeyword => 
    itemKeywordSet.has(chosenKeyword.toLowerCase().trim())
  );
}

/**
 * Generic filter function that applies criteria to data array
 * Optimized for keyword filtering with Set-based lookups
 */
export function filter<T>(
  data: T[],
  criteria: Record<string, unknown>,
  keywordField: string = "keywords"
): T[] {
  return data.filter((item) => {
    return Object.entries(criteria).every(([key, value]) => {
      // Skip empty/null criteria
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return true;
      }

      const itemValue = (item as Record<string, unknown>)[key];

      // Only match keywords in the keywords array, not in abstract/title
      if (key === keywordField && Array.isArray((item as Record<string, unknown>)[keywordField]) && Array.isArray(value)) {
        // Extract keyword names from objects or use strings directly
        const itemKeywords = ((item as Record<string, unknown>)[keywordField] as (string | { name: string })[])
          .map((k) => typeof k === 'string' ? k : (k?.name || ''))
          .filter(Boolean); // Remove empty strings
        
        const chosenKeywords = value as string[];
        
        return matchesKeywords(itemKeywords, chosenKeywords);
      }

      // Handle date ranges
      if (
        value &&
        typeof value === 'object' &&
        'startDate' in value &&
        'endDate' in value
      ) {
        const dateRange = value as { startDate: Date | null; endDate: Date | null };
        
        if (!dateRange.startDate && !dateRange.endDate) {
          return true; // No date filtering if both are null
        }

        let itemDate: Date | null = null;
        if (typeof itemValue === "string" || typeof itemValue === "number" || itemValue instanceof Date) {
          itemDate = new Date(itemValue as string);
        }
        
        if (!itemDate || isNaN(itemDate.getTime())) {
          return false;
        }

        if (dateRange.startDate && itemDate < dateRange.startDate) {
          return false;
        }
        
        if (dateRange.endDate && itemDate > dateRange.endDate) {
          return false;
        }
        
        return true;
      }

      // Handle minimum number comparisons
      if (typeof value === 'number' && typeof itemValue === 'number') {
        return itemValue >= value;
      }

      // Direct comparison for other types
      return itemValue === value;
    });
  });
}

/**
 * Specialized filter function for research papers
 */
export function filterPapers(
  papers: ResearchPaper[],
  criteria: {
    keywords?: string[];
    dateRange?: { startDate: Date | null; endDate: Date | null };
    minCitations?: number;
  }
): ResearchPaper[] {
  const filterCriteria: Record<string, unknown> = {};

  if (criteria.keywords && criteria.keywords.length > 0) {
    filterCriteria.keywords = criteria.keywords;
  }

  if (criteria.dateRange && (criteria.dateRange.startDate || criteria.dateRange.endDate)) {
    filterCriteria.publicationDate = criteria.dateRange;
  }

  if (criteria.minCitations !== undefined && criteria.minCitations > 0) {
    filterCriteria.citationCount = criteria.minCitations;
  }

  return filter(papers, filterCriteria, "keywords");
}
