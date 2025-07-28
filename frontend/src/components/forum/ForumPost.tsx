import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FaThumbtack } from "react-icons/fa"; // install react-icons if not present

interface ForumPostProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  commentCount: number;
  tags?: string[];
  isGuest?: boolean;
  // Add these props for comment preview
  latestCommentSnippet?: string;
  latestCommenter?: string;
  pinned?: boolean; // Add this field
}

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  return Array.from(new Set(text.match(urlRegex) || []));
}

function linkify(text: string): React.ReactNode[] {
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  const parts = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;
  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const url = match[0];
    parts.push(
      <a
        key={`url-${idx++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline break-all hover:text-blue-800 pointer-events-auto"
      >
        {url}
      </a>
    );
    lastIndex = match.index + url.length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
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
  latestCommentSnippet,
  latestCommenter,
  pinned,
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

  const urls = extractUrls(content);

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

      <article
        className={`modern-card fade-in ${
          pinned ? "border-yellow-400 border-2" : ""
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-[#2E382E] hover:text-[#3D9A50] transition-colors">
                {/* Use Link without legacyBehavior and <a> */}
                <Link href={`/forums/posts/${id}`} tabIndex={0}>
                  {title}
                </Link>
              </h2>
              {/* Pin icon and label */}
              {pinned && (
                <span className="flex items-center ml-3 text-yellow-600 font-semibold">
                  <FaThumbtack className="mr-1" />
                  Pinned
                </span>
              )}
            </div>

            {/* Tags Display */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 ml-4">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full shadow-sm hover:bg-green-200 transition-colors"
                    title={`#${tag} tag`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="text-[#4B4B3B] mb-4 leading-relaxed">
            {linkify(truncatedContent)}
          </p>

          {/* Latest comment preview */}
          {latestCommentSnippet && (
            <div className="mb-3 px-3 py-2 bg-[#F6F8ED] border-l-4 border-[#A0C49D] rounded text-sm text-[#5A6E3A]">
              <span className="font-semibold">
                {latestCommenter ? latestCommenter : "Latest comment"}:
              </span>{" "}
              <span className="italic">{latestCommentSnippet}</span>
            </div>
          )}

          {/* Link preview cards */}
          {urls.length > 0 && (
            <div className="space-y-2 mb-4">
              {urls.map((url) => {
                let domain = "";
                try {
                  domain = new URL(url).hostname.replace(/^www\./, "");
                } catch {
                  domain = url;
                }
                return (
                  <div
                    key={url}
                    className="border border-[#A0C49D] bg-white rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm"
                  >
                    <span className="text-xs text-[#A0C49D] font-semibold">
                      🔗 {domain}
                    </span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all hover:text-blue-800 text-xs"
                    >
                      {url}
                    </a>
                  </div>
                );
              })}
            </div>
          )}

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
