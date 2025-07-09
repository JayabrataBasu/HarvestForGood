// src/app/categories/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
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

// Custom hook for intersection observer
const useInView = (threshold = 0.1) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView] as const;
};

// Custom hook for animated counter
const useAnimatedCounter = (
  targetValue: number,
  isActive: boolean,
  duration = 2000
) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCurrentValue(Math.round(targetValue * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [targetValue, isActive, duration]);

  return currentValue;
};

// Animated Progress Circle Component
const AnimatedProgressCircle = ({
  percentage,
  isActive,
}: {
  percentage: number;
  isActive: boolean;
}) => {
  const animatedPercentage = useAnimatedCounter(percentage, isActive, 2000);
  const [strokeDasharray, setStrokeDasharray] = useState("0, 100");

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setStrokeDasharray(`${animatedPercentage}, 100`);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animatedPercentage, isActive]);

  return (
    <div className="relative w-20 h-20 mb-4">
      <svg viewBox="0 0 36 36" className="w-20 h-20 transform -rotate-90">
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
          strokeDasharray={strokeDasharray}
          className="transition-all duration-1000 ease-out group-hover:stroke-green-600"
          style={{
            strokeDashoffset: 0,
            transition: "stroke-dasharray 2s ease-out",
          }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-lg font-bold text-green-700 group-hover:text-green-800 transition-colors duration-300">
          {animatedPercentage}%
        </span>
      </div>
    </div>
  );
};

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

  // Define soft, organic earth-inspired gradient colors for each topic
  const topicGradients = [
    // Environment - Soft green canopy gradient
    "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #4ade80 100%)",

    // Technology - Gentle green to deeper green
    "linear-gradient(135deg, #a7f3d0 0%, #4ade80 50%, #22c55e 100%)",

    // Agriculture - Warm yellow harvest gradient
    "linear-gradient(135deg, #fef9c3 0%, #fde68a 50%, #fcd34d 100%)",

    // Institution - Rich ochre earth tones
    "linear-gradient(135deg, #fde68a 0%, #fcd34d 50%, #eab308 100%)",

    // Society - Deep earth yellow gradient
    "linear-gradient(135deg, #fcd34d 0%, #eab308 50%, #ca8a04 100%)",

    // Business - Fresh green growth gradient
    "linear-gradient(135deg, #d1fae5 0%, #22c55e 50%, #4ade80 100%)",
  ];

  // Define contrasting text colors for each topic
  const textColors = [
    // Environment - Dark forest green for light green gradient
    { primary: "#064e3b", secondary: "#065f46", accent: "#047857" },

    // Technology - Deep green for medium green gradient
    { primary: "#052e16", secondary: "#064e3b", accent: "#065f46" },

    // Agriculture - Dark brown for yellow gradient
    { primary: "#451a03", secondary: "#78350f", accent: "#92400e" },

    // Institution - Deep brown for ochre gradient
    { primary: "#451a03", secondary: "#78350f", accent: "#a16207" },

    // Society - Very dark brown for deep yellow gradient
    { primary: "#365314", secondary: "#4d7c0f", accent: "#65a30d" },

    // Business - Dark green for fresh green gradient
    { primary: "#052e16", secondary: "#064e3b", accent: "#047857" },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #fef3c7 0%, #ecfccb 100%)",
      }}
    >
      {/* Farm-inspired blur orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="bg-orb orb-top-left hidden sm:block"
          style={{
            position: "absolute",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            filter: "blur(100px)",
            zIndex: 0,
            pointerEvents: "none",
            top: "-120px",
            left: "-120px",
            backgroundColor: "#fcd34d" /* darker golden wheat */,
            opacity: 0.18,
          }}
        />
        <div
          className="bg-orb orb-bottom-right hidden sm:block"
          style={{
            position: "absolute",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            filter: "blur(100px)",
            zIndex: 0,
            pointerEvents: "none",
            bottom: "-100px",
            right: "-100px",
            backgroundColor: "#a3e635" /* richer green */,
            opacity: 0.15,
          }}
        />
      </div>

      {/* Content container with higher z-index */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <section className="mb-16">
          <div
            className="p-8 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative overflow-hidden"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="max-w-4xl relative z-10">
              <p className="text-sm text-green-700 font-semibold mb-2 tracking-wider uppercase">
                INFORMATION & CONSERVATION
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
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
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
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
                className={`px-8 py-3 border-2 rounded-full transition-all duration-300 font-medium ${
                  type === selectedResourceType
                    ? "bg-green-700 text-white border-green-700 shadow-xl transform scale-105 shadow-green-700/25"
                    : "bg-white/70 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500 hover:shadow-lg hover:scale-102"
                }`}
                style={{ backdropFilter: "blur(8px)" }}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Topics Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Focus Areas In Current Research
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg max-w-4xl mx-auto leading-relaxed">
            We analyzed the topics in current literature of sustainable
            agriculture. A comprehensive summary of the focus areas is presented
            below with the proportion of literature dedicated to each topic.
          </p>

          <div className="space-y-16">
            {topics.map((topic, index) => {
              const [topicRef, isTopicInView] = useInView(0.1);
              const colors = textColors[index];

              return (
                <div
                  key={topic.id}
                  ref={topicRef}
                  className="rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:scale-[1.01] relative"
                  style={{
                    background: topicGradients[index],
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="p-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                      {/* Topic Header */}
                      <div className="lg:w-1/3 mb-8 lg:mb-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: `${colors.primary}15` }}
                          >
                            <span
                              className="font-bold text-sm"
                              style={{ color: colors.primary }}
                            >
                              {index + 1}
                            </span>
                          </div>
                          <p
                            className="text-sm font-semibold tracking-wider uppercase"
                            style={{ color: colors.secondary }}
                          >
                            TOPIC {index + 1}
                          </p>
                        </div>
                        <h3
                          className="text-3xl font-bold mb-4"
                          style={{ color: colors.primary }}
                        >
                          {topic.name}
                        </h3>
                        <p
                          className="mb-6 text-lg leading-relaxed"
                          style={{ color: colors.secondary }}
                        >
                          {topic.description}
                        </p>
                        <Link
                          href={`/categories/${topic.id}`}
                          className="inline-flex items-center gap-2 backdrop-blur-sm px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                          style={{
                            backgroundColor: `${colors.primary}15`,
                            color: colors.primary,
                            border: `1px solid ${colors.primary}25`,
                          }}
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
                          {topic.subtopics.map((subtopic, subtopicIndex) => {
                            const [subtopicRef, isSubtopicInView] =
                              useInView(0.1);

                            return (
                              <div
                                key={subtopic.name}
                                ref={subtopicRef}
                                className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                                style={{
                                  backgroundColor: `${colors.primary}06`,
                                  backdropFilter: "blur(8px)",
                                  border: `1px solid ${colors.primary}15`,
                                  animationDelay: `${subtopicIndex * 200}ms`,
                                }}
                              >
                                <div className="flex flex-col items-center text-center relative z-10">
                                  <AnimatedProgressCircle
                                    percentage={subtopic.percentage}
                                    isActive={isSubtopicInView || isTopicInView}
                                  />
                                  <h4
                                    className="font-bold mb-3 text-lg leading-tight group-hover:opacity-90 transition-opacity duration-300"
                                    style={{ color: colors.primary }}
                                  >
                                    {subtopic.name}
                                  </h4>
                                  <p
                                    className="text-sm leading-relaxed group-hover:opacity-90 transition-opacity duration-300"
                                    style={{ color: colors.secondary }}
                                  >
                                    {subtopic.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
