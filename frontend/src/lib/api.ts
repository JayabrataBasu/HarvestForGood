export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
import { parseCookies } from 'nookies';

// Type definitions matching Django backend models
export interface ForumPostType {
  id: number;
  title: string;
  content: string;
  author: number;
  author_name: string;  // From serializer
  created_at: string;
  updated_at: string;
  comments_count: number; // From serializer method field
  comments?: CommentType[];
  tags?: string[];  // You might need to add tags to your backend model
}

export interface CommentType {
  id: number;
  post: number;
  content: string;
  author: number;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Check if a user is authenticated by looking for tokens
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const token = localStorage.getItem('access_token');
    return !!token;
  } catch (error) {
    // In case of any errors accessing localStorage (e.g., private browsing)
    console.error('Error checking authentication status:', error);
    return false;
  }
}

/**
 * Determine if endpoint requires authentication
 */
function requiresAuth(endpoint: string): boolean {
  // Public endpoints that don't require authentication
  const publicEndpoints = [
    '/forum/posts',          // GET all posts (read-only)
    '/forum/posts/',         // GET all posts (read-only)
  ];

  // Check if the endpoint is a GET request to forum posts
  if (endpoint.startsWith('/forum/posts') && !endpoint.includes('create')) {
    return false;
  }

  // Similarly for comments - don't require auth for GET requests
  if (endpoint.startsWith('/forum/comments') && !endpoint.includes('create')) {
    return false;
  }

  return !publicEndpoints.some(e => 
    endpoint === e || 
    endpoint.startsWith(`${e}/`) && !endpoint.includes('add_comment')
  );
}

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    let token = null;
    const needsAuth = requiresAuth(endpoint);

    // Get token from localStorage in browser, cookies in SSR
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token');
    } else {
      const cookies = parseCookies();
      token = cookies.access_token;
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token && needsAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...headers,
        ...options.headers,
      },
      credentials: 'include', // Include cookies in requests
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();

      // Handle token refresh if 401 error
      if (response.status === 401 && typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/token/refresh/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshResponse.ok) {
              const { access } = await refreshResponse.json();
              localStorage.setItem('access_token', access);

              // Retry the original request with the new token
              const retryResponse = await fetch(url, {
                ...options,
                headers: {
                  ...headers,
                  Authorization: `Bearer ${access}`,
                  ...options.headers,
                },
              });

              if (retryResponse.ok) {
                return await retryResponse.json();
              }
            } else {
              // Refresh failed, user needs to log in again
              if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
              }
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
          }
        }
      }
      throw new Error(`API request failed: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`API error for ${endpoint}:`, error);
    throw error;
  }
}

export const forumAPI = {
  getPosts: async (): Promise<APIResponse<ForumPostType[]>> => {
    try {
      const data = await fetchAPI<ForumPostType[]>('/forum/posts/');
      return {
        success: true,
        data: Array.isArray(data) ? data : []
      };
    } catch (error: unknown) {
      console.error('Error in getPosts:', error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : 'Failed to fetch posts'
      };
    }
  },
  getPost: async (id: string | number) => {
    try {
      const data = await fetchAPI(`/forums/posts/${id}/`);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to fetch post" 
      };
    }
  },
  createPost: async (postData: { title: string; content: string }) => {
    try {
      const data = await fetchAPI("/forum/posts/", {
        method: "POST",
        body: JSON.stringify(postData),
      });
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create post" 
      };
    }
  },
  addComment: async (postId: string | number, content: string) => {
    try {
      const data = await fetchAPI(`/forums/posts/${postId}/comments/`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to add comment" 
      };
    }
  },
  likePost: async (postId: string | number) => {
    try {
      const data = await fetchAPI(`/forums/posts/${postId}/like/`, {
        method: "POST",
      });
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to like post" 
      };
    }
  },
};

// Remove these duplicate functions as they're now handled by forumAPI
// export const createPost = async ...
// export const getPosts = async ...