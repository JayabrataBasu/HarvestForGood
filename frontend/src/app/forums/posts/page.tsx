"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ForumPost from "../ForumPost";
import { useAuth } from "../../../contexts/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import GuestAuthModal, { GuestInfo } from "../GuestAuthModal";
import ForumFilters from "../../../components/forum/ForumFilters";
import Pagination from "../../../components/forum/Pagination";

interface Post {
  id: string;
  title: string;
  content: string;
  author:
    | string
    | {
        username?: string;
        first_name?: string;
        last_name?: string;
      };
  author_name?: string;
  guest_name?: string;
  guest_affiliation?: string;
  created_at: string;
  comments_count: number;
  tags?: Array<{ name: string; usage_count: number }>;
  pinned?: boolean;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_previous: boolean;
  page_size: number;
}

interface ForumFilters {
  search: string;
  tags: string;
  dateFrom: string;
  dateTo: string;
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_next: false,
    has_previous: false,
    page_size: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [showGuestAuthModal, setShowGuestAuthModal] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [filters, setFilters] = useState<ForumFilters>({
    search: "",
    tags: "",
    dateFrom: "",
    dateTo: "",
  });

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

  const fetchPosts = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      try {
        setIsLoading(true);

        const params = new URLSearchParams({
          page: page.toString(),
          page_size: pageSize.toString(),
        });

        // Add filters to params
        if (filters.search) params.append("search", filters.search);
        if (filters.tags) params.append("tags", filters.tags);
        if (filters.dateFrom) params.append("date_from", filters.dateFrom);
        if (filters.dateTo) params.append("date_to", filters.dateTo);

        const response = await fetch(`${API_BASE_URL}/forum/posts/?${params}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.results && data.pagination) {
          setPosts(data.results);
          setPagination(data.pagination);
        } else if (Array.isArray(data)) {
          // Fallback for non-paginated response
          setPosts(data);
          setPagination((prev) => ({ ...prev, total_items: data.length }));
        }

        setError(null);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setError("Failed to load posts. Please try again later.");
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchPosts(1, pagination.page_size);
  }, [filters, fetchPosts, pagination.page_size]);

  const handleFiltersChange = useCallback((newFilters: ForumFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchPosts(page, pagination.page_size);
    },
    [fetchPosts, pagination.page_size]
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      fetchPosts(1, pageSize);
    },
    [fetchPosts]
  );

  const handleGuestAuth = (info: GuestInfo) => {
    setGuestInfo(info);
    setIsGuestUser(true);
    setShowGuestAuthModal(false);
    localStorage.setItem("guestInfo", JSON.stringify(info));
  };

  const handleClearGuestSession = () => {
    localStorage.removeItem("guestInfo");
    setGuestInfo(null);
    setIsGuestUser(false);
  };

  const handlePin = async (postId: string) => {
    await fetch(`/api/forum/posts/${postId}/pin/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        // Add Authorization header if needed
      },
    });
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-soft-green to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark text-gradient mb-2">
            Forum Posts
          </h1>
          <div className="flex items-center space-x-4">
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
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Post
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <ForumFilters onFiltersChange={handleFiltersChange} />

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
              No posts match your search criteria.
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
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {posts.map((post) => {
                const tagNames = post.tags?.map((tag) => tag.name) || [];
                // Better author name handling
                const authorName =
                  post.author_name ||
                  post.guest_name ||
                  (post.author && typeof post.author === "object"
                    ? `${post.author.first_name || ""} ${
                        post.author.last_name || ""
                      }`.trim() || post.author.username
                    : post.author) ||
                  "Anonymous";

                return (
                  <ForumPost
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    author={authorName}
                    tags={tagNames}
                    createdAt={post.created_at}
                    commentCount={post.comments_count || 0}
                    pinned={post.pinned}
                    onPin={handlePin}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.total_pages}
                  totalItems={pagination.total_items}
                  pageSize={pagination.page_size}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </>
        )}

        {/* Guest authentication modal */}
        <GuestAuthModal
          isOpen={showGuestAuthModal}
          onClose={() => setShowGuestAuthModal(false)}
          onSubmit={handleGuestAuth}
          mode="post"
        />
      </div>
    </div>
  );
}
