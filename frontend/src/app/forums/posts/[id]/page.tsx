"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import GuestAuthModal, { GuestInfo } from "../../GuestAuthModal";

interface Author {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Comment {
  id: number;
  content: string;
  author: Author;
  created_at: string;
  updated_at: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: Author;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments: Comment[];
}

export default function ForumPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [postId, setPostId] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const { user } = useAuth();
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [showGuestAuthModal, setShowGuestAuthModal] = useState(false);
  const router = useRouter();
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(0);

  // Handle params Promise resolution
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);
    };

    resolveParams();
  }, [params]);

  // Check for existing guest info on component mount
  useEffect(() => {
    const storedGuestInfo = localStorage.getItem("guestInfo");
    if (storedGuestInfo) {
      try {
        JSON.parse(storedGuestInfo);
        setIsGuestUser(true);
      } catch (e) {
        console.error("Error parsing stored guest info:", e);
        localStorage.removeItem("guestInfo");
      }
    }
  }, []);

  useEffect(() => {
    if (!postId) return; // Wait for postId to be resolved

    // Check if user is authenticated
    if (!isAuthenticated() && typeof window !== "undefined") {
      router.push(`/login?redirect=/forums/posts/${postId}`);
      return;
    }

    // Fetch post details
    async function fetchPost() {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const data = await response.json();
        setPost(data);
        setError("");
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId, router]);

  // Update local likes count when post loads
  useEffect(() => {
    if (post) {
      setLocalLikesCount(post.likes_count || 0);
    }
  }, [post]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLike = async () => {
    if (!post || isLikeAnimating) return;

    setIsLikeAnimating(true);

    // Optimistic update
    setLocalLikesCount((prev) => prev + 1);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/forum/posts/${postId}/like/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLocalLikesCount(data.likes_count || localLikesCount);
        console.log("Like successful!");
      } else {
        // Revert optimistic update
        setLocalLikesCount((prev) => prev - 1);
        console.error("Failed to like post");
      }
    } catch (err) {
      // Revert optimistic update
      setLocalLikesCount((prev) => prev - 1);
      console.error("Error liking post:", err);
    } finally {
      setTimeout(() => setIsLikeAnimating(false), 800);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !postId) return;

    setSubmittingComment(true);

    try {
      const token = localStorage.getItem("access_token");

      console.log("Attempting to submit comment:", {
        postId,
        content: newComment.trim(),
        token: token ? "present" : "missing",
        API_BASE_URL,
      });

      // Simplified approach - try the most common patterns first
      const response = await fetch(`${API_BASE_URL}/forum/comments/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: parseInt(postId),
          content: newComment.trim(),
        }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const newCommentData = await response.json();
        console.log("Comment created successfully:", newCommentData);

        if (post) {
          setPost({
            ...post,
            comments: [...post.comments, newCommentData],
          });
          setNewComment("");
        }
      } else {
        // Get the actual error response
        const errorText = await response.text();
        console.log("Raw error response:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
          console.log("Parsed error data:", errorData);
        } catch (parseError) {
          console.log("Could not parse error as JSON:", parseError);
          errorData = { message: errorText };
        }

        // Show detailed error information
        let userMessage = "Failed to submit comment:\n";

        if (response.status === 400) {
          if (errorData.post) {
            userMessage += `Post field error: ${
              Array.isArray(errorData.post)
                ? errorData.post.join(", ")
                : errorData.post
            }\n`;
          }
          if (errorData.content) {
            userMessage += `Content field error: ${
              Array.isArray(errorData.content)
                ? errorData.content.join(", ")
                : errorData.content
            }\n`;
          }
          if (errorData.non_field_errors) {
            userMessage += `General errors: ${
              Array.isArray(errorData.non_field_errors)
                ? errorData.non_field_errors.join(", ")
                : errorData.non_field_errors
            }\n`;
          }
          if (errorData.detail) {
            userMessage += `Detail: ${errorData.detail}\n`;
          }

          // If no specific field errors, show the raw response
          if (
            !errorData.post &&
            !errorData.content &&
            !errorData.non_field_errors &&
            !errorData.detail
          ) {
            userMessage += `Server response: ${errorText}\n`;
          }
        } else if (response.status === 401) {
          userMessage += "Authentication required. Please log in again.";
        } else if (response.status === 403) {
          userMessage +=
            "Permission denied. You may not have access to comment on this post.";
        } else if (response.status === 404) {
          userMessage +=
            "Comment endpoint not found. The API may have changed.";
        } else {
          userMessage += `Server error (${response.status}): ${response.statusText}\nResponse: ${errorText}`;
        }

        alert(userMessage);

        // Log comprehensive error information for debugging
        console.error("Comment submission failed:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          errorText,
          errorData,
          requestBody: {
            post: parseInt(postId),
            content: newComment.trim(),
          },
        });
      }
    } catch (err) {
      console.error("Network error submitting comment:", err);
      alert(
        "Network error occurred while submitting comment. Please check your connection and try again."
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleGuestAuth = (info: GuestInfo) => {
    setIsGuestUser(true);
    setShowGuestAuthModal(false);
    localStorage.setItem("guestInfo", JSON.stringify(info));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-red-600 mb-4">{error || "Post not found"}</p>
            <Link
              href="/forums/posts"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Back to all posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-soft-green to-background py-12">
        <div className="container mx-auto px-4">
          <nav className="mb-6">
            <Link
              href="/forums/posts"
              className="text-primary hover:text-primary-dark flex items-center font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to all posts
            </Link>
          </nav>

          <article className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-card mb-6">
            <div className="p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {post.title}
              </h1>
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span className="font-medium text-primary-dark">
                  Posted by {post.author.first_name} {post.author.last_name} •{" "}
                  {formatDate(post.created_at)}
                </span>
              </div>

              <div className="prose max-w-none mb-6">
                {post.content.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="flex items-center space-x-6 border-t border-gray-100 pt-4">
                <button
                  onClick={handleLike}
                  disabled={isLikeAnimating}
                  className={`
                  flex items-center space-x-2 text-gray-500 hover:text-red-500 
                  transition-all duration-300 transform hover:scale-110 active:scale-95
                  ${isLikeAnimating ? "text-red-500 animate-bounce" : ""}
                  relative p-2 rounded-full
                `}
                >
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`
                      h-6 w-6 transition-all duration-300 transform
                      ${
                        isLikeAnimating
                          ? "fill-current scale-125 animate-pulse"
                          : ""
                      }
                    `}
                      fill={isLikeAnimating ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>

                    {/* Floating emoji hearts */}
                    {isLikeAnimating && (
                      <>
                        <div
                          className="absolute -top-3 -left-2 text-lg animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        >
                          ❤️
                        </div>
                        <div
                          className="absolute -top-2 left-2 text-sm animate-bounce"
                          style={{ animationDelay: "100ms" }}
                        >
                          💖
                        </div>
                        <div
                          className="absolute -top-1 left-0 text-xs animate-bounce"
                          style={{ animationDelay: "200ms" }}
                        >
                          💕
                        </div>
                      </>
                    )}

                    {/* Ripple effect */}
                    {isLikeAnimating && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-red-200 rounded-full opacity-30 animate-ping"></div>
                    )}
                  </div>

                  <span
                    className={`transition-all duration-300 transform ${
                      isLikeAnimating
                        ? "animate-pulse scale-125 text-red-600 font-bold"
                        : ""
                    }`}
                  >
                    {localLikesCount} likes
                  </span>
                </button>

                <div className="flex items-center space-x-1 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <span>{post.comments.length} comments</span>
                </div>
              </div>
            </div>
          </article>

          {!user && !isGuestUser && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
              <h3 className="font-semibold text-lg mb-2">
                Join the Discussion
              </h3>
              <p className="mb-3">
                You&apos;re currently in view-only mode. Sign in or continue as
                a guest to interact with this post.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowGuestAuthModal(true)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-md transition duration-300"
                >
                  Continue as Guest
                </button>
                <Link
                  href={`/login?redirect=/forums/posts/${postId}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-300"
                >
                  Login for Full Access
                </Link>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Comments</h2>

            {(user || isGuestUser) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Leave a Comment</h3>
                <form onSubmit={handleCommentSubmit}>
                  <div className="mb-4">
                    <textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent bg-white"
                      rows={3}
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className={`inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 ${
                        submittingComment || !newComment.trim()
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-6">
              {post.comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                  Be the first to comment on this post!
                </p>
              ) : (
                post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-100 pb-6 last:border-0"
                  >
                    <div className="flex items-center mb-2">
                      <div className="font-medium text-primary-dark">
                        {comment.author.first_name} {comment.author.last_name}
                      </div>
                      <span className="mx-2 text-gray-300">•</span>
                      <div className="text-sm text-gray-500">
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                    <div className="text-gray-700">
                      {comment.content.split("\n").map((paragraph, idx) => (
                        <p key={idx} className="mb-2 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {showGuestAuthModal && (
        <GuestAuthModal
          isOpen={showGuestAuthModal}
          onClose={() => setShowGuestAuthModal(false)}
          onSubmit={handleGuestAuth}
          mode="comment"
        />
      )}
    </>
  );
}
