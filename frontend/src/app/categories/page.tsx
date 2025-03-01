// src/app/categories/page.tsx
"use client";
import { useState } from 'react';
import Link from 'next/link';

interface SubTopic {
  name: string;
  percentage: number;
  description: string;
}

interface Topic {
  id: string;
  name: string;
  description: string;
  subtopics: SubTopic[];
}

const topics: Topic[] = [
  {
    id: "environment",
    name: "Environment",
    description: "The environmental aspects that the current sustainable agriculture literature focuses on.",
    subtopics: [
      { name: "Carbon Emission", percentage: 31, description: "Considering the climate influence of agricultural practices." },
      { name: "Climate Change Adaptation", percentage: 27, description: "Agricultural response to climate change." },
      { name: "Pollution", percentage: 16, description: "Waste management." },
      { name: "Natural Resource Conservation", percentage: 26, description: "Soil, water, biodiversity, and genetic resources conservation." }
    ]
  },
  {
    id: "technology",
    name: "Technology",
    description: "Technological development or application that help sustainable agriculture.",
    subtopics: [
      { name: "Adoption Technology Diffusion", percentage: 37, description: "Innovative diffusion, technology transfer, and socio-economic factors." },
      { name: "Digitalization & Electrification", percentage: 21, description: "Smart agriculture and electrification." },
      { name: "Agrochemical", percentage: 23, description: "Nitrogen, irrigation, and fertilizer." },
      { name: "Other", percentage: 19, description: "Carbon sequestration, farm energy, bioeconomy." }
    ]
  }
];

export default function CategoriesPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [selectedResourceType, setSelectedResourceType] = useState<string>("All");

  const resourceTypes = ["All", "Reports", "Government Documents", "Interview", "Research Paper"];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <section className="mb-16">
        <div className="bg-gray-100 p-8 rounded-lg">
          <div className="max-w-3xl">
            <p className="text-sm text-gray-600 mb-2">INFORMATION & CONSERVATION</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Published Resources On Sustainable Agriculture.</h1>
            <p className="text-gray-700">
              We collected and categorized the existing resources on the topic of sustainable agriculture, including government reports, research papers, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Types Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Available Resources</h2>
        <p className="text-center text-gray-600 mb-8">Click the topic below to find out more about each type of resources.</p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {resourceTypes.map(type => (
            <button 
              key={type} 
              onClick={() => setSelectedResourceType(type)}
              className={`px-6 py-2 border rounded-md transition-colors ${
                type === selectedResourceType ? 'bg-green-800 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* Topics Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Topics In Current Resources</h2>
        <p className="text-center text-gray-600 mb-12">
          We analyzed the topics in current literature of sustainable agriculture. A summary of the topics is as follows. The proportion of the literature focus on each of the topics is shown.
        </p>

        {topics.map((topic) => (
          <div key={topic.id} className="mb-16">
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
              <div className="md:w-1/4">
                <p className="text-sm text-gray-500 mb-1">TOPIC {topics.findIndex(t => t.id === topic.id) + 1}</p>
                <h3 className="text-2xl font-bold mb-2">{topic.name}</h3>
                <p className="text-gray-600 mb-4">{topic.description}</p>
                <Link 
                  href={`/categories/${topic.id}`}
                  className={`inline-block ${
                    activeTopicId === topic.id ? 'bg-green-700' : 'bg-green-800'
                  } text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors`}
                >
                  Explore
                </Link>
              </div>
              
              <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {topic.subtopics.map((subtopic) => (
                  <div key={subtopic.name} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
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
                        <h4 className="font-bold text-sm">{subtopic.name}</h4>
                        <p className="text-xs text-gray-600">{subtopic.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
