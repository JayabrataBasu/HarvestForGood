import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/api';

interface LikeState {
  isLiked: boolean;
  likesCount: number;
  isLoading: boolean;
}

export const useLike = (postId: string, initialLikesCount: number = 0, initialIsLiked: boolean = false) => {
  const { user } = useAuth();
  const [likeState, setLikeState] = useState<LikeState>({
    isLiked: initialIsLiked,
    likesCount: initialLikesCount,
    isLoading: false
  });

  // Get unique identifier for guest users
  const getGuestIdentifier = () => {
    if (typeof window === 'undefined') return null;
    
    // Try to get from sessionStorage first, then localStorage
    let guestId = sessionStorage.getItem('guestId') || localStorage.getItem('guestId');
    
    if (!guestId) {
      // Generate a unique identifier for guest
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('guestId', guestId);
      localStorage.setItem('guestId', guestId);
    }
    
    return guestId;
  };

  // Load like state from localStorage on component mount
  useEffect(() => {
    const loadLikeState = () => {
      if (typeof window === 'undefined') return;

      const storageKey = user ? `like_${postId}_${user.id}` : `like_${postId}_${getGuestIdentifier()}`;
      const savedState = localStorage.getItem(storageKey);
      
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          setLikeState(prevState => ({
            ...prevState,
            isLiked: parsedState.isLiked || false
          }));
        } catch (error) {
          console.error('Error parsing saved like state:', error);
        }
      }
    };

    loadLikeState();
  }, [postId, user]);

  // Save like state to localStorage
  const saveLikeState = (isLiked: boolean) => {
    if (typeof window === 'undefined') return;

    const storageKey = user ? `like_${postId}_${user.id}` : `like_${postId}_${getGuestIdentifier()}`;
    localStorage.setItem(storageKey, JSON.stringify({ isLiked, timestamp: Date.now() }));
  };

  const handleLike = async (): Promise<void> => {
    if (likeState.isLoading) return;

    setLikeState(prev => ({ ...prev, isLoading: true }));

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
        
        setLikeState({
          isLiked: newIsLiked,
          likesCount: data.likes_count || 0,
          isLoading: false
        });

        // Save to localStorage
        saveLikeState(newIsLiked);
      } else {
        throw new Error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error handling like:', error);
      setLikeState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  return {
    ...likeState,
    handleLike
  };
};
