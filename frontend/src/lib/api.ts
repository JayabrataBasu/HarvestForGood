// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { parseCookies } from "nookies";
import { ResearchPaper } from '@/types/paper.types';

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
    try {
      const response = await fetch(`${API_BASE_URL}/forum/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to create post: ${response.status} - ${errorText}`);
        throw new Error('Failed to create post');
      }
      
      return { success: true, data: await response.json() };
    } catch (error) {
      console.error('Create post error:', error);
      return { success: false, message: 'Failed to create post' };
    }
  },
  
  createComment: async (postId: string, content: string) => {
    try {
      // First try the direct post comments endpoint
      const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) {
        // If the direct endpoint fails, try the comment endpoint with post ID in body
        const fallbackResponse = await fetch(`${API_BASE_URL}/forum/comments/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({
            post: postId,
            content
          })
        });
        
        if (!fallbackResponse.ok) {
          const errorText = await fallbackResponse.text();
          console.error(`Failed to submit comment: ${fallbackResponse.status} - ${errorText}`);
          throw new Error('Failed to submit comment');
        }
        
        return { success: true, data: await fallbackResponse.json() };
      }
      
      return { success: true, data: await response.json() };
    } catch (error) {
      console.error('Create comment error:', error);
      return { success: false, message: 'Failed to create comment' };
    }
  },
  
  likePost: async (postId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to like post: ${response.status} - ${errorText}`);
        throw new Error('Failed to like post');
      }
      
      return { success: true, data: await response.json() };
    } catch (error) {
      console.error('Like post error:', error);
      return { success: false, message: 'Failed to like post' };
    }
  }
};

/**
 * Fetch individual paper details
 */
// This is a mock implementation for now
// In a real app, this would call your actual API endpoint
export async function getPaperById(paperId: string): Promise<ResearchPaper> {
  // In a real app, fetch from an API
  // return fetch(`/api/papers/${paperId}`).then(res => res.json());
  
  // For demo purposes, we'll generate dummy data
  // This simulates fetching a paper by ID
  return new Promise((resolve, reject) => {
    // Simulate API latency
    setTimeout(() => {
      // Generate a sample paper based on the ID
      const idNumber = parseInt(paperId.replace('paper-', '')) || 1;
      
      const paper: ResearchPaper = {
        id: paperId,
        title: `Research Paper ${idNumber}: Impact of Sustainable Agriculture Practices`,
        abstract: `This comprehensive study examines how urban farming initiatives contribute to local food security and community resilience. The research presents data from 15 metropolitan areas and analyzes economic and social impacts of community-led agriculture projects over a three-year period. Our findings indicate significant improvements in food access, community engagement, and environmental awareness among participants. The paper concludes with policy recommendations for municipal governments seeking to support urban agriculture as a component of sustainable city planning.`,
        authors: [
          {
            id: `author-${idNumber}-1`,
            name: `Dr. ${['John Smith', 'Sarah Johnson', 'David Lee', 'Maria Garcia'][idNumber % 4]}`,
            affiliation: `${['University of California', 'MIT', 'Stanford University', 'Oxford University'][idNumber % 4]}`,
            email: `researcher${idNumber}@example.edu`
          },
          {
            id: `author-${idNumber}-2`,
            name: `Prof. ${['Robert Brown', 'Emily Chen', 'Michael Wilson', 'Lisa Wong'][idNumber % 4]}`,
            affiliation: `${['Harvard University', 'Yale University', 'Princeton University', 'Cambridge University'][idNumber % 4]}`
          }
        ],
        publicationDate: new Date(2020 + (idNumber % 4), (idNumber % 12), 1),
        journal: `Journal of ${['Sustainable Agriculture', 'Food Studies', 'Environmental Science', 'Community Development'][idNumber % 4]}`,
        methodologyType: ['qualitative', 'quantitative', 'mixed'][idNumber % 3] as 'qualitative' | 'quantitative' | 'mixed',
        citationCount: 10 + (idNumber * 5),
        citationTrend: ['increasing', 'stable', 'decreasing'][idNumber % 3] as 'increasing' | 'stable' | 'decreasing',
        keywords: [
          { id: 'k1', name: 'Food Security' },
          { id: 'k2', name: 'Agriculture' },
          { id: 'k3', name: 'Sustainability' },
          { id: 'k4', name: 'Urban Farming' },
          { id: 'k5', name: 'Food Waste' },
        ].slice(0, 3 + (idNumber % 3)),
        downloadUrl: `https://example.com/papers/sustainable-agriculture-${idNumber}.pdf`,
        url: `https://doi.org/10.1234/ag.${2020 + (idNumber % 4)}.${idNumber}`,
        doi: `10.1234/ag.${2020 + (idNumber % 4)}.${idNumber}`,
        volume: `${4 + (idNumber % 10)}`,
        issue: `${1 + (idNumber % 4)}`,
        pages: `${100 + idNumber}-${150 + idNumber}`,
      };
      
      resolve(paper);
    }, 800); // Simulate network delay
  });
}