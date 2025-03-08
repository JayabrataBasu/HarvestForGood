/**
 * Utility functions for API calls to the backend
 */

// Default API URL - will be overridden by environment variable if available
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generic function to fetch data from the API
 * @param endpoint - API endpoint to call (without base URL)
 * @param options - fetch options
 * @returns Promise with the response data
 */
export async function fetchFromAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  // Check if response is empty
  const text = await response.text();
  if (!text) return {} as T;

  // Parse JSON
  return JSON.parse(text) as T;
}

/**
 * Test the connection to the backend
 * @returns A message from the backend
 */
export async function testConnection(): Promise<{ message: string }> {
  return fetchFromAPI<{ message: string }>('/api/test');
}
