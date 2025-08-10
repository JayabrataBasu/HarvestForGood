"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import GuestAuthModal, { GuestInfo } from "../../GuestAuthModal";
import TagInput from "@/components/forum/TagInput";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [showGuestAuthModal, setShowGuestAuthModal] = useState(false);

  // Check for stored guest information
  useEffect(() => {
    const storedGuestInfo = localStorage.getItem("guestInfo");
    if (storedGuestInfo) {
      try {
        const parsedInfo = JSON.parse(storedGuestInfo);
        setGuestInfo(parsedInfo);
        setIsGuestUser(true);
      } catch (e) {
        console.error("Error parsing stored guest info:", e);
        localStorage.removeItem("guestInfo");
      }
    } else if (!user) {
      // If no guest info and no user, prompt for guest info
      setShowGuestAuthModal(true);
    }
  }, [user]);

  const handleGuestAuth = (info: GuestInfo) => {
    setGuestInfo(info);
    setIsGuestUser(true);
    setShowGuestAuthModal(false);
    localStorage.setItem("guestInfo", JSON.stringify(info));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let response;

      // Remove trailing slash from API_BASE_URL if present
      const apiBase = API_BASE_URL.replace(/\/$/, "");

      if (user) {
        // Logged-in user post creation
        const token = localStorage.getItem("access_token");
        response = await fetch(`${apiBase}/forum/posts/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            title,
            content,
            tag_names: tags,
          }),
        });
      } else if (guestInfo) {
        // Guest post creation
        response = await fetch(`${apiBase}/forum/guest/posts/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            guest_name: guestInfo.name,
            guest_affiliation: guestInfo.affiliation,
            guest_email: guestInfo.email || "",
            tag_names: tags,
          }),
        });
      } else {
        setError(
          "You must be logged in or continue as a guest to create a post"
        );
        setIsSubmitting(false);
        return;
      }

      if (response.ok) {
        router.push("/forums/posts");
      } else {
        let errorMessage = "Failed to create post. Please try again.";
        try {
          const errorData = await response.json();
          // Show detailed backend errors if available
          if (typeof errorData === "object" && errorData !== null) {
            if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.title) {
              errorMessage = `Title: ${errorData.title}`;
            } else if (errorData.content) {
              errorMessage = `Content: ${errorData.content}`;
            } else if (errorData.non_field_errors) {
              errorMessage = errorData.non_field_errors.join(", ");
            } else {
              errorMessage = JSON.stringify(errorData);
            }
          }
        } catch {
          // fallback to text
          try {
            const text = await response.text();
            if (text) errorMessage = text;
          } catch {}
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("An error occurred while creating your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if no authentication and user dismisses guest login
  const handleModalClose = () => {
    if (!user && !guestInfo) {
      router.push("/forums/posts");
    } else {
      setShowGuestAuthModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-soft-green to-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-primary-dark mb-8">
            Create New Post
          </h1>

          {isGuestUser && guestInfo && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Posting as guest:{" "}
                <span className="font-medium">{guestInfo.name}</span>
                {guestInfo.affiliation && (
                  <span> ({guestInfo.affiliation})</span>
                )}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <TagInput
                tags={tags}
                onTagsChange={setTags}
                placeholder="Add tags to help others find your post (e.g., #organic #soil)"
                maxTags={8}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push("/forums/posts")}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <GuestAuthModal
        isOpen={showGuestAuthModal}
        onClose={handleModalClose}
        onSubmit={handleGuestAuth}
        mode="post"
      />
    </div>
  );
}
