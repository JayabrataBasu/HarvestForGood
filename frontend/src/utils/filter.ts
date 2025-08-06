import { ResearchPaper } from "../types/paper.types";

/**
 * CANONICAL AND LOGIC FILTER FUNCTION
 * 
 * This function mirrors backend AND logic and serves as the single source of truth for client filtering.
 * 
 * Filters research papers to return only those containing ALL chosen keywords.
 * Uses Set-based lookup for optimal performance with large datasets.
 * 
 * @param papers - Array of research papers to filter
 * @param chosenKeywords - Array of keywords that ALL must be present in each paper
 * @returns Filtered array of papers containing all chosen keywords
 * 
 * Behavior:
 * - Case-insensitive matching
 * - Order irrelevant 
 * - Extra keywords allowed (papers can have more keywords than chosen)
 * - Empty chosenKeywords array returns all papers (no filtering)
 * - Uses Set for O(1) lookup performance
 */
export function filterPapersAND(papers: ResearchPaper[], chosenKeywords: string[]): ResearchPaper[] {
  // If no keywords chosen, return all papers (no filtering applied)
  if (chosenKeywords.length === 0) {
    return papers;
  }

  // Normalize chosen keywords to lowercase for case-insensitive comparison
  const normalizedChosenKeywords = chosenKeywords.map(keyword => keyword.toLowerCase().trim());
  
  return papers.filter(paper => {
    // Extract paper keywords and normalize them
    const paperKeywords = paper.keywords
      .map(k => (typeof k === 'string' ? k : k?.name || ''))
      .filter(Boolean)
      .map(keyword => keyword.toLowerCase().trim());
    
    // Convert to Set for O(1) lookup performance
    const paperKeywordSet = new Set(paperKeywords);
    
    // Check if ALL chosen keywords are present (AND logic)
    return normalizedChosenKeywords.every(chosenKeyword => 
      paperKeywordSet.has(chosenKeyword)
    );
  });
}

/**
 * @deprecated Use filterPapersAND instead. This function is maintained for backward compatibility.
 * 
 * Optimized partial keyword matching filter function with AND logic
 * 1. The user selects a list of keywords (chosenKeywords).
 * 2. Each item has a list of keywords (itemKeywords).
 * 3. An item should pass the filter if it contains ALL chosen keywords (AND logic), but it can have extra keywords.
 * 4. Matching should ignore order and treat keywords as case-insensitive.
 * 5. If chosenKeywords is empty, return true (no filtering applied).
 * 6. Optimize for large datasets by using Sets for lookups.
 */
function matchesKeywords(itemKeywords: string[], chosenKeywords: string[]): boolean {
  // Delegate to canonical function logic
  if (chosenKeywords.length === 0) {
    return true;
  }

  const itemKeywordSet = new Set(
    itemKeywords.map(keyword => keyword.toLowerCase().trim())
  );

  return chosenKeywords.every(chosenKeyword => 
    itemKeywordSet.has(chosenKeyword.toLowerCase().trim())
  );
}

/**
 * @deprecated Use filterPapersAND for research papers. This generic filter function is maintained for backward compatibility.
 * 
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

      // Use canonical AND logic for keyword filtering
      if (key === keywordField && Array.isArray((item as Record<string, unknown>)[keywordField]) && Array.isArray(value)) {
        const itemKeywords = ((item as Record<string, unknown>)[keywordField] as (string | { name: string })[])
          .map((k) => typeof k === 'string' ? k : (k?.name || ''))
          .filter(Boolean);
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
 * @deprecated Use filterPapersAND instead. This function is maintained for backward compatibility.
 * 
 * Specialized filter function for research papers - now wraps around canonical filterPapersAND
 */
export function filterPapers(
  papers: ResearchPaper[],
  criteria: {
    keywords?: string[];
    dateRange?: { startDate: Date | null; endDate: Date | null };
    minCitations?: number;
  }
): ResearchPaper[] {
  // Start with keyword filtering using canonical AND logic
  let filteredPapers = papers;
  
  if (criteria.keywords && criteria.keywords.length > 0) {
    filteredPapers = filterPapersAND(filteredPapers, criteria.keywords);
  }

  // Apply other filters
  if (criteria.dateRange && (criteria.dateRange.startDate || criteria.dateRange.endDate)) {
    filteredPapers = filteredPapers.filter(paper => {
      const dateRange = criteria.dateRange!;
      
      if (!dateRange.startDate && !dateRange.endDate) {
        return true;
      }

      // Try multiple date fields
      let itemDate: Date | null = null;
      const dateValue = paper.publicationDate || paper.publication_date || paper.publicationYear || paper.publication_year;
      
      if (dateValue) {
        itemDate = new Date(dateValue as string);
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
    });
  }

  if (criteria.minCitations !== undefined && criteria.minCitations > 0) {
    filteredPapers = filteredPapers.filter(paper => 
      paper.citationCount >= criteria.minCitations!
    );
  }

  return filteredPapers;
}

// Export the canonical function as default
export default filterPapersAND;

