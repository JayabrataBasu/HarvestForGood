import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/api';

interface LikeState {
  isLiked: boolean;
  likesCount: number;
  isLoading: boolean;
}

// Global state management for likes to ensure consistency across components
const likeStates = new Map<string, LikeState>();
const likeSubscribers = new Map<string, Set<(state: LikeState) => void>>();

export const useLike = (postId: string, initialLikesCount: number = 0, initialIsLiked: boolean = false) => {
  const { user } = useAuth();
  
  // Initialize state from global store or use initial values
  const [likeState, setLikeState] = useState<LikeState>(() => {
    const globalState = likeStates.get(postId);
    if (globalState) {
      return globalState;
    }
    
    const newState = {
      isLiked: initialIsLiked,
      likesCount: initialLikesCount,
      isLoading: false
    };
    
    likeStates.set(postId, newState);
    return newState;
  });

  // Subscribe to global state changes
  useEffect(() => {
    if (!likeSubscribers.has(postId)) {
      likeSubscribers.set(postId, new Set());
    }
    
    const subscribers = likeSubscribers.get(postId)!;
    subscribers.add(setLikeState);
    
    return () => {
      subscribers.delete(setLikeState);
      if (subscribers.size === 0) {
        likeSubscribers.delete(postId);
      }
    };
  }, [postId]);

  // Update global state and notify all subscribers
  const updateGlobalState = useCallback((newState: LikeState) => {
    likeStates.set(postId, newState);
    const subscribers = likeSubscribers.get(postId);
    if (subscribers) {
      subscribers.forEach(callback => callback(newState));
    }
  }, [postId]);

  // Get unique identifier for guest users
  const getGuestIdentifier = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    let guestId = sessionStorage.getItem('guestId') || localStorage.getItem('guestId');
    
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('guestId', guestId);
      localStorage.setItem('guestId', guestId);
    }
    
    return guestId;
  }, []);

  // Load like state from localStorage on component mount
  useEffect(() => {
    const loadLikeState = () => {
      if (typeof window === 'undefined') return;

      const storageKey = user ? `like_${postId}_${user.id}` : `like_${postId}_${getGuestIdentifier()}`;
      const savedState = localStorage.getItem(storageKey);
      
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          // Only update if we haven't already loaded state for this post
          const currentGlobalState = likeStates.get(postId);
          if (!currentGlobalState || currentGlobalState.likesCount === initialLikesCount) {
            updateGlobalState({
              isLiked: parsedState.isLiked || false,
              likesCount: initialLikesCount, // Use initial count from props, not storage
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Error parsing saved like state:', error);
        }
      }
    };

    loadLikeState();
  }, [postId, user, initialLikesCount, getGuestIdentifier, updateGlobalState]);

  // Save like state to localStorage
  const saveLikeState = useCallback((isLiked: boolean) => {
    if (typeof window === 'undefined') return;

    const storageKey = user ? `like_${postId}_${user.id}` : `like_${postId}_${getGuestIdentifier()}`;
    localStorage.setItem(storageKey, JSON.stringify({ isLiked, timestamp: Date.now() }));
  }, [postId, user, getGuestIdentifier]);

  const handleLike = async (): Promise<void> => {
    if (likeState.isLoading) return;

    // Set loading state
    const loadingState = { ...likeState, isLoading: true };
    updateGlobalState(loadingState);

    // Store original state for rollback
    const originalState = { ...likeState };

    try {
      const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/like/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` })
        },
        body: JSON.stringify({
          guest_name: !user ? localStorage.getItem('guestInfo') ? JSON.parse(localStorage.getItem('guestInfo')!).name : 'Anonymous Guest' : undefined,
          guest_identifier: !user ? getGuestIdentifier() : undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newIsLiked = data.action === 'liked';
        const newLikesCount = data.likes_count || 0;
        
        const newState = {
          isLiked: newIsLiked,
          likesCount: newLikesCount,
          isLoading: false
        };
        
        updateGlobalState(newState);
        saveLikeState(newIsLiked);
      } else {
        throw new Error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error handling like:', error);
      // Rollback to original state on error
      updateGlobalState({ ...originalState, isLoading: false });
      throw error;
    }
  };

  return {
    ...likeState,
    handleLike
  };
};

// Utility function to get current like state for a post (useful for debugging)
export const getLikeState = (postId: string): LikeState | undefined => {
  return likeStates.get(postId);
};

// Utility function to clear all like states (useful for logout)
export const clearAllLikeStates = () => {
  likeStates.clear();
  likeSubscribers.clear();
};
