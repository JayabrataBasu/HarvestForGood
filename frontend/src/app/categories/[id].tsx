"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  params: {
    id: string;
  };
}

// Import topics from an API or data file instead of page
const topics: Topic[] = [
  // ...your topics data here...
];

export default function CategoryPage({ params }: Props) {
  const [category, setCategory] = useState<Topic | null>(null);

  useEffect(() => {
    const foundCategory = topics.find((topic) => topic.id === params.id);
    setCategory(foundCategory || null);
  }, [params.id]);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link 
            href="/categories" 
            className="text-green-800 hover:text-green-700 underline"
          >
            Return to categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <div className="mb-8">
        <Link 
          href="/categories" 
          className="text-green-800 hover:text-green-700"
        >
          Categories
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{category.name}</span>
      </div>

      {/* Category header */}
      <div className="bg-gray-100 p-8 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        <p className="text-gray-700">{category.description}</p>
      </div>

      {/* Subtopics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {category.subtopics.map((subtopic: { name: string; description: string; percentage: number }) => (
          <div 
            key={subtopic.name} 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-16 h-16 transform -rotate-90">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E6E6E6"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4A7834"
                strokeWidth="3"
                strokeDasharray={`${subtopic.percentage}, 100`}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
              {subtopic.percentage}%
            </div>
              </div>
              <div>
            <h3 className="font-bold text-lg mb-2">{subtopic.name}</h3>
            <p className="text-gray-600">{subtopic.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}