"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Subtopic {
  name: string;
  description: string;
  percentage: number;
}

interface Topic {
  id: string;
  name: string;
  description: string;
  subtopics: Subtopic[];
}

interface Props {
  params: Promise<{ id: string }>;
}

// Topics data - same as main page
const topics: Topic[] = [
  {
    id: "environment",
    name: "Environment",
    description:
      "The environmental aspects that sustainable agriculture literature focuses on.",
    subtopics: [
      {
        name: "Carbon Emission",
        percentage: 20,
        description:
          "Considering the climate influence of agricultural practices.",
      },
      {
        name: "Climate Change Adaptation",
        percentage: 51,
        description: "Strategies and response to climate change.",
      },
      { name: "Pollution", percentage: 6, description: "Waste management." },
      {
        name: "Natural Resource Conservation",
        percentage: 46,
        description:
          "Soil, water, biodiversity, and ecosystem-centric concerns.",
      },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    description:
      "Technological development or application that help sustainable agriculture.",
    subtopics: [
      {
        name: "Adoption Technology Diffusion",
        percentage: 78,
        description:
          "Innovation diffusion, education on technology, and seeds adoption.",
      },
      {
        name: "Digitalization & Electrification",
        percentage: 21,
        description: "Internet of things, and smart farming.",
      },
      {
        name: "Agrochemical",
        percentage: 20,
        description: "Nitrogen, fertilizer, and pesticide.",
      },
      {
        name: "Other",
        percentage: 14,
        description: "Carbon sequestration; New energy; Biotechnology.",
      },
    ],
  },
  // ...other topics...
];

export default function CategoryPage({ params }: Props) {
  const [category, setCategory] = useState<Topic | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    const getParams = async () => {
      const p = await params;
      setResolvedParams(p);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      const foundCategory = topics.find(
        (topic) => topic.id === resolvedParams.id
      );
      setCategory(foundCategory || null);
    }
  }, [resolvedParams]);

  if (!resolvedParams || !category) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f7fafc] via-[#f0f9f0] to-[#edf2f7] flex items-center justify-center">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-green-400 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-400 rounded-full opacity-5 blur-3xl"></div>
        </div>

        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/30 relative z-10">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Category not found
          </h1>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-colors duration-300"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f7fafc] via-[#f0f9f0] to-[#edf2f7]">
      {/* Background Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Organic Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-400 rounded-full opacity-8 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-400 rounded-full opacity-6 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400 rounded-full opacity-4 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumb navigation */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/categories"
              className="text-green-700 hover:text-green-800 font-medium transition-colors duration-300 flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
              </svg>
              Categories
            </Link>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-600 font-medium">{category.name}</span>
          </nav>
        </div>

        {/* Category header */}
        <div className="bg-gradient-to-br from-white/90 to-green-50/60 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/40 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-yellow-400/5 rounded-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 text-gray-800 drop-shadow-sm">
              {category.name}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Subtopics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.subtopics.map((subtopic) => (
            <div
              key={subtopic.name}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/90 group relative overflow-hidden"
            >
              {/* Subtle card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-yellow-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="flex flex-col items-center text-center relative z-10">
                {/* Circular Progress */}
                <div className="relative w-24 h-24 mb-6">
                  <svg
                    viewBox="0 0 36 36"
                    className="w-24 h-24 transform -rotate-90"
                  >
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4D7C0F"
                      strokeWidth="3"
                      strokeDasharray={`${subtopic.percentage}, 100`}
                      className="transition-all duration-1000 group-hover:stroke-green-600"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="text-xl font-bold text-green-700 group-hover:text-green-800 transition-colors duration-300">
                      {subtopic.percentage}%
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-xl mb-4 text-gray-800 leading-tight group-hover:text-green-800 transition-colors duration-300">
                  {subtopic.name}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {subtopic.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
