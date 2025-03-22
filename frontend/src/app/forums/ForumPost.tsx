import React from "react";
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
}

export default function ForumPost({
  id,
  title,
  content,
  author,
  createdAt,
  commentCount,
  tags,
}: ForumPostProps) {
  // Format the date to show as "X time ago"
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  // Truncate content if it's too long
  const truncatedContent =
    content.length > 150 ? content.substring(0, 150) + "..." : content;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>
            Posted by {author} • {formattedDate}
          </span>
        </div>

        <Link href={`/forums/posts/${id}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-green-600">
            {title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4">{truncatedContent}</p>

        {tags && tags.length > 0 && (
          <div className="mb-4 flex flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2 mb-2"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </div>

          <Link href={`/forums/posts/${id}`}>
            <span className="text-sm font-medium text-green-600 hover:text-green-800">
              Read more →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
