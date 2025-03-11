"use client";

import { useState, useEffect } from "react";
import ForumPost from "./components/ForumPost";
import { forumAPI } from "@/lib/api"; // Import the API utility

// Define interface for forum post data
interface ForumPostType {
  id: string | number;
  title: string;
  content: string;
  authorName?: string;
  createdAt: string;
  commentCount?: number;
  tags?: string[];
}

export default function ForumsPage() {
  const [posts, setPosts] = useState<ForumPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await forumAPI.getPosts();
        setPosts(response.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch posts");
        console.error("Error fetching posts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discussion Forums</h1>
        <p className="mt-2 text-lg text-gray-600">
          Join the conversation about sustainable food systems and community
          agriculture
        </p>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow animate-pulse"></div>
          <div className="bg-white p-4 rounded shadow animate-pulse"></div>
          <div className="bg-white p-4 rounded shadow animate-pulse"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 border border-red-500 bg-red-50 text-red-700 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Posts list */}
      {!isLoading && !error && posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No discussions yet. Be the first to start one!
          </p>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Create New Post
          </button>
        </div>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ForumPost
              key={post.id}
              id={String(post.id)}
              title={post.title}
              content={post.content}
              author={post.authorName || "Anonymous"}
              createdAt={post.createdAt}
              commentCount={post.commentCount || 0}
              tags={post.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
