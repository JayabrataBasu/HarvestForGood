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
  initialIsLiked: boolean = false
): UseLikeReturn => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
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

  // Fetch like state from backend for authenticated users
  const fetchLikeStateFromBackend = useCallback(async () => {
    if (!user || !postId) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/like-status/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.is_liked || false);
        setLikesCount(data.likes_count || initialLikesCount);
      } else {
        console.error('Failed to fetch like status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching like state from backend:', error);
    } finally {
      setIsLoading(false);
      setHasInitiallyLoaded(true);
    }
  }, [user, postId, initialLikesCount]);

  // Load like state - from backend for authenticated users, localStorage for guests
  useEffect(() => {
    if (!postId || typeof window === 'undefined') return;

    if (user) {
      // For authenticated users, fetch from backend
      fetchLikeStateFromBackend();
    } else {
      // For guest users, load from localStorage
      try {
        const storageKey = `like_${postId}_guest_${getGuestIdentifier()}`;
        const savedState = localStorage.getItem(storageKey);
        if (savedState) {
          const { isLiked: savedIsLiked } = JSON.parse(savedState);
          setIsLiked(savedIsLiked);
        }
      } catch (error) {
        console.error('Error loading like state:', error);
      } finally {
        setHasInitiallyLoaded(true);
      }
    }
  }, [postId, user, getGuestIdentifier, fetchLikeStateFromBackend]);

  // Save like state to localStorage (only for guest users)
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

    setIsLoading(true);
    const originalIsLiked = isLiked;
    const originalCount = likesCount;

    // Optimistic UI update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (user) {
        const token = localStorage.getItem('access_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      interface LikeRequestBody {
        guest_identifier?: string;
        guest_name?: string;
      }
      const body: LikeRequestBody = {};

      if (!user) {
        const guestInfo = localStorage.getItem('guestInfo');
        const guestId = getGuestIdentifier();
        if (guestId !== null) {
          body.guest_identifier = guestId;
        }
        if (guestInfo) {
          try {
            const parsed = JSON.parse(guestInfo);
            body.guest_name = parsed.name || 'Anonymous Guest';
          } catch {
            body.guest_name = 'Anonymous Guest';
          }
        } else {
          body.guest_name = 'Anonymous Guest';
        }
      }

      // Send request to backend
      const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/like/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        const serverIsLiked = data.action === 'liked';
        const serverLikesCount = data.likes_count || 0;

        setIsLiked(serverIsLiked);
        setLikesCount(serverLikesCount);
        saveLikeState(serverIsLiked);
      } else {
        setIsLiked(originalIsLiked);
        setLikesCount(originalCount);

        const errorText = await response.text();
        console.error('Like API error:', response.status, errorText);
        throw new Error(`Failed to ${newIsLiked ? 'like' : 'unlike'} post`);
      }
    } catch (error) {
      setIsLiked(originalIsLiked);
      setLikesCount(originalCount);
      console.error('Error handling like:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, postId, isLiked, likesCount, user, getGuestIdentifier, saveLikeState, hasInitiallyLoaded]);

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
