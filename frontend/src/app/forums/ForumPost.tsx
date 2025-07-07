import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ForumPostProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  commentCount: number;
  tags?: string[];
  isGuest?: boolean;
}

export default function ForumPost({
  id,
  title,
  content,
  author,
  createdAt,
  commentCount,
  tags,
  isGuest = false,
}: ForumPostProps) {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [likesCount, setLikesCount] = useState(0); // You'll need to pass this as a prop

  const formattedDate = new Date(createdAt);
  const timeAgo = formatDistanceToNow(formattedDate, { addSuffix: true });

  // Truncate content if it's too long
  const truncatedContent =
    content.length > 250 ? content.slice(0, 250) + "..." : content;

  const handleQuickLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to post
    e.stopPropagation();

    if (isLikeAnimating) return;

    setIsLikeAnimating(true);
    setLikesCount((prev) => prev + 1);

    // Simple animation without API call for now
    setTimeout(() => {
      setIsLikeAnimating(false);
    }, 600);
  };

  return (
    <>
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes miniHeartPop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes miniFloat {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-20px) scale(0.3);
            opacity: 0;
          }
        }

        .mini-heart-pop {
          animation: miniHeartPop 0.3s ease-out;
        }

        .mini-float {
          animation: miniFloat 0.6s ease-out forwards;
        }
      `}</style>

      <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
              <Link href={`/forums/posts/${id}`}>{title}</Link>
            </h2>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-gray-600 mb-4">{truncatedContent}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <span className="flex items-center">
                <span className="mr-1">By</span>
                <span className={`font-medium ${isGuest ? "italic" : ""}`}>
                  {author}
                </span>
                {isGuest && <span className="ml-1 text-xs">(Guest)</span>}
              </span>
              <span className="mx-2">•</span>
              <time dateTime={createdAt}>{timeAgo}</time>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick like button */}
              <button
                onClick={handleQuickLike}
                className={`
                  flex items-center space-x-1 text-gray-400 hover:text-red-500 
                  transition-colors duration-200 relative
                  ${isLikeAnimating ? "text-red-500" : ""}
                `}
              >
                <div className="relative">
                  <span
                    className={`text-lg ${
                      isLikeAnimating ? "mini-heart-pop" : ""
                    }`}
                  >
                    {isLikeAnimating ? "❤️" : "🤍"}
                  </span>

                  {/* Mini floating heart */}
                  {isLikeAnimating && (
                    <span className="absolute top-0 left-0 mini-float">❤️</span>
                  )}
                </div>
                <span className="text-xs">{likesCount}</span>
              </button>

              {/* Comments link */}
              <Link href={`/forums/posts/${id}`}>
                <span className="flex items-center text-primary hover:text-primary-dark">
                  <span>{commentCount}</span>
                  <span className="ml-1">
                    {commentCount === 1 ? "comment" : "comments"}
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
