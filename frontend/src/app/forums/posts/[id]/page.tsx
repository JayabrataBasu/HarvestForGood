'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';

// Types for API responses
interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName?: string;
  postId: string;
  createdAt: string;
  updatedAt?: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  // Add other post fields as needed
}

// Loading component for comments
const CommentsSkeleton = () => (
  <div className="mt-8 space-y-4">
    <h3 className="text-xl font-semibold">Comments</h3>
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="p-4 border rounded-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="p-4 border border-red-500 rounded-md bg-red-50 text-red-700">
    <h3 className="font-bold">Something went wrong:</h3>
    <p className="mb-4">{error.message}</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      Try again
    </button>
  </div>
);

// Comment component
const CommentComponent = ({ comment }: { comment: Comment }) => (
  <div className="p-4 border rounded-md mb-4">
    <div className="font-semibold">{comment.authorName || 'Anonymous'}</div>
    <div className="text-sm text-gray-500 mb-2">
      {new Date(comment.createdAt).toLocaleString()}
    </div>
    <div>{comment.content}</div>
  </div>
);

// Comments section component
const CommentsSection = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch comments with timeout handling
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15-second timeout

    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/forum/comments?postId=${postId}`, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          const errorData: ErrorResponse = await response.json();
          throw new Error(errorData.details || errorData.error || `Error: ${response.status}`);
        }
        
        const data: Comment[] = await response.json();
        setComments(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError((err as Error).message || 'Failed to load comments');
        }
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    fetchComments();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [postId]);

  // Handle new comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      const response = await fetch('/api/forum/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Use your auth mechanism here
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          content: newComment,
          postId,
        }),
        signal: AbortSignal.timeout(10000), // 10-second timeout
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.details || errorData.error || `Error: ${response.status}`);
      }

      const newCommentData: Comment = await response.json();
      
      // Optimistically update UI with new comment
      setComments(prev => [...prev, newCommentData]);
      setNewComment('');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setSubmitError('Request timed out. Please try again.');
      } else {
        setSubmitError((err as Error).message || 'Failed to post comment');
      }
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Retry loading comments
  const retryLoadComments = () => {
    setError(null);
    setLoading(true);
    
    // Re-trigger the useEffect by changing its dependency (hacky but works)
    const timestamp = Date.now();
    
    // Update the URL without reload
    window.history.replaceState(
      null,
      '',
      window.location.pathname + `?t=${timestamp}`
    );
    
    // We don't actually need to change postId, the URL change will cause useEffect to run again
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      
      {/* Loading state */}
      {loading && <CommentsSkeleton />}
      
      {/* Error state with retry button */}
      {!loading && error && (
        <div className="p-4 border border-red-500 rounded-md bg-red-50 text-red-700 mb-4">
          <p className="mb-2">{error}</p>
          <button 
            onClick={retryLoadComments}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* Comments list */}
      {!loading && !error && comments.length === 0 && (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      )}
      
      {!loading && !error && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map(comment => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}
        </div>
      )}
      
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mt-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Write a comment..."
          rows={3}
          disabled={submitting}
        />
        
        {submitError && (
          <div className="mt-2 text-red-600 text-sm">{submitError}</div>
        )}
        
        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className={`mt-2 px-4 py-2 rounded-md ${
            submitting || !newComment.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

// Main page component
export default function PostPage() {
  const params = useParams();
  const postId = params?.id as string || '';
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch post details
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15-second timeout

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/forum/posts/${postId}`, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          const errorData: ErrorResponse = await response.json();
          throw new Error(errorData.details || errorData.error || `Error: ${response.status}`);
        }
        
        const data: Post = await response.json();
        setPost(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError((err as Error).message || 'Failed to load post');
        }
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    fetchPost();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [postId]);
  
  if (loading) {
    return <div className="container mx-auto p-4">Loading post...</div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="p-4 border border-red-500 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      </div>
    );
  }
  
  if (!post) {
    return <div className="container mx-auto p-4">Post not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Post content */}
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="mt-4 prose lg:prose-xl">{post.content}</div>
      
      {/* Comments section with error boundary */}
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // Reset state if needed
        }}
      >
        <CommentsSection postId={postId} />
      </ErrorBoundary>
    </div>
  );
}
