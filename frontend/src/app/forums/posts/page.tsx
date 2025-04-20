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
    <div className="min-h-screen bg-gradient-to-b from-background via-soft-green to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark text-gradient mb-2">
            Forum Posts
          </h1>
          {user && (
            <Link href="/forums/posts/new">
              <span className="inline-block bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                Create New Post
              </span>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-sm">
            <p className="text-gray-600 text-lg mb-4">
              No posts available yet.
            </p>
            {user && (
              <p className="mt-4">
                <Link
                  href="/forums/posts/new"
                  className="text-primary font-medium hover:text-primary-dark transition-colors"
                >
                  Create the first post!
                </Link>
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-8">
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
    </div>
  );
}
