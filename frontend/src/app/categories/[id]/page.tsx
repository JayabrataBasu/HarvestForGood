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
  params: Promise<{ id: string }>;
}

// Complete topics data from main page
const topics: Topic[] = [
  // ... your existing topics data ...
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

// FIXED: Removed async and added proper useEffect to handle params Promise
export default function CategoryPage({ params }: Props) {
  const [id, setId] = useState<string | null>(null);
  const [category, setCategory] = useState<Topic | null>(null);
  const [topicIndex, setTopicIndex] = useState(0);

  // Handle params Promise in useEffect
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    resolveParams();
  }, [params]);

  // Handle category finding when id changes
  useEffect(() => {
    if (!id) return;

    const foundIndex = topics.findIndex((topic) => topic.id === id);
    const foundCategory = topics.find((topic) => topic.id === id);
    setTopicIndex(foundIndex >= 0 ? foundIndex : 0);
    setCategory(foundCategory || null);
  }, [id]);

  // Define the same soft, organic earth-inspired gradients
  const topicGradients = [
    "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #4ade80 100%)",
    "linear-gradient(135deg, #a7f3d0 0%, #4ade80 50%, #22c55e 100%)",
    "linear-gradient(135deg, #fef9c3 0%, #fde68a 50%, #fcd34d 100%)",
    "linear-gradient(135deg, #fde68a 0%, #fcd34d 50%, #eab308 100%)",
    "linear-gradient(135deg, #fcd34d 0%, #eab308 50%, #ca8a04 100%)",
    "linear-gradient(135deg, #d1fae5 0%, #22c55e 50%, #4ade80 100%)",
  ];

  const textColors = [
    { primary: "#064e3b", secondary: "#065f46", accent: "#047857" },
    { primary: "#052e16", secondary: "#064e3b", accent: "#065f46" },
    { primary: "#451a03", secondary: "#78350f", accent: "#92400e" },
    { primary: "#451a03", secondary: "#78350f", accent: "#a16207" },
    { primary: "#365314", secondary: "#4d7c0f", accent: "#65a30d" },
    { primary: "#052e16", secondary: "#064e3b", accent: "#047857" },
  ];

  // Show loading while resolving params
  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

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
              backgroundColor: "#fcd34d",
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
              backgroundColor: "#a3e635",
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

  const colors = textColors[topicIndex];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #F5F5F4, #FFF9DB, #E2F0CB, #B7E4C7, #95D5B2, #74C69D, #40916C)",
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
            backgroundColor: "#fcd34d",
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
            backgroundColor: "#a3e635",
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
            // eslint-disable-next-line react-hooks/rules-of-hooks
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
