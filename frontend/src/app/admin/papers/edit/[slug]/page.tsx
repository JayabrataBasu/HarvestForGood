"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaperForm from "@/components/research/PaperForm";
import { isAuthenticated, researchAPI } from "@/lib/api";
import { ResearchPaper } from "@/types/paper.types";

export default function EditPaperPage({
  params,
}: {
  params: { slug: string };
}) {
  const [loading, setLoading] = useState(true);
  const [paper, setPaper] = useState<ResearchPaper | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push(`/login?next=/admin/papers/edit/${params.slug}`);
      return;
    }

    // Fetch the paper data
    const loadPaper = async () => {
      try {
        const result = await researchAPI.fetchPaperById(params.slug);

        if (result.success && result.data) {
          setPaper(result.data);
        } else {
          setError(result.message || "Failed to load paper");
        }
      } catch (err) {
        console.error("Error loading paper:", err);
        setError("An error occurred while loading the paper");
      } finally {
        setLoading(false);
      }
    };

    loadPaper();
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-xl font-medium text-gray-900 mb-4">
              {error || "Paper not found"}
            </h1>
            <p className="text-gray-500 mb-6">
              We couldn&apos;t find the paper you&apos;re looking for. It may
              have been deleted or you may not have permission to view it.
            </p>
            <button
              onClick={() => router.push("/admin/papers")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Back to Papers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Research Paper
            </h1>
            <p className="mt-2 text-gray-600">
              Update the details of this research paper.
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/papers")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Papers
          </button>
        </div>

        <PaperForm initialData={paper} isEditMode={true} />
      </div>
    </div>
  );
}
