export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Reusable fetch function with error handling and authentication
export async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default options
  const defaultOptions: RequestInit = {
    credentials: 'include', // Send cookies for authentication
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Forum data types
export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

// Type-safe API methods for forums
export const forumAPI = {
  // Get all forum posts
  getPosts: async (signal?: AbortSignal) => {
    console.log('Fetching posts from API...');
    // Use the correct API path (change to "forum" singular if needed)
    const response = await fetchAPI<{success: boolean; data: ForumPost[]}>('/api/forum/posts', {
      signal, // Pass the abort signal to the fetch call
    });
    console.log('API response:', response);
    return response;
  },
  
  // Get single post
  getPost: async (id: string, signal?: AbortSignal) => {
    console.log(`Fetching post with id ${id} from API...`);
    const response = await fetchAPI<{success: boolean; data: ForumPost}>(`/api/forum/posts/${id}`, {
      signal,
    });
    console.log('API response:', response);
    return response;
  },
  
  // Get comments for a post
  getComments: async (postId: string) => {
    console.log(`Fetching comments for post with id ${postId} from API...`);
    const response = await fetchAPI<{success: boolean; data: ForumComment[]}>(`/api/forums/comments?postId=${postId}`);
    console.log('API response:', response);
    return response;
  },
  
  // Create comment
  createComment: async (data: {postId: string; content: string}) => {
    console.log('Creating comment with data:', data);
    const response = await fetchAPI<{success: boolean; data: ForumComment}>('/api/forums/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('API response:', response);
    return response;
  },
}
