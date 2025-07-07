import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface Post {
  id: string;
  title: string;
  content: string;
  comments_count: number;
  likes_count: number;
  is_liked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

const PostCard = ({ post, onLike }: PostCardProps) => {
  const { user } = useAuth();
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [liked, setLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const guestInfo = localStorage.getItem("guestInfo");
    setIsGuestUser(!!guestInfo);
  }, []);

  const handleLike = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Optimistic update
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    // Call parent function
    onLike(post.id);

    // Reset animation after delay
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <>
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes heartBeat {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.2);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes floatHeart {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translateY(-30px) scale(1.2);
            opacity: 0;
          }
        }

        @keyframes countBounce {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }

        .heart-animate {
          animation: heartBeat 0.6s ease-out;
        }

        .float-heart {
          animation: floatHeart 1s ease-out forwards;
        }

        .count-bounce {
          animation: countBounce 0.4s ease-out;
        }

        .like-button:hover {
          transform: scale(1.05);
        }

        .like-button:active {
          transform: scale(0.95);
        }
      `}</style>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 transition-all hover:shadow-lg">
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center text-gray-500 text-sm">
            <span className="mr-4 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                ></path>
              </svg>
              {post.comments_count || 0} comments
            </span>

            {user || isGuestUser ? (
              <button
                onClick={handleLike}
                className={`
                  like-button flex items-center relative transition-all duration-200 p-2 rounded-full
                  ${liked ? "text-red-500" : "text-gray-500 hover:text-red-500"}
                  ${isAnimating ? "heart-animate" : ""}
                `}
              >
                <div className="relative">
                  <svg
                    className={`w-4 h-4 mr-1 transition-all duration-300 ${
                      liked ? "fill-current scale-110" : ""
                    }`}
                    fill={liked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>

                  {/* Floating hearts when liked */}
                  {isAnimating && liked && (
                    <>
                      <div className="absolute -top-2 -left-1 text-red-400 text-xs float-heart">
                        ❤️
                      </div>
                      <div
                        className="absolute -top-2 left-2 text-pink-400 text-xs float-heart"
                        style={{ animationDelay: "0.1s" }}
                      >
                        💖
                      </div>
                      <div
                        className="absolute -top-1 left-0 text-red-300 text-xs float-heart"
                        style={{ animationDelay: "0.2s" }}
                      >
                        💕
                      </div>
                    </>
                  )}

                  {/* Ripple effect */}
                  {isAnimating && (
                    <div className="absolute inset-0 rounded-full bg-red-200 opacity-50 animate-ping"></div>
                  )}
                </div>

                <span className={`${isAnimating ? "count-bounce" : ""}`}>
                  {likesCount} likes
                </span>
              </button>
            ) : (
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
                {likesCount} likes
              </span>
            )}
          </div>

          <Link
            href={`/forums/posts/${post.id}`}
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm"
          >
            View Post
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PostCard;
