import React from "react";
import Link from "next/link";

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
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Truncate content if it's too long
  const truncateContent = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>
            Posted by {author} • {formatDate(createdAt)}
          </span>
        </div>

        <Link href={`/forums/posts/${id}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-green-600">
            {title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4">{truncateContent(content)}</p>

        {/* Display tags if any */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span>{commentCount} comments</span>
          </div>

          <Link
            href={`/forums/posts/${id}`}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Read more →
          </Link>
        </div>
      </div>
    </div>
  );
}
