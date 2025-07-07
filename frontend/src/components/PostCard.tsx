import React from "react";
import TestLikeButton from "./TestLikeButton";
import { useLike } from "../hooks/useLike";

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    author_name: string;
    likes_count: number;
    is_liked: boolean;
    created_at: string;
  };
  currentUser?: {
    username: string;
  } | null;
  guestName?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  guestName,
}) => {
  const { isLiked, likesCount, isLoading, toggleLike, error } = useLike({
    initialLiked: post.is_liked,
    initialCount: post.likes_count,
    itemId: post.id,
    itemType: "post",
    guestName: !currentUser ? guestName : undefined,
  });

  console.log("PostCard render:", {
    postId: post.id,
    isLiked,
    likesCount,
    isLoading,
  });

  const handleLike = async () => {
    console.log("PostCard handleLike called");
    try {
      await toggleLike();
      console.log("Like action completed successfully");
    } catch (error) {
      console.error("Like action failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500">By {post.author_name}</p>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {new Date(post.created_at).toLocaleDateString()}
        </span>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <TestLikeButton
          isLiked={isLiked}
          likesCount={likesCount}
          onLike={handleLike}
        />
      </div>
    </div>
  );
};

export default PostCard;
