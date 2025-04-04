"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ForumPost from "../ForumPost";
import { useAuth } from "../../../contexts/AuthContext";
import { API_BASE_URL } from "@/lib/api";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  comment_count: number;
  tags?: string[];
}

// Improved fetch function with better error handling
const fetchPosts = async (): Promise<Post[]> => {
  try {
    // Remove the duplicate /api prefix since API_BASE_URL already includes it
    const response = await fetch(`${API_BASE_URL}/forum/posts/`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch posts: HTTP ${response.status} - ${errorText}`
      );
      throw new Error(`Failed to fetch posts: HTTP ${response.status}`);
    }

    const data = await response.json();

    // Handle different API response structures
    if (Array.isArray(data)) {
      return data; // Response is already an array
    } else if (data.results && Array.isArray(data.results)) {
      return data.results; // Response is paginated with a results array
    } else {
      console.error("Unexpected API response structure:", data);
      return []; // Return empty array as fallback
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return []; // Return empty array instead of throwing to avoid breaking the UI
  }
};

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError("Failed to load posts. Please try again later.");
        console.error("Error loading posts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Forum Posts</h1>
        {user && (
          <Link href="/forums/posts/new">
            <span className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
              Create New Post
            </span>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No posts available yet.</p>
          {user && (
            <p className="mt-4">
              <Link href="/forums/posts/new">
                <span className="text-green-600 hover:underline">
                  Create the first post!
                </span>
              </Link>
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <ForumPost
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              author={post.author}
              createdAt={post.created_at}
              commentCount={post.comment_count}
              tags={post.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
