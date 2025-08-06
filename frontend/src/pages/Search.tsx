import React from "react";
import PaperSearch from "@/components/research/PaperSearch";

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Research Papers
        </h1>
        <p className="text-gray-600">
          Search and filter through our collection of agricultural research
          papers
        </p>
      </div>
      <PaperSearch />
    </div>
  );
}
