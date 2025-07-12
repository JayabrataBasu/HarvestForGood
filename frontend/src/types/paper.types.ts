/**
 * Types for research paper data
 */

export interface Author {
  id: string;
  name: string;
  affiliation?: string;
  email?: string;
}

export interface Keyword {
  id: string;
  name: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: Author[];
  journal: string;
  publication_date?: string;
  publication_year?: string;
  publicationDate?: string;
  publicationYear?: string | number;
  keywords: Keyword[];
  citationCount: number;
  citationTrend: CitationTrend;
  methodologyType: MethodologyType;
  downloadUrl: string;
  created_at?: string;
  updated_at?: string;
  slug?: string;
}

export type MethodologyType = 'quantitative' | 'qualitative' | 'mixed' | 'Unknown';
export type CitationTrend = 'increasing' | 'decreasing' | 'stable';

// API request types
export interface PaperFilterParams {
  q?: string;         // General search term
  keyword?: string;   // Filter by keyword
  author?: string;    // Filter by author name
  methodology?: MethodologyType;
  min_citations?: number;
  year_from?: number;
  year_to?: number;
  journal?: string;
  [key: string]: any; // Allow additional filter parameters
}

export interface PaperFilterOptions {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  methodologyTypes: MethodologyType[];
  keywords: string[];
  minCitations: number;
}

// API response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BulkImportResult {
  success_count: number;
  error_count: number;
  errors: {
    index: number;
    title: string;
    errors: any;
  }[];
}

// Paper creation/update data shape
export interface PaperFormData {
  title: string;
  abstract: string;
  authors: {
    name: string;
    affiliation?: string;
    email?: string;
  }[];
  publication_date: string;
  publication_year: string; // Ensure this is string type to match backend
  methodology_type: MethodologyType;
  citation_count: number;
  citation_trend: CitationTrend;
  journal: string;
  keywords: {
    name: string;
  }[];
  issue?: string;
  pages?: string;
}
export interface PaperSearchParams {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
  [key: string]: any; // Allow additional parameters
}