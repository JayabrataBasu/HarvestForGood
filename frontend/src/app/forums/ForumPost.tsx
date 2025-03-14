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
  tags = [],
}: ForumPostProps) {
  // Format the content to truncate if needed
  const truncatedContent =
    content.length > 150 ? `${content.substring(0, 150)}...` : content;

  // Parse the date and format it
  let formattedDate = "Unknown date";
  try {
    const postDate = new Date(createdAt);
    formattedDate = formatDistanceToNow(postDate, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", error);
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <Link href={`/forums/posts/${id}`}>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

          <div className="text-sm text-gray-500 mb-3">
            <span>
              Posted by {author} • {formattedDate}
            </span>
          </div>

          <div className="prose prose-sm mb-4 text-gray-600">
            <p>{truncatedContent}</p>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
                {commentCount} {commentCount === 1 ? "comment" : "comments"}
              </span>
            </div>
            <span className="text-green-600 font-medium">Read more →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
