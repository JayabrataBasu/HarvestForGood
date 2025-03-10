"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Comment {
  id: number;
  content: string;
  author: {
    username: string;
  };
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    username: string;
  };
  created_at: string;
  updated_at: string;
  comments?: Comment[];
}

export default function PostDetail({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For adding new comments
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchPostDetails();
  }, []);
  
  const fetchPostDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch post details
      const response = await fetch(`/api/forum/posts/${params.id}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const postData = await response.json();
      
      // Fetch comments for this post
      const commentsResponse = await fetch(`/api/forum/comments/?post=${params.id}`);
      
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json();
        postData.comments = commentsData.results || commentsData;
      }
      
      setPost(postData);
    } catch (err) {
      console.error("Error fetching post details:", err);
      setError("Failed to load the discussion. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/forum/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authentication headers if required by your API
          // 'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          post: Number(params.id),
          content: newComment
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
      }
      
      // Reset comment input
      setNewComment('');
      
      // Refresh post details to show the new comment
      fetchPostDetails();
    } catch (err) {
      console.error("Error adding comment:", err);
      setError(err instanceof Error ? err.message : "Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md text-red-700 mb-4">
          {error || "Post not found"}
        </div>
        <Link href="/forums" className="text-blue-600 hover:underline">
          Return to Forums
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/forums" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Forums
      </Link>
      
      <article className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 mb-6">
          <span>Posted by {post.author.username}</span>
          <span className="mx-2">•</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <div className="prose max-w-none">
          <p>{post.content}</p>
        </div>
      </article>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Comments ({post.comments?.length || 0})</h2>
        
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{comment.author.username}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Add a Comment</h3>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
        )}
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border rounded-md mb-4"
            rows={3}
            placeholder="Add your thoughts..."
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            } text-white py-2 px-4 rounded-md transition-colors`}
          >
            {isSubmitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}
