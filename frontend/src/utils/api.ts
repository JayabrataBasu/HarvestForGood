/**
 * Utility functions for API calls to the backend
 */

// Default API URL - will be overridden by environment variable if available
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Test the connection to the backend
 * @returns A message from the backend
 */
export async function testConnection(): Promise<{ message: string }> {
  return fetchFromAPI<{ message: string }>('/api/test');
}

/**
 * Generic function to fetch data from the API
 * @param endpoint - The API endpoint to fetch from
 * @param options - Fetch options
 * @returns The API response data
 */
export async function fetchFromAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const url = `${apiUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error:', errorData);
      throw new Error(
        errorData?.detail || 
        errorData?.message || 
        `API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

/**
 * API for research paper related operations
 */
export const researchAPI = {
  /**
   * Fetch research papers with optional filtering
   */
  fetchPapers: async (filters?: Record<string, any>) => {
    try {
      const queryParams = filters 
        ? '?' + new URLSearchParams(filters as Record<string, string>).toString() 
        : '';
      const data = await fetchFromAPI<any>(`/api/research/papers/${queryParams}`);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },
  
  /**
   * Fetch a specific research paper by ID or slug
   */
  fetchPaper: async (idOrSlug: string) => {
    try {
      const data = await fetchFromAPI<any>(`/api/research/papers/${idOrSlug}/`);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  },

  /**
   * Fetch keywords for filtering
   */
  fetchKeywords: async () => {
    try {
      const data = await fetchFromAPI<any>('/api/research/keywords/');
      return { success: true, data };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }
};

// Re-export everything from lib/api for backward compatibility
export * from '../lib/api';
