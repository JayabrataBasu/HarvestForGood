"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, API_BASE_URL, forumAPI } from "@/lib/api";
import { use } from "react"; // Remove eslint-disable comment since we're using it now

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

export default function PostDetail({ params }: { params: { id: string } }) {
  // Fix the typechecking for params unwrapping
  const unwrappedParams =
    typeof params === "object" &&
    params !== null &&
    "then" in params &&
    typeof params.then === "function"
      ? use(params as unknown as Promise<{ id: string }>)
      : params;
  const postId = unwrappedParams.id;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
    if (!post) return;

    try {
      const result = await forumAPI.likePost(postId);

      if (result.success) {
        // Update the post with new like count
        setPost((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            likes_count: (prev.likes_count || 0) + 1,
          };
        });
      } else {
        console.error("Failed to like post:", result.message);
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);

    try {
      const result = await forumAPI.createComment(postId, newComment);

      if (result.success) {
        // Update our post state with the new comment
        if (post && result.data) {
          const newCommentData = result.data;

          setPost({
            ...post,
            comments: [...post.comments, newCommentData],
          });

          // Clear the comment input
          setNewComment("");
        }
      } else {
        throw new Error("Failed to submit comment");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Loading state
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

  // Error state
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

  // Main content with post
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
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

        {/* Post */}
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

            {/* Post content */}
            <div className="prose max-w-none mb-6">
              {post.content.split("\n").map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Post actions */}
            <div className="flex items-center space-x-6 border-t border-gray-100 pt-4">
              <button
                onClick={handleLike}
                className="flex items-center space-x-1 text-gray-500 hover:text-primary transition-colors"
              >
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
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <span>{post.likes_count} likes</span>
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

        {/* Comments section */}
        <section className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-card">
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-6 text-primary-dark">
              Comments
            </h2>

            {/* Add comment form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
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

            {/* Comments list */}
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
        </section>
      </div>
    </div>
  );
}
