"use client";

import { useState, useEffect } from "react";

interface Post {
  id: string | number;
  title: string;
  content: string;
}

export default function AllPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/forums/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.data || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-xl mb-4">All Forum Posts</h1>
      {posts.length === 0 ? (
        <p className="text-gray-600">No posts yet</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="bg-white p-4 shadow-sm rounded">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-gray-700">{post.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
