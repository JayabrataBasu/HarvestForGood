import React, { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onLike: () => Promise<void>;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  likesCount,
  onLike,
  disabled = false,
  size = "md",
  showCount = true,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (disabled || isAnimating) return;
    setIsAnimating(true);
    try {
      await onLike();
    } catch (error) {
      console.error("Failed to like:", error);
    } finally {
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const buttonSizeClasses = {
    sm: "p-1 text-sm",
    md: "p-2 text-base",
    lg: "p-3 text-lg",
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
        disabled={disabled || isAnimating}
        className={`
          flex items-center gap-2 rounded-full transition-all duration-300 transform
          hover:bg-red-50 hover:scale-110 active:scale-95 relative
          ${buttonSizeClasses[size]}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${isLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"}
        `}
      >
        <div className="relative">
          <Heart
            className={`
              ${sizeClasses[size]} transition-all duration-300 transform
              ${
                isLiked && isAnimating
                  ? "fill-current scale-110 heart-animate"
                  : isLiked
                  ? "fill-current scale-110"
                  : "scale-100"
              }
            `}
          />
          {isAnimating && isLiked && <span className="emoji-burst">💖</span>}
        </div>
        {showCount && (
          <span
            className={`
              font-medium transition-all duration-300 transform
              ${isAnimating ? "count-animate" : ""}
              ${isLiked ? "text-red-600" : "text-gray-600"}
            `}
          >
            {likesCount}
          </span>
        )}
        {isAnimating && isLiked && (
          <div className="absolute -top-2 -right-2 text-lg animate-bounce">
            {/* Optionally, keep this for extra burst */}
            {/* 💖 */}
          </div>
        )}
      </button>
    </>
  );
};

export default LikeButton;
