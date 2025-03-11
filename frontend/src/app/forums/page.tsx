"use client";

import { useState, useEffect } from "react";
import ForumPost from "./components/ForumPost";

// Define interface for forum post data
interface ForumPostType {
  id: string | number;
  title: string;
  content: string;
  authorName?: string;
  createdAt: string;
  commentCount?: number;
  tags: string[];
}

export default function ForumsPage() {
  const [posts, setPosts] = useState<ForumPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch("/api/forum/posts", {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data.data || []);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
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
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-800 font-medium hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
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
        <div className="space-y-6">
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
