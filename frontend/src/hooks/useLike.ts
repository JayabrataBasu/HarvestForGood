import { useState, useCallback } from 'react';

interface UseLikeProps {
  initialLiked: boolean;
  initialCount: number;
  itemId: number;
  itemType: 'post' | 'comment';
  guestName?: string;
}

interface LikeResponse {
  action: 'liked' | 'unliked';
  likes_count: number;
  is_liked: boolean;
}

export const useLike = ({
  initialLiked,
  initialCount,
  itemId,
  itemType,
  guestName
}: UseLikeProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleLike = useCallback(async () => {
    console.log('toggleLike called', { itemId, itemType, isLiked });
    setIsLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
        (process.env.NODE_ENV === 'production' 
          ? "https://harvestforgood-production.up.railway.app/api"
          : "http://localhost:8000/api");

      const endpoint = itemType === 'post' 
        ? `${API_BASE_URL}/forum/posts/${itemId}/like/`
        : `${API_BASE_URL}/forum/comments/${itemId}/like/`;

      const body = guestName ? { guest_name: guestName } : {};
      
      console.log('Making request to:', endpoint, 'with body:', body);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to ${isLiked ? 'unlike' : 'like'} ${itemType}: ${response.status}`);
      }

      const data: LikeResponse = await response.json();
      console.log('Success response:', data);
      
      setIsLiked(data.is_liked);
      setLikesCount(data.likes_count);

    } catch (err) {
      console.error('toggleLike error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [itemId, itemType, isLiked, guestName]);

  return {
    isLiked,
    likesCount,
    isLoading,
    error,
    toggleLike
  };
};
