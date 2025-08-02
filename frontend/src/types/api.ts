// API Response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface ResearchPaper {
  id: number;
  title: string;
  abstract: string;
  author: string;
  published_date: string;
  keywords: string[];
}

export interface APIError {
  detail?: string;
  message?: string;
  [key: string]: any;
}
