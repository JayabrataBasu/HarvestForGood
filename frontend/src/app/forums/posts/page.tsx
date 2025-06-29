"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ForumPost from "../ForumPost";
import { useAuth } from "../../../contexts/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import GuestAuthModal, { GuestInfo } from "../GuestAuthModal";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  author_name?: string;
  guest_name?: string;
  guest_affiliation?: string;
  created_at: string;
  comments_count: number;
  tags?: string[];
}

// Improved fetch function with better error handling
const fetchPosts = async (): Promise<Post[]> => {
  try {
    // Use consistent singular form
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

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [showGuestAuthModal, setShowGuestAuthModal] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);

  // Check for existing guest info on component mount
  useEffect(() => {
    const storedGuestInfo = localStorage.getItem("guestInfo");
    if (storedGuestInfo) {
      try {
        const parsedInfo = JSON.parse(storedGuestInfo);
        setGuestInfo(parsedInfo);
        setIsGuestUser(true);
      } catch (e) {
        console.error("Error parsing stored guest info:", e);
        localStorage.removeItem("guestInfo");
      }
    }
  }, []);

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

  const handleGuestAuth = (info: GuestInfo) => {
    setGuestInfo(info);
    setIsGuestUser(true);
    setShowGuestAuthModal(false);

    // Store in localStorage for persistent guest session
    localStorage.setItem("guestInfo", JSON.stringify(info));
  };

  // Clear guest session
  const handleClearGuestSession = () => {
    localStorage.removeItem("guestInfo");
    setGuestInfo(null);
    setIsGuestUser(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-soft-green to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark text-gradient mb-2">
            Forum Posts
          </h1>
          <div className="flex items-center space-x-4">
            {/* Show authentication options for non-authenticated users */}
            {!user && !isGuestUser && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowGuestAuthModal(true)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition duration-300"
                >
                  Continue as Guest
                </button>
                <Link
                  href="/login?redirect=/forums/posts"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-300"
                >
                  Login for Full Access
                </Link>
              </div>
            )}
            {/* Show guest user info if in guest mode */}
            {isGuestUser && guestInfo && (
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Hello, {guestInfo.name}!</span>
                <button
                  onClick={handleClearGuestSession}
                  className="text-red-600 hover:text-red-800 text-sm underline"
                >
                  Exit Guest Mode
                </button>
              </div>
            )}
            {/* Show new post button only if user is authenticated (either registered or guest) */}
            {(user || isGuestUser) && (
              <Link
                href="/forums/posts/new"
                className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition duration-300"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                New Post
              </Link>
            )}
          </div>
        </div>

        {/* Authentication banner for non-authenticated users */}
        {!user && !isGuestUser && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
            <h3 className="font-semibold text-lg mb-2">Join the Discussion</h3>
            <p className="mb-3">
              You&apos;re currently in view-only mode. Sign in or continue as a
              guest to interact with forum posts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowGuestAuthModal(true)}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-md transition duration-300"
              >
                Continue as Guest
              </button>
              <Link
                href="/login?redirect=/forums/posts"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
              >
                Login for Full Access
              </Link>
            </div>
          </div>
        )}

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
            {(user || isGuestUser) && (
              <p className="mt-4">
                <Link
                  href="/forums/posts/new"
                  className="text-primary font-medium hover:text-primary-dark transition-colors"
                >
                  Create the first post!
                </Link>
              </p>
            )}
            {!user && !isGuestUser && (
              <div className="mt-6 space-y-4">
                <p className="text-gray-600">
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Log in
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/register"
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Create an account
                  </Link>{" "}
                  to start posting, or{" "}
                  <button
                    onClick={() => setShowGuestAuthModal(true)}
                    className="text-primary hover:text-primary-dark font-medium underline"
                  >
                    continue as guest
                  </button>
                </p>
              </div>
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
                author={post.author_name || post.guest_name || "Anonymous"}
                createdAt={post.created_at}
                commentCount={post.comments_count || 0}
                tags={post.tags}
                isGuest={!!post.guest_name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Guest authentication modal */}
      <GuestAuthModal
        isOpen={showGuestAuthModal}
        onClose={() => setShowGuestAuthModal(false)}
        onSubmit={handleGuestAuth}
        mode="post"
      />
    </div>
  );
}
