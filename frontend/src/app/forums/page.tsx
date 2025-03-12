"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { forumAPI } from "@/lib/api";
import ForumPost from "./components/ForumPost";

// Define interface for forum post data
interface ForumPostType {
  id: string | number;
  title: string;
  content: string;
  authorName?: string;
  authorId?: string;
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
        setError(null);

        const response = await forumAPI.getPosts();

        // Process the API response to match our component's expected format
        const formattedPosts = response.data.map(
          (post: {
            id: string | number;
            title: string;
            content: string;
            authorName?: string;
            authorId?: string;
            createdAt: string;
            commentCount?: number;
            tags?: string[];
          }) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            authorName: post.authorName || "Anonymous",
            authorId: post.authorId,
            createdAt: post.createdAt,
            commentCount: post.commentCount || 0,
            tags: post.tags || [],
          })
        );

        setPosts(formattedPosts);
      } catch (err) {
        console.error("Error fetching forum posts:", err);
        setError("Failed to load forum posts. Please try again later.");
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

      {/* Create Post button */}
      <div className="mb-8 flex justify-end">
        <Link href="/forums/posts/new">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Create New Post
          </button>
        </Link>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm border animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="p-4 border border-red-500 bg-red-50 text-red-700 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No discussions yet. Be the first to start one!
          </p>
          <Link href="/forums/posts/new">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Create New Post
            </button>
          </Link>
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
