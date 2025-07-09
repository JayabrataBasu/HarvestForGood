// src/app/categories/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";

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
  {
    id: "agriculture",
    name: "Agriculture",
    description:
      "Core agricultural practices and farming methodologies for sustainability.",
    subtopics: [
      {
        name: "Productivity",
        percentage: 53,
        description: "Yields and crop intensification.",
      },
      {
        name: "Food Quality",
        percentage: 51,
        description: "Food security and nutrient.",
      },
      {
        name: "Organic Farming",
        percentage: 14,
        description:
          "Integrated farming, natural farming, non-chemical farming practices.",
      },
      {
        name: "Agroecology",
        percentage: 6,
        description: "Horticulture, agroforestry, and permaculture.",
      },
    ],
  },
  {
    id: "institution",
    name: "Institution",
    description:
      "Institutional frameworks and policy structures supporting sustainable agriculture.",
    subtopics: [
      {
        name: "Policymaking",
        percentage: 52,
        description: "Legitimacy, institutions, and policy congruence.",
      },
      {
        name: "Incentives",
        percentage: 20,
        description: "Subsidies, contract farming, and ownership issues.",
      },
      {
        name: "Organizing",
        percentage: 10,
        description: "Group vs. individual farms, and farmer participation.",
      },
      {
        name: "Standards",
        percentage: 4,
        description: "Sustainability standards and promoted index.",
      },
      {
        name: "Cross-Regional Cooperation",
        percentage: 12,
        description: "International funding, and international partnership.",
      },
      {
        name: "Cross-Sector Partnership",
        percentage: 31,
        description:
          "PPP (public-private partnership), NGOs, government, social groups collaboration.",
      },
    ],
  },
  {
    id: "society",
    name: "Society",
    description:
      "Social and economic aspects affecting sustainable agricultural practices.",
    subtopics: [
      {
        name: "Smallholder",
        percentage: 69,
        description: "Farmer household income and smallholder's welfare.",
      },
      {
        name: "Economic Growth",
        percentage: 17,
        description:
          "Rural development, economic growth, global south, and inequality and poverty alleviation.",
      },
      {
        name: "Access To Markets",
        percentage: 9,
        description: "Farmer's access to market and marketing practices.",
      },
      {
        name: "Other",
        percentage: 29,
        description: "Access to market; Ethics; Covid; Social networks.",
      },
    ],
  },
  {
    id: "business",
    name: "Business",
    description:
      "Business models and economic frameworks in sustainable agriculture.",
    subtopics: [
      {
        name: "Farmers' Behavior",
        percentage: 33,
        description:
          "Decision-making, risk aversion, personality, and motivation.",
      },
      {
        name: "Finance",
        percentage: 30,
        description:
          "Microfinance, debt, loan, insurance, partnership, credit service, and liability.",
      },
      {
        name: "Supply Chain",
        percentage: 19,
        description: "Logistics, value chain, and traders.",
      },
      {
        name: "Marketing",
        percentage: 9,
        description: "Farmers access to market and marketing practices.",
      },
      {
        name: "Investment",
        percentage: 18,
        description: "Suggestions for investors.",
      },
      {
        name: "Entrepreneurship",
        percentage: 7,
        description: "Social entrepreneurship and agri-business.",
      },
    ],
  },
];

export default function CategoriesPage() {
  const [selectedResourceType, setSelectedResourceType] =
    useState<string>("All");

  const resourceTypes = [
    "All",
    "Reports",
    "Government Documents",
    "Interview",
    "Research Paper",
  ];

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
        {/* Top Left Blob */}
        <div className="absolute -top-20 -left-20 w-96 h-96 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="blob1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <filter id="blur1">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <path
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,89.1,-0.5C88.2,15.3,83.8,30.6,76.1,44.2C68.4,57.8,57.4,69.7,44.2,76.8C31,83.9,15.5,86.2,-0.1,86.4C-15.7,86.6,-31.4,84.7,-45.3,78.2C-59.2,71.7,-71.3,60.6,-78.8,46.8C-86.3,33,-89.2,16.5,-88.7,0.2C-88.2,-16.1,-84.3,-32.2,-76.8,-46.4C-69.3,-60.6,-58.2,-73,-44.7,-76.4Z"
              transform="translate(100 100)"
              fill="url(#blob1)"
              filter="url(#blur1)"
            />
          </svg>
        </div>

        {/* Top Right Leaf Shape */}
        <div className="absolute -top-10 -right-10 w-80 h-80 opacity-8">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="leaf1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#65a30d" />
              </linearGradient>
              <filter id="blur2">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            <path
              d="M100,20 C140,30 170,60 170,100 C170,140 140,170 100,180 C60,170 30,140 30,100 C30,60 60,30 100,20Z"
              fill="url(#leaf1)"
              filter="url(#blur2)"
            />
          </svg>
        </div>

        {/* Bottom Left Wave */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 opacity-6">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <filter id="blur3">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>
            <path
              d="M0,120 C40,100 60,80 100,90 C140,100 160,120 200,110 L200,200 L0,200 Z"
              fill="url(#wave1)"
              filter="url(#blur3)"
            />
          </svg>
        </div>

        {/* Bottom Right Organic Shape */}
        <div className="absolute -bottom-10 -right-10 w-72 h-72 opacity-12">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id="organic1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </radialGradient>
              <filter id="blur4">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <path
              d="M60,10 C90,15 120,30 140,50 C160,70 170,95 165,120 C160,145 145,165 125,175 C105,185 80,185 60,175 C40,165 25,145 20,120 C15,95 25,70 45,50 C65,30 60,10 60,10Z"
              fill="url(#organic1)"
              filter="url(#blur4)"
            />
          </svg>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-green-300 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-amber-400 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-white/80 to-green-50/60 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/30 relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-yellow-400/5 rounded-3xl"></div>

            <div className="max-w-4xl relative z-10">
              <p className="text-sm text-green-700 font-semibold mb-2 tracking-wider uppercase">
                INFORMATION & CONSERVATION
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 drop-shadow-sm">
                Sustainable Agriculture Focus Areas
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                We collected and categorized the existing resources on the topic
                of sustainable agriculture, including government reports,
                research papers, and comprehensive analysis across six key focus
                areas.
              </p>
            </div>
          </div>
        </section>

        {/* Resource Types Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 drop-shadow-sm">
            Available Resources
          </h2>
          <p className="text-center text-gray-600 mb-8 text-lg">
            Click the topic below to find out more about each type of resources.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {resourceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedResourceType(type)}
                className={`px-8 py-3 border-2 rounded-full transition-all duration-300 font-medium backdrop-blur-sm ${
                  type === selectedResourceType
                    ? "bg-green-700 text-white border-green-700 shadow-xl transform scale-105 shadow-green-700/25"
                    : "bg-white/70 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500 hover:shadow-lg hover:scale-102"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Topics Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 drop-shadow-sm">
            Focus Areas In Current Research
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg max-w-4xl mx-auto leading-relaxed">
            We analyzed the topics in current literature of sustainable
            agriculture. A comprehensive summary of the focus areas is presented
            below with the proportion of literature dedicated to each topic.
          </p>

          <div className="space-y-16">
            {topics.map((topic, index) => (
              <div
                key={topic.id}
                className="bg-gradient-to-br from-white/90 to-green-50/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.01] relative"
              >
                {/* Subtle inner highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-yellow-400/5 rounded-3xl"></div>

                <div className="p-8 relative z-10">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Topic Header */}
                    <div className="lg:w-1/3 mb-8 lg:mb-0">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-green-700 font-semibold tracking-wider uppercase">
                          TOPIC {index + 1}
                        </p>
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-gray-800 drop-shadow-sm">
                        {topic.name}
                      </h3>
                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                        {topic.description}
                      </p>
                      <Link
                        href={`/categories/${topic.id}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:shadow-green-700/30"
                      >
                        Explore
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
                      </Link>
                    </div>

                    {/* Subtopics Grid */}
                    <div className="lg:w-2/3">
                      <div
                        className={`grid grid-cols-1 sm:grid-cols-2 ${
                          topic.subtopics.length > 4
                            ? "lg:grid-cols-3"
                            : "lg:grid-cols-2"
                        } gap-6`}
                      >
                        {topic.subtopics.map((subtopic) => (
                          <div
                            key={subtopic.name}
                            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/90 group relative overflow-hidden"
                          >
                            {/* Subtle card glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-yellow-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="flex flex-col items-center text-center relative z-10">
                              {/* Circular Progress */}
                              <div className="relative w-20 h-20 mb-4">
                                <svg
                                  viewBox="0 0 36 36"
                                  className="w-20 h-20 transform -rotate-90"
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
                                  <span className="text-lg font-bold text-green-700 group-hover:text-green-800 transition-colors duration-300">
                                    {subtopic.percentage}%
                                  </span>
                                </div>
                              </div>

                              {/* Content */}
                              <h4 className="font-bold text-gray-800 mb-3 text-lg leading-tight group-hover:text-green-800 transition-colors duration-300">
                                {subtopic.name}
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                {subtopic.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
