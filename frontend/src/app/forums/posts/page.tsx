"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { forumAPI } from "@/lib/api";

interface Post {
  id: string | number;
  title: string;
  content: string;
  authorName?: string;
  createdAt: string;
  commentCount?: number;
  tags?: string[];
  upvotes?: number;
}

export default function AllPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Initiating API request to fetch forum posts");
        // Pass the abort signal to allow cancellation
        const response = await forumAPI.getPosts(signal);

        if (!response) {
          throw new Error("Empty response received from server");
        }

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid data format received from server");
        }

        console.log(`Successfully fetched ${response.data.length} posts`);
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);

        // Don't set error state if the request was deliberately aborted
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Request was cancelled");
          return;
        }

        if (err instanceof Error) {
          if (
            err.message.includes("fetch") ||
            err.message.includes("network")
          ) {
            setError(
              "Network error: Please check your connection and try again"
            );
          } else if (
            err.message.includes("format") ||
            err.message.includes("data")
          ) {
            setError("Data format error: The server response was invalid");
          } else if (
            err.message.includes("500") ||
            err.message.includes("server")
          ) {
            setError(
              "Server error: Our servers are currently experiencing issues"
            );
          } else if (
            err.message.includes("401") ||
            err.message.includes("403")
          ) {
            setError("Authentication error: You may need to log in again");
          } else if (
            err.message.includes("404") ||
            err.message.includes("not found")
          ) {
            setError(
              "The API endpoint was not found. Please check the API path."
            );
          } else {
            setError(`Failed to fetch posts: ${err.message}`);
          }
        } else {
          setError("An unknown error occurred while fetching posts");
        }
      } finally {
        // Only set loading to false if the component is still mounted
        setIsLoading(false);
      }
    };

    fetchPosts();

    return () => {
      console.log("Cancelling forum posts fetch request");
      controller.abort();
    };
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "popular") {
      return (b.commentCount || 0) - (a.commentCount || 0);
    }
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forum Discussions
          </h1>
          <p className="text-gray-600">
            Join the conversation about sustainable agriculture
          </p>
        </div>
        <Link
          href="/forums/posts/new"
          className="mt-4 sm:mt-0 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
        >
          Create Post
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm p-3 mb-6 border">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-full ${
              sortBy === "recent" ? "bg-gray-100 font-medium" : ""
            }`}
            onClick={() => setSortBy("recent")}
          >
            Recent
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              sortBy === "popular" ? "bg-gray-100 font-medium" : ""
            }`}
            onClick={() => setSortBy("popular")}
          >
            Popular
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm border animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-500 rounded-md mb-6 text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="text-center p-10 bg-white rounded-lg shadow-sm border">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No discussions yet
          </h3>
          <p className="text-gray-500 mb-4">
            Be the first to start a conversation!
          </p>
          <Link
            href="/forums/posts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Create a Post
          </Link>
        </div>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <Link href={`/forums/posts/${post.id}`} className="block">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-green-700">
                  {post.title}
                </h2>
              </Link>

              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span className="mr-3">{post.authorName || "Anonymous"}</span>
                <span className="mr-3">•</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-2">{post.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-4 text-gray-500">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    <span>{post.upvotes || 0}</span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <span>{post.commentCount || 0} comments</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
