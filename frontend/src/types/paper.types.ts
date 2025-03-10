export type MethodologyType = 'qualitative' | 'quantitative' | 'mixed';

export interface Author {
  id: string;
  name: string;
  affiliation: string;
  email?: string;
}

export interface Keyword {
  id: string;
  name: string;
}

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: Author[];
  publicationDate: Date;
  journal: string;
  methodologyType: MethodologyType;
  citationCount: number;
  citationTrend: 'increasing' | 'stable' | 'decreasing';
  keywords: Keyword[];
  downloadUrl: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: Author[];
  publicationDate: Date;
  abstract: string;
  methodologyType: MethodologyType | string;
  citationCount: number;
  keywords: Keyword[];
  url?: string;
  doi?: string;
  journal: string;
  volume?: string;
  issue?: string;
  pages?: string;
  citationTrend: 'increasing' | 'stable' | 'decreasing' | string;
  downloadUrl: string;
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
