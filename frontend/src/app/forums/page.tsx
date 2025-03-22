"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { forumAPI, isAuthenticated, API_BASE_URL } from "@/lib/api";
// Fix import path

// Make sure the ForumPost component exists and is properly imported
// If it doesn't exist, create it
import ForumPost from "./ForumPost"; // Fix path to where the component actually exists

// Define interface for forum post data
interface ForumPostType {
  id: string | number;
  title: string;
  content: string;
  authorName: string;
  authorId: string | number;
  createdAt: string;
  commentCount: number;
  tags?: string[];
}

export default function ForumsPage() {
  const [posts, setPosts] = useState<ForumPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<boolean>(false);

  useEffect(() => {
    // Check auth status on component mount
    if (typeof window !== "undefined") {
      setAuthStatus(isAuthenticated());
    }

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("API Base URL:", API_BASE_URL);

        const response = await forumAPI.getPosts();

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch posts");
        }

        const formattedPosts = response.data.map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          authorName: post.author_name || "Anonymous",
          authorId: post.author,
          createdAt: post.created_at,
          commentCount: post.comments_count || 0,
          tags: post.tags || [],
        }));

        setPosts(formattedPosts);
      } catch (err: unknown) {
        console.error("Error fetching forum posts:", err);

        if (
          err instanceof Error &&
          err.message.includes("Authentication required")
        ) {
          setError(
            "You need to be logged in to view forum posts. Please login to continue."
          );
        } else if (
          err instanceof Error &&
          (err.message.includes("Network error") ||
            err.message.includes("Failed to fetch"))
        ) {
          setError(
            "Cannot connect to the server. Please check your internet connection and make sure the API server is running."
          );
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load forum posts. Please try again later."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [authStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discussion Forums</h1>
        <p className="mt-2 text-lg text-gray-600">
          Join the conversation about sustainable food systems and community
          agriculture
        </p>
      </div>

      {/* Create Post button */}
      {authStatus && (
        <div className="mb-8 flex justify-end">
          <Link href="/forums/posts/new">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Create New Post
            </button>
          </Link>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* No posts message */}
      {!isLoading && !error && posts.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">
            No posts have been created yet.
          </p>
          {authStatus && (
            <p className="mt-2 text-gray-500">
              Be the first to start a discussion by clicking the &ldquo;Create
              New Post&rdquo; button!
            </p>
          )}
          {!authStatus && (
            <p className="mt-2 text-gray-500">
              <Link href="/login" className="text-green-600 hover:underline">
                Log in
              </Link>{" "}
              to create the first post!
            </p>
          )}
        </div>
      )}

      {/* Posts grid */}
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
