import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { FaThumbtack } from "react-icons/fa";
import { useLike } from "@/hooks/useLike";

interface Post {
  id: string;
  title: string;
  content: string;
  comments_count: number;
  likes_count: number;
  is_liked?: boolean;
  pinned?: boolean; // Add this field
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onPin?: (postId: string, pin: boolean) => void; // Add this prop
}

const PostCard = ({ post, onLike, onPin }: PostCardProps) => {
  const { user } = useAuth();
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [animate, setAnimate] = useState(false);

  const {
    isLiked,
    likesCount,
    isLoading: isLikeLoading,
    handleLike,
  } = useLike(post.id, post.likes_count || 0, post.is_liked || false);

  useEffect(() => {
    const guestInfo = localStorage.getItem("guestInfo");
    setIsGuestUser(!!guestInfo);
  }, []);

  const handleLikeClick = async () => {
    if (isLikeLoading) return;
    setAnimate(true);
    try {
      await handleLike();
      onLike(post.id);
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setTimeout(() => setAnimate(false), 600);
    }
  };

  // Add admin check
  const isSuperuser = user?.isSuperuser;

  const handlePin = () => {
    if (onPin) onPin(post.id, !post.pinned);
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
        .count-bounce {
          animation: countBounce 0.4s ease-out;
        }
        .emoji-burst {
          position: absolute;
          left: 50%;
          top: -14px;
          transform: translateX(-50%);
          font-size: 1.1rem;
          opacity: 0.85;
          pointer-events: none;
          animation: burst 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes burst {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.7);
          }
          60% {
            opacity: 1;
            transform: translateX(-50%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) scale(1.4);
          }
        }

        .like-button:hover {
          transform: scale(1.05);
        }

        .like-button:active {
          transform: scale(0.95);
        }
      `}</style>

      <div
        className={`modern-card ${
          post.pinned ? "border-yellow-400 border-2" : ""
        }`}
      >
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center text-gray-500 text-sm">
            {/* Pin icon and label */}
            {post.pinned && (
              <span className="flex items-center mr-3 text-yellow-600 font-semibold">
                <FaThumbtack className="mr-1" />
                Pinned
              </span>
            )}
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
                onClick={handleLikeClick}
                disabled={isLikeLoading}
                className={`
                  like-button flex items-center relative transition-all duration-200 p-2 rounded-full
                  ${isLikeLoading ? "cursor-not-allowed opacity-70" : ""}
                  ${
                    isLiked
                      ? "text-red-500"
                      : "text-gray-500 hover:text-red-500"
                  }
                `}
              >
                <div className="relative">
                  <svg
                    className={`w-4 h-4 mr-1 transition-all duration-300 ${
                      isLiked && animate ? "heart-animate" : ""
                    }`}
                    fill={isLiked ? "currentColor" : "none"}
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
                  {animate && isLiked && (
                    <span className="emoji-burst">💖</span>
                  )}
                </div>
                <span className={animate ? "count-bounce" : ""}>
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
          <div className="flex items-center gap-2">
            {/* Pin/Unpin button for admin */}
            {isSuperuser && (
              <button
                onClick={handlePin}
                className={`flex items-center px-2 py-1 rounded text-xs font-medium border ${
                  post.pinned
                    ? "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
                title={post.pinned ? "Unpin this post" : "Pin this post"}
              >
                <FaThumbtack className="mr-1" />
                {post.pinned ? "Unpin" : "Pin"}
              </button>
            )}
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
      </div>
    </>
  );
};

export default PostCard;
