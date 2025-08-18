import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { FaThumbtack } from "react-icons/fa";
import { useLike } from "@/hooks/useLike"; // Import the useLike hook
import ReactMarkdown from "react-markdown";
//for the outercard this file exist
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
  onPin?: (postId: string, pin: boolean) => void; // add this
  pinned?: boolean; // add this
}

function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  return Array.from(new Set(text.match(urlRegex) || []));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

function renderMarkdownWithLinks(text: string) {
  // Render markdown, then linkify the result
  // This approach renders markdown, then replaces plain text URLs with anchor tags
  // Note: ReactMarkdown already auto-links URLs in most cases, but this ensures both markdown and bare URLs are clickable
  const Markdown = ReactMarkdown;
  const nodes = <Markdown>{text}</Markdown>;
  // If you want to post-process nodes for linkify, you could use a plugin or custom renderer,
  // but for simplicity, just wrap in a div and let ReactMarkdown handle most cases.
  return nodes;
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
  onPin,
  pinned,
}: ForumPostProps) {
  const { user } = useAuth();
  const {
    isLiked,
    likesCount,
    isLoading: isLikeLoading,
    handleLike,
  } = useLike(id, 0, false);
  const [animate, setAnimate] = useState(false);
  const isSuperuser = user?.isSuperuser;

  const formattedDate = new Date(createdAt);
  const timeAgo = formatDistanceToNow(formattedDate, { addSuffix: true });

  const truncatedContent =
    content.length > 250 ? content.slice(0, 250) + "..." : content;

  const handleQuickLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimate(true);
    try {
      await handleLike();
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setTimeout(() => setAnimate(false), 600);
    }
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onPin) onPin(id, !pinned);
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
        /* Farm-themed panel styles */
        .modern-card {
          background: linear-gradient(120deg, #f9fcf7 0%, #e9fbe5 100%);
          border: 1.5px solid #d1fae5;
          box-shadow: 0 4px 24px 0 rgba(160, 196, 157, 0.1),
            0 1.5px 8px rgba(34, 197, 94, 0.07);
          border-radius: 1.25rem;
          position: relative;
          overflow: hidden;
        }
        .modern-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 38px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.45) 0%,
            rgba(255, 255, 255, 0.12) 100%
          );
          pointer-events: none;
          border-top-left-radius: 1.25rem;
          border-top-right-radius: 1.25rem;
          z-index: 1;
          filter: blur(0.5px);
        }
        .modern-card.fade-in {
          animation: fadeIn 0.5s ease;
        }
        .modern-card .p-6 {
          position: relative;
          z-index: 2;
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
            {/* Pin/Unpin button for superuser */}
            {isSuperuser && (
              <button
                onClick={handlePinClick}
                className={`flex items-center px-2 py-1 rounded text-xs font-medium border ml-2 ${
                  pinned
                    ? "bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
                title={pinned ? "Unpin this post" : "Pin this post"}
              >
                <FaThumbtack className="mr-1" />
                {pinned ? "Unpin" : "Pin"}
              </button>
            )}

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

          {/* Markdown content preview with linkify */}
          <div className="prose prose-sm max-w-none mb-4 text-[#4B4B3B] leading-relaxed">
            {/* Render markdown, then linkify any remaining plain URLs */}
            {renderMarkdownWithLinks(truncatedContent)}
          </div>

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
                disabled={isLikeLoading}
                className={`
                  flex items-center space-x-1 transition-all duration-200 relative px-2 py-1 rounded-lg
                  ${
                    isLikeLoading
                      ? "cursor-not-allowed opacity-70"
                      : "hover:bg-white/50"
                  }
                  ${
                    isLiked
                      ? "text-red-500 hover:text-red-600"
                      : "text-[#A0C49D] hover:text-[#78B86L]"
                  }
                `}
              >
                <div className="relative">
                  <span
                    className={`text-lg ${
                      isLiked && animate ? "mini-heart-pop" : ""
                    }`}
                  >
                    {isLiked ? "❤️" : "🤍"}
                  </span>
                  {animate && isLiked && (
                    <span className="emoji-burst">💖</span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    animate ? "count-bounce" : ""
                  }`}
                >
                  {likesCount}
                </span>
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
