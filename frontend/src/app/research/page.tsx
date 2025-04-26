"use client";
import React from "react";
import PaperSearch from "@/components/research/PaperSearch";

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Research Papers</h1>
          <p className="mt-2 text-gray-600">
            Explore our collection of research papers on sustainable agriculture
            and food systems.
          </p>
        </div>

        <PaperSearch />
      </div>
    </div>
  );
}
