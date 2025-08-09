import React from "react";
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

  const handleClick = async () => {
    try {
      await handleLike();
    } catch (error) {
      // Hook handles all error logging and state management
      console.error("Error handling like:", error);
    }
  };

  return (
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
            isLoading ? "animate-pulse" : ""
          }`}
        >
          {isLiked ? "❤️" : "🤍"}
        </span>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <span className="font-medium">
        {likesCount} {likesCount === 1 ? "like" : "likes"}
      </span>
    </button>
  );
};

export default TestLikeButton;
