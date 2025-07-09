"use client";
import { useEffect, useState, useRef } from "react";
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
  params: {
    id: string;
  };
}

// Complete topics data from main page
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
  duration = 2500
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
  const animatedPercentage = useAnimatedCounter(percentage, isActive, 2500);
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
    <div className="relative w-20 h-20 mb-6">
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
          className="transition-all duration-1000 group-hover:stroke-green-600"
          style={{
            strokeDashoffset: 0,
            transition: "stroke-dasharray 2.5s ease-out",
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

export default function CategoryPage({ params }: Props) {
  const [category, setCategory] = useState<Topic | null>(null);
  const [topicIndex, setTopicIndex] = useState(0);

  useEffect(() => {
    const foundIndex = topics.findIndex((topic) => topic.id === params.id);
    const foundCategory = topics.find((topic) => topic.id === params.id);
    setTopicIndex(foundIndex);
    setCategory(foundCategory || null);
  }, [params.id]);

  // Define the same gradients and text colors
  const topicGradients = [
    "linear-gradient(135deg, #d1fae5 0%, #86efac 50%, #4ade80 100%)",
    "linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 50%, #38bdf8 100%)",
    "linear-gradient(135deg, #fef9c3 0%, #fde68a 50%, #facc15 100%)",
    "linear-gradient(135deg, #f5f5f4 0%, #d6d3d1 50%, #a8a29e 100%)",
    "linear-gradient(135deg, #fee2e2 0%, #fca5a5 50%, #ef4444 100%)",
    "linear-gradient(135deg, #dcfce7 0%, #86efac 50%, #22c55e 100%)",
  ];

  const textColors = [
    { primary: "#0f3f1c", secondary: "#1a4a26", accent: "#0a2612" },
    { primary: "#0c2d48", secondary: "#1e3a8a", accent: "#082543" },
    { primary: "#451a03", secondary: "#92400e", accent: "#7c2d12" },
    { primary: "#1c1917", secondary: "#292524", accent: "#0c0a09" },
    { primary: "#450a0a", secondary: "#7f1d1d", accent: "#350808" },
    { primary: "#052e16", secondary: "#14532d", accent: "#021b0a" },
  ];

  if (!category) {
    return (
      <div
        className="min-h-screen relative overflow-hidden flex items-center justify-center"
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

        <div
          className="text-center p-8 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] relative z-10"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
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

  const colors = textColors[topicIndex] || textColors[0];

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
        <div
          className="p-8 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-12 relative overflow-hidden"
          style={{
            background: topicGradients[topicIndex],
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="relative z-10">
            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: colors.primary }}
            >
              {category.name}
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{ color: colors.secondary }}
            >
              {category.description}
            </p>
          </div>
        </div>

        {/* Subtopics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.subtopics.map((subtopic, index) => {
            const [subtopicRef, isSubtopicInView] = useInView(0.1);

            return (
              <div
                key={subtopic.name}
                ref={subtopicRef}
                className="p-8 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-105 group relative overflow-hidden"
                style={{
                  background: topicGradients[topicIndex],
                  backdropFilter: "blur(8px)",
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div className="flex flex-col items-center text-center relative z-10">
                  <AnimatedProgressCircle
                    percentage={subtopic.percentage}
                    isActive={isSubtopicInView}
                  />
                  <h3
                    className="font-bold text-xl mb-4 leading-tight group-hover:opacity-90 transition-opacity duration-300"
                    style={{ color: colors.primary }}
                  >
                    {subtopic.name}
                  </h3>
                  <p
                    className="leading-relaxed group-hover:opacity-90 transition-opacity duration-300"
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
  );
}
