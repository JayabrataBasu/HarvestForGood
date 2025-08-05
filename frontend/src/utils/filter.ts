import { ResearchPaper } from "../types/paper.types";

// Capital case utility
function toCapitalCase(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Generic filter function that applies criteria to data array
 * For keywords, uses partial matching - must include all chosen keywords (extras allowed)
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

      // Partial match for keywords - must include all chosen keywords (order doesn't matter, extras allowed)
      if (key === keywordField && Array.isArray(itemValue) && Array.isArray(value)) {
        // Support both [{name: string}] and [string]
        const itemKeywords = (itemValue as (string | { name: string })[]).map((k) =>
          toCapitalCase(typeof k === 'string' ? k : (k && typeof k.name === 'string' ? k.name : ''))
        );
        const chosenKeywords = (value as string[]).map(toCapitalCase);
        // Only match if every chosen keyword is present in itemKeywords
        return chosenKeywords.every((kw) =>
          itemKeywords.includes(kw)
        );
      }

      // Handle other array comparisons (partial match)
      if (Array.isArray(itemValue) && Array.isArray(value)) {
        return (value as (string | number)[]).every((v) => itemValue.includes(v));
      }

      // Handle date ranges
      if (
        value &&
        typeof value === 'object' &&
        'startDate' in value &&
        'endDate' in value &&
        value.startDate &&
        value.endDate
      ) {
        let itemDate: Date | null = null;
        if (typeof itemValue === "string" || typeof itemValue === "number" || itemValue instanceof Date) {
          itemDate = new Date(itemValue as string);
        }
        if (!itemDate || isNaN(itemDate.getTime())) {
          return false;
        }
        return itemDate >= (value as { startDate: Date; endDate: Date }).startDate &&
               itemDate <= (value as { startDate: Date; endDate: Date }).endDate;
      }

      // Handle minimum number comparisons
      if (typeof value === 'number' && typeof itemValue === 'number') {
        return itemValue >= value;
      }

      // Direct comparison
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
    methodologyTypes?: string[];
    dateRange?: { startDate: Date | null; endDate: Date | null };
    minCitations?: number;
  }
): ResearchPaper[] {
  const filterCriteria: Record<
    string,
    string[] | { startDate: Date | null; endDate: Date | null } | number | undefined
  > = {};

  if (criteria.keywords && criteria.keywords.length > 0) {
    filterCriteria.keywords = criteria.keywords;
  }

  if (criteria.methodologyTypes && criteria.methodologyTypes.length > 0) {
    filterCriteria.methodologyType = criteria.methodologyTypes;
  }

  if (criteria.dateRange && (criteria.dateRange.startDate || criteria.dateRange.endDate)) {
    filterCriteria.publicationDate = criteria.dateRange;
  }

  if (criteria.minCitations !== undefined && criteria.minCitations > 0) {
    filterCriteria.citationCount = criteria.minCitations;
  }

  return filter(papers, filterCriteria, "keywords");
}
