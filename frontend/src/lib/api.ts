// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { parseCookies } from "nookies";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

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
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

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
    console.error('Login error:', error);
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
    
    const errorText = await response.text();
    throw new Error(errorText);
  }
  
  return response.json();
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
 * Forum API specific functions
 */
export const forumAPI = {
  getPosts: async () => {
    return fetchAPI('/forum/posts/');
  },
  
  getPost: async (id: string) => {
    return fetchAPI(`/forum/posts/${id}/`);
  },
  
  createPost: async (data: { title: string; content: string }) => {
    return fetchAPI('/forum/posts/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  createComment: async (postId: string, content: string) => {
    return fetchAPI('/forum/comments/', {
      method: 'POST',
      body: JSON.stringify({
        post: postId,
        content,
      }),
    });
  },
  
  likePost: async (postId: string) => {
    return fetchAPI(`/forum/posts/${postId}/like/`, {
      method: 'POST',
    });
  },
};