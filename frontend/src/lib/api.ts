export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
  
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  return !!accessToken && !!refreshToken;
}

/**
 * Determine if endpoint requires authentication
 * You can add rules here based on your API design
 */
function requiresAuth(endpoint: string): boolean {
  // Public endpoints that don't require authentication
  const publicEndpoints = [
    '/forum/posts',          // GET all posts (read-only)
    '/forum/posts/',         // GET all posts (read-only)
  ];
  
  // Check if the endpoint or its root is in the public list
  // For GET requests to forum posts list/detail
  if (endpoint.startsWith('/forum/posts') && 
      !endpoint.includes('add_comment') && 
      !endpoint.includes('create')) {
    return false;
  }
  
  return !publicEndpoints.some(e => 
    endpoint === e || 
    endpoint.startsWith(`${e}/`) && !endpoint.includes('add_comment')
  );
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Safely check for browser environment before accessing localStorage
  let token;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
  }
  
  // Determine if this request needs authentication
  const needsAuth = requiresAuth(endpoint);
  const isAuthAvailable = !!token;

  // Warn if auth is required but not available
  if (needsAuth && !isAuthAvailable) {
    console.warn('Authentication required for endpoint but no token available:', endpoint);
  }
  
  // Construct full URL - ensure endpoint starts correctly
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  try {
    console.log(`Fetching from: ${url} (Auth ${needsAuth ? 'required' : 'not required'})`);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Only add auth header if we have a token and the endpoint requires auth
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
    });
    
    // Clear the timeout since fetch completed
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      
      // Special handling for auth errors
      if (response.status === 401) {
        console.error('Authentication error - Please login');
        throw new Error('Authentication required. Please login to access this feature.');
      }
      
      throw new Error(`API error: ${response.status}${errorText ? ` - ${errorText}` : ''}`);
    }

    // Try to parse JSON, handle empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data as T;
    } else {
      const text = await response.text();
      try {
        return JSON.parse(text) as T;
      } catch {
        console.warn('Response is not valid JSON:', text);
        return {} as T;
      }
    }
  } catch (error: unknown) {
    // Enhanced error message for auth errors
    if (error instanceof Error && error.message.includes('Authentication required')) {
      console.error('Auth error in request:', error);
      throw new Error('Please login to access this feature');
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timed out');
      throw new Error('Request timed out. Please check your network connection.');
    } else if (error instanceof Error && (error.message === 'Failed to fetch' || error.message.includes('NetworkError'))) {
      console.error('Network error:', error);
      throw new Error('Network error. Please check if the API server is running and accessible.');
    }
    console.error('API request failed:', error);
    throw error;
  }
}

export const forumAPI = {
  // Get all forum posts
  getPosts: async (): Promise<APIResponse<ForumPostType[]>> => {
    try {
      // Attempt to get posts without requiring auth
      const data = await fetchAPI<ForumPostType[]>('/forum/posts/');
      
      return {
        success: true,
        data: data.map(post => ({
          ...post,
          comments_count: post.comments_count,
          author_name: post.author_name
        }))
      };
    } catch (error) {
      console.error('Error in getPosts:', error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : 'Failed to fetch posts'
      };
    }
  },
  
  // Get a single forum post by ID
  getPost: async (id: string | number): Promise<APIResponse<ForumPostType>> => {
    try {
      const data = await fetchAPI<ForumPostType>(`/forum/posts/${id}/`);
      
      return {
        success: true,
        data: {
          ...data,
          comments_count: data.comments_count,
          author_name: data.author_name
        }
      };
    } catch (error) {
      return {
        success: false,
        data: {} as ForumPostType,
        message: error instanceof Error ? error.message : 'Failed to fetch post'
      };
    }
  },
  
  // Create a new forum post
  createPost: async (postData: {
    title: string;
    content: string;
    tags?: string[];
  }): Promise<APIResponse<ForumPostType>> => {
    try {
      const data = await fetchAPI<ForumPostType>('/forum/posts/', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
      
      return {
        success: true,
        data: {
          ...data,
          comments_count: data.comments_count,
          author_name: data.author_name
        }
      };
    } catch (error) {
      return {
        success: false,
        data: {} as ForumPostType,
        message: error instanceof Error ? error.message : 'Failed to create post'
      };
    }
  },
  
  // Add a comment to a post
  addComment: async (
    postId: string | number, 
    content: string
  ): Promise<APIResponse<CommentType>> => {
    try {
      const data = await fetchAPI<CommentType>(`/forum/posts/${postId}/add_comment/`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        data: {} as CommentType,
        message: error instanceof Error ? error.message : 'Failed to add comment'
      };
    }
  }
};
