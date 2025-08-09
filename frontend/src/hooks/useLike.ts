import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/api';

interface UseLikeReturn {
  isLiked: boolean;
  likesCount: number;
  isLoading: boolean;
  handleLike: () => Promise<void>;
}

export const useLike = (
  postId: string, 
  initialLikesCount: number = 0, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialIsLiked: boolean = false
): UseLikeReturn => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false); // Always start with false
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  // Get unique identifier for guest users
  const getGuestIdentifier = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  }, []);

  // Fetch like state from backend for absolutely everyone
  const fetchLikeStateFromBackend = useCallback(async () => {
    if (!postId) {
      setHasInitiallyLoaded(true);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Fetching like status from:', `${API_BASE_URL}/forum/posts/${postId}/like-status/`);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add auth header only if user is authenticated
      if (user) {
        const token = localStorage.getItem('access_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/like-status/`, {
        method: 'GET',
        headers,
      });

      console.log('Like status response:', response.status);

      if (response.ok) {
        const data = await response.json();
        // Only set isLiked for authenticated users
        setIsLiked(user ? (data.is_liked || false) : false);
        // Always set likes count for everyone
        setLikesCount(data.likes_count || 0);
      } else {
        console.error('Failed to fetch like status:', response.status);
        // Always try to show the initial likes count even on error
        setIsLiked(false);
        setLikesCount(initialLikesCount);
      }
    } catch (error) {
      console.error('Error fetching like state from backend:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('Backend connection failed for like status');
      }
      // Always fallback to initial values but still show count
      setIsLiked(false);
      setLikesCount(initialLikesCount);
    } finally {
      setIsLoading(false);
      setHasInitiallyLoaded(true);
    }
  }, [user, postId, initialLikesCount]);

  // Load like state - for absolutely everyone (authenticated, guests, anonymous)
  useEffect(() => {
    if (!postId || typeof window === 'undefined') return;

    // Always fetch like status to get like counts for everyone
    fetchLikeStateFromBackend();
  }, [postId, fetchLikeStateFromBackend]);

  // Save like state to localStorage (only for guest users)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const saveLikeState = useCallback((liked: boolean) => {
    if (typeof window === 'undefined' || user) return; // Don't save for authenticated users

    try {
      const storageKey = `like_${postId}_guest_${getGuestIdentifier()}`;
      localStorage.setItem(storageKey, JSON.stringify({ 
        isLiked: liked, 
        timestamp: Date.now() 
      }));
    } catch (error) {
      console.error('Error saving like state:', error);
    }
  }, [postId, user, getGuestIdentifier]);

  const handleLike = useCallback(async (): Promise<void> => {
    if (isLoading || !postId || !hasInitiallyLoaded) return;

    // Only allow authenticated users to like posts
    if (!user) {
      throw new Error('Please log in to like posts');
    }

    setIsLoading(true);
    const originalIsLiked = isLiked;
    const originalCount = likesCount;

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Please log in to like posts');
      }

      console.log('Attempting to like/unlike post:', `${API_BASE_URL}/forum/posts/${postId}/like/`);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // Send request to backend (no body needed for authenticated users)
      const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/like/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });

      console.log('Like response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        const serverIsLiked = data.is_liked;
        const serverLikesCount = data.likes_count || 0;

        setIsLiked(serverIsLiked);
        setLikesCount(serverLikesCount);
      } else {
        // Revert to original state on error
        setIsLiked(originalIsLiked);
        setLikesCount(originalCount);

        const errorText = await response.text();
        console.error('Like API error:', response.status, errorText);
        
        if (response.status === 401) {
          throw new Error('Please log in to like posts');
        } else if (response.status === 0) {
          throw new Error('Network error - cannot connect to server');
        }
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      // Revert to original state on error
      setIsLiked(originalIsLiked);
      setLikesCount(originalCount);
      console.error('Error handling like:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, postId, isLiked, likesCount, user, hasInitiallyLoaded]);

  return {
    isLiked,
    likesCount,
    isLoading,
    handleLike,
  };
};

// Utility function to clear like states on logout
export const clearUserLikeStates = (userId: string) => {
  if (typeof window === 'undefined') return;
  
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes(`_user_${userId}`)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing like states:', error);
  }
};

export const clearAllLikeStates = () => {
  if (typeof window === 'undefined') return;
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('like_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing all like states:', error);
  }
};