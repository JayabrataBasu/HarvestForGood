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
  const [likesCount, setLikesCount] = useState(0);

  const formattedDate = new Date(createdAt);
  const timeAgo = formatDistanceToNow(formattedDate, { addSuffix: true });

  const truncatedContent =
    content.length > 250 ? content.slice(0, 250) + "..." : content;

  const handleQuickLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLikeAnimating) return;

    setIsLikeAnimating(true);
    setLikesCount((prev) => prev + 1);

    setTimeout(() => {
      setIsLikeAnimating(false);
    }, 600);
  };

  return (
    <>
      {/* Enhanced CSS animations with farm theme */}
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

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mini-heart-pop {
          animation: miniHeartPop 0.3s ease-out;
        }

        .mini-float {
          animation: miniFloat 0.6s ease-out forwards;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>

      <article className="bg-gradient-to-br from-[#FEFBE9] to-[#F1F9DC] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] overflow-hidden border border-[#EDE9D4] border-l-4 border-l-[#A4C46F] fade-in">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-[#2E382E] hover:text-[#3D9A50] transition-colors">
              <Link href={`/forums/posts/${id}`}>{title}</Link>
            </h2>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#A0C49D] text-white shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-[#4B4B3B] mb-4 leading-relaxed">
            {truncatedContent}
          </p>

          <div className="flex items-center justify-between text-sm text-[#5A6E3A]">
            <div className="flex items-center">
              <span className="flex items-center">
                <span className="mr-1">By</span>
                <span className={`font-medium ${isGuest ? "italic" : ""}`}>
                  {author}
                </span>
                {isGuest && <span className="ml-1 text-xs">(Guest)</span>}
              </span>
              <span className="mx-2 text-[#A0C49D]">•</span>
              <time dateTime={createdAt} className="italic">
                {timeAgo}
              </time>
            </div>

            <div className="flex items-center space-x-4">
              {/* Enhanced quick like button */}
              <button
                onClick={handleQuickLike}
                className={`
                  flex items-center space-x-1 text-[#A0C49D] hover:text-[#78B86B] 
                  transition-all duration-200 relative px-2 py-1 rounded-lg hover:bg-white/50
                  ${isLikeAnimating ? "text-[#78B86B]" : ""}
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

                  {isLikeAnimating && (
                    <span className="absolute top-0 left-0 mini-float">❤️</span>
                  )}
                </div>
                <span className="text-xs font-medium">{likesCount}</span>
              </button>

              {/* Enhanced comments link */}
              <Link href={`/forums/posts/${id}`}>
                <span className="flex items-center text-[#3D9A50] hover:text-[#368442] transition-colors px-2 py-1 rounded-lg hover:bg-white/50">
                  <span className="font-medium">{commentCount}</span>
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
