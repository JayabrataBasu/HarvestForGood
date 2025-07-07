import React, { useState, useEffect } from "react";
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
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localCount, setLocalCount] = useState(likesCount);

  useEffect(() => {
    setLocalLiked(isLiked);
    setLocalCount(likesCount);
  }, [isLiked, likesCount]);

  const handleClick = async () => {
    if (disabled || isAnimating) return;

    console.log("LikeButton clicked");
    setIsAnimating(true);

    const newLikedState = !localLiked;
    setLocalLiked(newLikedState);
    setLocalCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
      await onLike();
    } catch (error) {
      setLocalLiked(!newLikedState);
      setLocalCount((prev) => (newLikedState ? prev - 1 : prev + 1));
      console.error("Failed to like:", error);
    } finally {
      setTimeout(() => setIsAnimating(false), 800);
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
    <button
      onClick={handleClick}
      disabled={disabled || isAnimating}
      className={`
        flex items-center gap-2 rounded-full transition-all duration-300 transform
        hover:bg-red-50 hover:scale-110 active:scale-95 relative
        ${buttonSizeClasses[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${localLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"}
        ${isAnimating ? "animate-bounce" : ""}
      `}
    >
      <div className="relative">
        <Heart
          className={`
            ${sizeClasses[size]} transition-all duration-300 transform
            ${localLiked ? "fill-current scale-110" : "scale-100"}
            ${isAnimating ? "animate-pulse rotate-12" : "rotate-0"}
          `}
        />

        {isAnimating && (
          <div
            className={`
              absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              ${localLiked ? "bg-red-200" : "bg-gray-200"} 
              rounded-full opacity-30 animate-ping
            `}
            style={{
              width: size === "sm" ? "24px" : size === "md" ? "32px" : "40px",
              height: size === "sm" ? "24px" : size === "md" ? "32px" : "40px",
            }}
          />
        )}
      </div>

      {showCount && (
        <span
          className={`
            font-medium transition-all duration-300 transform
            ${isAnimating ? "animate-pulse scale-125" : "scale-100"}
            ${localLiked ? "text-red-600" : "text-gray-600"}
          `}
        >
          {localCount}
        </span>
      )}

      {isAnimating && localLiked && (
        <div className="absolute -top-2 -right-2 text-lg animate-bounce">
          💖
        </div>
      )}
    </button>
  );
};

export default LikeButton;
    </button>
  );
};

export default LikeButton;
          pointer-events: none;
        }
        
        .count-pop {
          animation: countPop 0.4s ease-out;
        }
        
        .ripple {
          animation: ping 0.5s ease-out;
        }
      `}</style>

      <button
        onClick={handleClick}
        disabled={disabled || isAnimating}
        className={`
          flex items-center gap-2 rounded-full transition-all duration-200 
          hover:bg-red-50 hover:scale-105 active:scale-95 relative
          ${buttonSizeClasses[size]}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${localLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"}
        `}
      >
        <div className="relative overflow-visible">
          <Heart
            className={`
              ${sizeClasses[size]} transition-all duration-200
              ${localLiked ? "fill-current" : ""}
              ${isAnimating && localLiked ? "heart-pop" : ""}
              ${isAnimating && !localLiked ? "heart-unpop" : ""}
            `}
          />

          {/* Floating hearts animation */}
          {showFloatingHearts && (
            <div className="absolute top-0 left-0 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  className={`
                    absolute top-0 left-0 ${sizeClasses[size]} 
                    ${i % 2 === 0 ? "text-red-400" : "text-pink-400"} 
                    fill-current float-heart
                  `}
                  style={{
                    animationDelay: `${i * 100}ms`,
                    left: `${(i - 2) * 3}px`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Ripple effect */}
          {isAnimating && (
            <div
              className={`
                absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                ${localLiked ? "bg-red-200" : "bg-gray-200"} 
                rounded-full opacity-30 ripple
              `}
              style={{
                width: size === "sm" ? "24px" : size === "md" ? "32px" : "40px",
                height:
                  size === "sm" ? "24px" : size === "md" ? "32px" : "40px",
              }}
            />
          )}
        </div>

        {showCount && (
          <span
            className={`
              font-medium transition-all duration-200
              ${isAnimating ? "count-pop" : ""}
              ${localLiked ? "text-red-600" : "text-gray-600"}
            `}
          >
            {localCount}
          </span>
        )}
      </button>
    </>
  );
};

export default LikeButton;
