import React from "react";
import TestLikeButton from "./TestLikeButton";
import ReactMarkdown from "react-markdown"; // <-- Add this import

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    author_name: string;
    likes_count: number;
    is_liked: boolean;
    created_at: string;
    // Add these fields for comment preview
    latest_comment_snippet?: string;
    latest_commenter?: string;
    comment_count?: number;
  };
}

// Utility to extract URLs from text
function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  return Array.from(new Set(text.match(urlRegex) || []));
}

// Utility to convert URLs in text to clickable links
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
        className="text-blue-600 underline break-all hover:text-blue-800"
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

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Find URLs for preview
  const urls = extractUrls(post.content);
  return (
    <div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500">
          By {post.author_name || "Unknown Author"}
        </p>
      </div>

      {/* Render content as Markdown */}
      <div className="mb-4 text-gray-700 line-clamp-3 text-sm">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Latest comment preview */}
      {post.latest_comment_snippet && (
        <div className="mb-3 px-3 py-2 bg-blue-50 border-l-4 border-blue-300 rounded text-sm text-blue-800">
          <span className="font-semibold">
            {post.latest_commenter ? post.latest_commenter : "Latest comment"}:
          </span>{" "}
          <span className="italic">{post.latest_comment_snippet}</span>
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
                className="border border-blue-200 bg-blue-50 rounded px-3 py-1 flex items-center gap-2 shadow-sm"
              >
                <span className="text-xs text-blue-700 font-semibold">
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

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {new Date(post.created_at).toLocaleDateString()}
        </span>
        {/* Show comment count if available */}
        {typeof post.comment_count === "number" && (
          <span className="text-xs text-gray-400 ml-2">
            💬 {post.comment_count}{" "}
            {post.comment_count === 1 ? "comment" : "comments"}
          </span>
        )}

        <TestLikeButton
          postId={post.id.toString()}
          initialLikesCount={post.likes_count}
          initialIsLiked={post.is_liked}
        />
      </div>
    </div>
  );
};

export default PostCard;
