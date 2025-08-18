import React, { useState } from "react";
import { useLike } from "@/hooks/useLike";

interface TestLikeButtonProps {
  postId: string;
  initialLikesCount?: number;
  initialIsLiked?: boolean;
}

const TestLikeButton: React.FC<TestLikeButtonProps> = ({
  postId,
  initialLikesCount = 0,
  initialIsLiked = false,
}) => {
  const { isLiked, likesCount, isLoading, handleLike } = useLike(
    postId,
    initialLikesCount,
    initialIsLiked
  );
  const [animate, setAnimate] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setAnimate(true);
    try {
      await handleLike();
    } catch (error) {
      // Hook handles all error logging and state management
      console.error("Error handling like:", error);
    } finally {
      setTimeout(() => setAnimate(false), 600);
    }
  };

  return (
    <>
      <style jsx>{`
        .heart-animate {
          animation: heartPop 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .count-animate {
          animation: countBounce 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .emoji-burst {
          position: absolute;
          left: 50%;
          top: -18px;
          transform: translateX(-50%);
          font-size: 1.3rem;
          opacity: 0.85;
          pointer-events: none;
          animation: burst 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes heartPop {
          0% {
            transform: scale(1);
          }
          30% {
            transform: scale(1.25);
          }
          50% {
            transform: scale(0.92);
          }
          70% {
            transform: scale(1.12);
          }
          85% {
            transform: scale(0.98);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes countBounce {
          0%,
          100% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.18);
          }
          60% {
            transform: scale(0.96);
          }
          80% {
            transform: scale(1.08);
          }
        }
        @keyframes burst {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.7);
          }
          30% {
            opacity: 1;
            transform: translateX(-50%) scale(1.15);
          }
          60% {
            opacity: 1;
            transform: translateX(-50%) scale(1.25);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) scale(1.5);
          }
        }
      `}</style>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform
          ${
            isLoading
              ? "cursor-not-allowed opacity-70"
              : "hover:scale-105 active:scale-95"
          }
          ${
            isLiked
              ? "bg-red-100 text-red-600 border-2 border-red-300 hover:bg-red-200"
              : "bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200"
          }
        `}
      >
        <div className="relative">
          <span
            className={`text-lg transition-all duration-300 ${
              animate ? "heart-animate" : ""
            }`}
          >
            {isLiked ? "❤️" : "🤍"}
          </span>
          {animate && isLiked && <span className="emoji-burst">💖</span>}
        </div>
        <span className={`font-medium ${animate ? "count-animate" : ""}`}>
          {likesCount} {likesCount === 1 ? "like" : "likes"}
        </span>
      </button>
    </>
  );
};

export default TestLikeButton;
