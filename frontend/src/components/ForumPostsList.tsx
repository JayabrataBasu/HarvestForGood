import React from "react";
import { useApi } from "../hooks/useApi";
import { apiService } from "../services/apiService";
import { ForumPost, PaginatedResponse } from "../types/api";
import ReactMarkdown from "react-markdown";

const ForumPostsList: React.FC = () => {
  const { data, loading, error, refetch } = useApi<
    PaginatedResponse<ForumPost>
  >(apiService.getForumPosts);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div>🔄 Loading forum posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          border: "1px solid #dc3545",
          borderRadius: "8px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
        }}
      >
        <h3>❌ Error Loading Posts</h3>
        <p>{error}</p>
        <button
          onClick={refetch}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const posts = data?.results || [];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>📋 Forum Posts ({data?.count || 0})</h2>
        <button
          onClick={refetch}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {posts.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <p>📝 No forum posts found. Be the first to create one!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {posts.map((post) => (
            <div
              key={post.id}
              style={{
                padding: "16px",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                backgroundColor: "white",
              }}
            >
              <h3 style={{ margin: "0 0 8px 0", color: "#007bff" }}>
                {post.title}
              </h3>
              <div
                style={{
                  margin: "0 0 12px 0",
                  color: "#6c757d",
                  lineHeight: "1.5",
                  wordBreak: "break-word",
                }}
              >
                <ReactMarkdown>
                  {post.content.length > 200
                    ? `${post.content.substring(0, 200)}...`
                    : post.content}
                </ReactMarkdown>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                  color: "#6c757d",
                }}
              >
                <span>
                  👤 {post.author?.first_name} {post.author?.last_name}
                </span>
                <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        margin: "2px",
                        backgroundColor: "#e9ecef",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "#495057",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumPostsList;
