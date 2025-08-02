import React, { useEffect, useState } from "react";
import { apiService } from "../services/apiService";
import { ForumPost, PaginatedResponse } from "../types/api";

const ExampleUsage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiService.getForumPosts();
        const data = response.data as PaginatedResponse<ForumPost>;
        setPosts(data.results || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Forum Posts ({posts.length})</h2>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>
            By: {post.author.first_name} {post.author.last_name}
          </small>
        </div>
      ))}
    </div>
  );
};

export default ExampleUsage;
