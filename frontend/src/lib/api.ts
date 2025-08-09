import { ResearchPaper } from '@/types/paper.types';
import { handleApiError } from './errorHandler';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? "https://harvestforgood-production.up.railway.app/api"
    : "http://localhost:8000/api");

// Add debugging function
export function debugApiConnection() {
  console.log('=== API DEBUG INFO ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
  console.log('Final API_BASE_URL:', API_BASE_URL);
  console.log('=====================');
}

/**
 * Check if a user is authenticated by looking for tokens
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') {
    return false;
  }
  const token = localStorage.getItem("access_token");
  return !!token;
}

/**
 * Login user and store tokens
 */
export async function loginUser(username: string, password: string) {
  try {
    // Add debugging
    debugApiConnection();
    console.log('Attempting login to:', `${API_BASE_URL}/token/`);
    
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log('Login response status:', response.status);
    console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || 'Login failed' };
    }

    const data = await response.json();
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', data.access);
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Login error details:', error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('Network connection failed. Possible causes:');
      console.error('1. Backend server is not running');
      console.error('2. CORS is not configured');
      console.error('3. Wrong API URL');
      console.error('4. Network connectivity issues');
      
      return { 
        success: false, 
        message: `Cannot connect to server. Please check:\n1. Is the backend server running?\n2. API URL: ${API_BASE_URL}\n3. Check browser console for CORS errors` 
      };
    }
    
    return { success: false, message: 'An error occurred during login' };
  }
}

/**
 * Fetch API with authentication handling
 */
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  if (!response.ok) {
    // If we get a 401 Unauthorized, our token might be expired
    if (response.status === 401) {
      // Try to refresh the token
      const refreshResult = await refreshToken();
      if (refreshResult.success) {
        // Retry the original request with the new token
        return fetchAPI(endpoint, options);
      } else {
        // If refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }

    // Try to parse error as JSON, otherwise return text
    if (contentType && contentType.includes('application/json')) {
      const errorJson = await response.json();
      throw new Error(errorJson.detail || JSON.stringify(errorJson));
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  }

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    // Not JSON, return as text or handle accordingly
    return response.text();
  }
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    return { success: false };
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      return { success: false };
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    
    return { success: true };
  } catch (error) {
    console.error('Token refresh failed:', error);
    return { success: false };
  }
}

/**
 * Research API specific functions for papers, keywords, and authors
 */
export const researchAPI = {
  /**
   * Fetch research papers with optional filtering
   * @param params Filter parameters (search, methodology, keywords, etc.)
   * @param page Page number for pagination
   * @param pageSize Number of items per page
   * @returns Promise with the papers data
   */
  fetchPapers: async (params = {}, page = 1, pageSize = 10) => {
    try {
      // Flatten arrays for query params
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('page_size', pageSize.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, String(v)));
        } else if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      const response = await fetchAPI(`/research/papers/?${queryParams.toString()}`);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error fetching papers:', error);
      return { 
        success: false, 
        message: 'Failed to fetch papers',
        error: handleApiError(error)
      };
    }
  },
  
  /**
   * Fetch a single research paper by ID or slug
   * @param idOrSlug Paper ID or slug
   * @returns Promise with the paper data
   */
  fetchPaperById: async (idOrSlug: string) => {
    try {
      const response = await fetchAPI(`/research/papers/${idOrSlug}/`);
      return { success: true, data: response };
    } catch (error) {
      console.error(`Error fetching paper ${idOrSlug}:`, error);
      return { 
        success: false, 
        message: 'Failed to fetch paper',
        error: handleApiError(error)
      };
    }
  },

  /**
   * Fetch a single research paper by slug
   * @param slug Paper slug
   * @returns Promise with the paper data
   */
  fetchPaperBySlug: async (slug: string) => {
    try {
      const response = await fetchAPI(`/research/papers/${slug}/`);
      return { success: true, data: response };
    } catch (error) {
      console.error(`Error fetching paper with slug ${slug}:`, error);
      return { 
        success: false, 
        message: 'Failed to fetch paper',
        error: handleApiError(error)
      };
    }
  },
  
  /**
   * Create a new research paper
   * @param data Paper data including authors and keywords
   * @returns Promise with the created paper
   */
  createPaper: async (data: unknown) => {
    try {
      // Ensure methodology_type is never empty
      const paperData = data as { methodology_type?: string; authors?: { name?: string }[]; [key: string]: unknown };
      if (!paperData.methodology_type) {
        paperData.methodology_type = 'mixed'; // Default value
      }
      
      // Format authors correctly
      if (paperData.authors && Array.isArray(paperData.authors)) {
        paperData.authors = paperData.authors.filter(author => author.name && author.name.trim() !== '');
      }
      
      const response = await fetchAPI('/research/papers/', {
        method: 'POST',
        body: JSON.stringify(paperData)
      });
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Error creating paper:', error);
      return { 
        success: false, 
        message: 'Failed to create paper',
        error: handleApiError(error)
      };
    }
  },
  
  /**
   * Update an existing research paper
   * @param idOrSlug Paper ID or slug
   * @param data Updated paper data
   * @returns Promise with the updated paper
   */
  updatePaper: async (idOrSlug: string, data: unknown) => {
    try {
      // Ensure methodology_type is never empty
      const paperData = data as { methodology_type?: string; authors?: { name?: string }[]; [key: string]: unknown };
      if (!paperData.methodology_type) {
        paperData.methodology_type = 'mixed'; // Default value
      }
      
      // Format authors correctly
      if (paperData.authors && Array.isArray(paperData.authors)) {
        paperData.authors = paperData.authors.filter(author => author.name && author.name.trim() !== '');
      }
      
      const response = await fetchAPI(`/research/papers/${idOrSlug}/`, {
        method: 'PUT',
        body: JSON.stringify(paperData)
      });
      
      return { success: true, data: response };
    } catch (error) {
      console.error(`Error updating paper ${idOrSlug}:`, error);
      return { 
        success: false, 
        message: 'Failed to update paper',
        error: handleApiError(error)
      };
    }
  },
  
  /**
   * Delete a research paper
   * @param idOrSlug Paper ID or slug
   * @returns Promise with the deletion status
   */
  deletePaper: async (idOrSlug: string) => {
    try {
      await fetchAPI(`/research/papers/${idOrSlug}/`, {
        method: 'DELETE'
      });
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting paper ${idOrSlug}:`, error);
      return { 
        success: false, 
        message: 'Failed to delete paper',
        error: handleApiError(error)
      };
    }
  },
  
  /**
   * Bulk import multiple research papers
   * @param papers Array of paper objects to import
   * @returns Promise with import results
   */
  bulkImportPapers: async (papers: unknown[]) => {
    try {
      const response = await fetchAPI('/research/papers/bulk-import/', {
        method: 'POST',
        body: JSON.stringify(papers)
      });
      
      return { 
        success: true, 
        data: response
      };
    } catch (error) {
      console.error('Error importing papers:', error);
      return { 
        success: false, 
        message: 'Failed to import papers',
        error: handleApiError(error) 
      };
    }
  },
  
  /**
   * Fetch all available keywords
   * @param search Optional search term to filter keywords
   * @returns Promise with keywords data
   */
  fetchKeywords: async (search?: string) => {
    try {
      let url = '/research/keywords/';
      if (search) {
        url += `?name=${encodeURIComponent(search)}`;
      }
      
      const response = await fetchAPI(url);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error fetching keywords:', error);
      return { 
        success: false, 
        message: 'Failed to fetch keywords',
        error: handleApiError(error)
      };
    }
  },
  
  /**
   * Fetch keyword categories (groups of keywords)
   * @returns Promise with keyword categories
   */
  fetchKeywordCategories: async () => {
    try {
      // This endpoint may need to be implemented in the backend
      const response = await fetchAPI('/research/keyword-categories/');
      return { success: true, data: response };
    } catch (error) {
      console.error('Error fetching keyword categories:', error);
      return { 
        success: false, 
        message: 'Failed to fetch keyword categories',
        error: handleApiError(error)
      };
    }
  },
  
  /**
   * Fetch authors with optional search filtering
   * @param search Optional search term to filter authors
   * @returns Promise with authors data
   */
  fetchAuthors: async (search?: string) => {
    try {
      let url = '/research/authors/';
      if (search) {
        url += `?name=${encodeURIComponent(search)}`;
      }
      
      const response = await fetchAPI(url);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error fetching authors:', error);
      return { 
        success: false, 
        message: 'Failed to fetch authors',
        error: handleApiError(error)
      };
    }
  },

  /**
   * Fetch dynamic filter options with keyword categories
   * @returns Promise with filter options data including categorized keywords
   */
  fetchFilterOptions: async () => {
    try {
      const response = await fetchAPI('/research/filter-options/');
      return { success: true, data: response };
    } catch (error) {
      console.error('Error fetching filter options:', error);
      return { 
        success: false, 
        message: 'Failed to fetch filter options',
        error: handleApiError(error)
      };
    }
  },
};

/**
 * Fetch a single research paper by slug
 * @param slug Paper slug
 * @returns Promise with the paper data
 */
export async function getPaperBySlug(slug: string): Promise<ResearchPaper> {
  try {
    const result = await researchAPI.fetchPaperBySlug(slug);
    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to fetch paper");
    }
    return result.data;
  } catch (error) {
    console.error(`Error in getPaperBySlug for slug ${slug}:`, error);
    throw error;
  }
}

// Update the non-API version to use the actual API for consistency
export async function getPaperById(paperId: string): Promise<ResearchPaper> {
  try {
    const result = await researchAPI.fetchPaperById(paperId);
    if (!result.success || !result.data) {
      throw new Error(result.message || "Failed to fetch paper");
    }
    return result.data;
  } catch (error) {
    console.error(`Error in getPaperById for paper ${paperId}:`, error);
    throw error;
  }
}

// Removed re-export from utils/api.ts because it is not a module
