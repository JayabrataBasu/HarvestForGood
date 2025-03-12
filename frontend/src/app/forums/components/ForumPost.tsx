"use client";

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

const ForumPost = ({
  id,
  title,
  content,
  author,
  createdAt,
  commentCount,
  tags,
}: ForumPostProps) => {
  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <Link href={`/forums/posts/${id}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-green-700">
          {title}
        </h2>
      </Link>

      <div className="flex items-center text-sm text-gray-500 mb-3">
        <span className="mr-3">{author}</span>
        <span className="mr-3">•</span>
        <span>{formattedDate}</span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{content}</p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center">
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
      </div>
    </div>
  );
};

export default ForumPost;
