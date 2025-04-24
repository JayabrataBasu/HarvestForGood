import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface Post {
  id: string;
  title: string;
  content: string;
  comments_count: number;
  likes_count: number;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

const PostCard = ({ post, onLike }: PostCardProps) => {
  const { user } = useAuth();
  const [isGuestUser, setIsGuestUser] = useState(false);

  useEffect(() => {
    const guestInfo = localStorage.getItem("guestInfo");
    setIsGuestUser(!!guestInfo);
  }, []);

  const handleLike = () => {
    onLike(post.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 transition-all hover:shadow-lg">
      <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center text-gray-500 text-sm">
          <span className="mr-4 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              ></path>
            </svg>
            {post.comments_count || 0} comments
          </span>

          {user || isGuestUser ? (
            <button
              onClick={handleLike}
              className={`flex items-center ${
                liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              {post.likes_count || 0} likes
            </button>
          ) : (
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              {post.likes_count || 0} likes
            </span>
          )}
        </div>

        <Link
          href={`/forums/posts/${post.id}`}
          className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm"
        >
          View Post
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
