import React, { useState } from "react";
import { Heart } from "lucide-react";

interface TestLikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onLike: () => Promise<void>;
}

const TestLikeButton: React.FC<TestLikeButtonProps> = ({
  isLiked,
  likesCount,
  onLike,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localCount, setLocalCount] = useState(likesCount);

  const handleClick = async () => {
    console.log("TestLikeButton clicked!");
    setIsAnimating(true);

    const newLikedState = !localLiked;
    setLocalLiked(newLikedState);
    setLocalCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    try {
      await onLike();
      console.log("Like action successful");
    } catch (error) {
      console.error("Like failed:", error);
      setLocalLiked(!newLikedState);
      setLocalCount((prev) => (newLikedState ? prev - 1 : prev + 1));
    } finally {
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        className={`
          relative p-3 rounded-full transition-all duration-300 transform
          ${localLiked ? "text-red-500 bg-red-50" : "text-gray-500 bg-gray-50"}
          ${isAnimating ? "animate-bounce scale-125" : "scale-100"}
          hover:scale-110 active:scale-95 hover:shadow-lg
          border-2 ${localLiked ? "border-red-200" : "border-gray-200"}
        `}
        disabled={isAnimating}
      >
        <Heart
          className={`
            w-6 h-6 transition-all duration-300
            ${localLiked ? "fill-current animate-pulse" : ""}
            ${isAnimating ? "rotate-12" : "rotate-0"}
          `}
        />

        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-400 opacity-30 animate-ping" />
        )}
      </button>

      <span
        className={`
          text-lg font-bold transition-all duration-300
          ${localLiked ? "text-red-600" : "text-gray-600"}
          ${isAnimating ? "animate-pulse scale-125" : "scale-100"}
        `}
      >
        {localCount}
      </span>

      {isAnimating && localLiked && (
        <div className="absolute text-2xl animate-bounce">❤️</div>
      )}

      <div className="text-xs text-gray-400">
        {isAnimating ? "🔄" : localLiked ? "❤️" : "🤍"}
      </div>
    </div>
  );
};

export default TestLikeButton;
