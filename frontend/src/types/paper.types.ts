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

export interface KeywordCategory {
  id: string;
  name: string;
  keywords: Keyword[];
}

export type MethodologyType = 'qualitative' | 'quantitative' | 'mixed';
export type CitationTrend = 'increasing' | 'stable' | 'decreasing';

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: Author[];
  publicationDate: Date | string | number; // Make more flexible to handle year-only values
  journal: string;
  methodologyType?: MethodologyType; // Make optional to prevent errors
  citationCount: number;
  citationTrend: CitationTrend;
  keywords: Keyword[];
  downloadUrl?: string;
  url?: string;
  doi?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  slug?: string;
}

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
  methodology_type: MethodologyType;
  citation_count: number;
  citation_trend: CitationTrend;
  journal: string;
  keywords: {
    name: string;
  }[];
  download_url?: string;
  doi?: string;
  volume?: string;
  issue?: string;
  pages?: string;
}
