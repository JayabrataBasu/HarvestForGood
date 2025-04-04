import { parseCookies } from "nookies";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

/**
 * Check if a user is authenticated by looking for tokens
 */
export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  
  try {
    const cookies = parseCookies();
    return !!(
      cookies.accessToken || 
      localStorage.getItem("access_token")
    );
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

/**
 * Fetch API with authentication handling
 */
export async function fetchAPI(
  endpoint: string,
  options?: RequestInit
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const url = `${baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });
    
    // If response is not ok, create a more detailed error
    if (!response.ok) {
      // Try to parse error message from the response if possible
      try {
        const errorData = await response.json();
        throw new Error(`API Error (${response.status}): ${JSON.stringify(errorData)}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (parseError) {
        // If we can't parse the JSON, use the status text
        throw new Error(`API Error (${response.status}): ${response.statusText || 'Unknown error'}`);
      }
    }
    
    // For empty responses (like 204 No Content)
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error; // Re-throw to let the caller handle it
  }
}

/**
 * Forum API specific functions
 */
export const forumAPI = {
  getPosts: () => fetchAPI("/forums/posts/"),
  getPost: (id: string) => fetchAPI(`/forums/posts/${id}/`),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createPost: (data: any) => fetchAPI("/forums/posts/", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updatePost: (id: string, data: any) => fetchAPI(`/forums/posts/${id}/`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  deletePost: (id: string) => fetchAPI(`/forums/posts/${id}/`, {
    method: "DELETE",
  }),
};