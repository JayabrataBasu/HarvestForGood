"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HomeResearchSection } from "../components/home/HomeResearchSection";
import { Analytics } from "@vercel/analytics/next";

const slides = [
  {
    image: "/images/slide1.jpg",
    category: "SUSTAINABLE AGRICULTURE",
    title:
      "A Future Of Sustaining And Thriving For Small Farmers In Global South",
    description:
      "Sustainable agriculture aims to provide for the growing populations while considering the future costs to both the communities and environment. Promoting the self-sufficiency of small farmers is the critical block for the progress of sustainable agriculture in global south. A major challenge is to construct the institutional infrastructures to empower rather than deplete small farmers.",
  },

  {
    image: "/images/slide2.jpg",
    category: "Joyful Harvest",
    title: "Harvesting For Good",
    description:
      "Sustainable agriculture aims to provide for the growing populations while considering the future costs to both the communities and environment. Promoting the self-sufficiency of small farmers is the critical block for the progress of sustainable agriculture in global south. A major challenge is to construct the institutional infrastructures to empower rather than deplete small farmers.",
  },

  {
    image: "/images/slide3.jpg",
    category: "A Day in the Farm",
    title: "Harvesting For Good",
    description:
      "Sustainable agriculture aims to provide for the growing populations while considering the future costs to both the communities and environment. Promoting the self-sufficiency of small farmers is the critical block for the progress of sustainable agriculture in global south. A major challenge is to construct the institutional infrastructures to empower rather than deplete small farmers.",
  },
  {
    image: "/images/slide4.jpg",
    category: "Machines and Harvest",
    title: "Harvesting For Good",
    description:
      "Sustainable agriculture aims to provide for the growing populations while considering the future costs to both the communities and environment. Promoting the self-sufficiency of small farmers is the critical block for the progress of sustainable agriculture in global south. A major challenge is to construct the institutional infrastructures to empower rather than deplete small farmers.",
  },
  // Add more slides as needed
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <Analytics />
      {/* Slideshow section */}
      <section className="relative h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: "cover" }}
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-8 md:px-16">
                  <div className="max-w-2xl">
                    <p className="text-green-300 mb-2">{slide.category}</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-white text-lg">{slide.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </section>

      {/* Welcome section */}
      <section
        className="w-full py-16 px-8"
        style={{
          background:
            "linear-gradient(to right, #022C22, #064E3B, #065F46, #047857, #059669, #10B981)",
        }}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center max-w-6xl">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <p
              className="text-sm uppercase tracking-wide mb-4"
              style={{ color: "#D1FADF" }}
            >
              HARVEST FOR GOOD
            </p>
            <h2
              className="text-5xl font-bold mb-6"
              style={{ color: "#FEFCE8" }}
            >
              Welcome!
            </h2>
          </div>
          <div className="md:w-1/2">
            <p
              className="text-lg mb-6 max-w-lg leading-relaxed"
              style={{ color: "#F5F5F4" }}
            >
              This website is a developing hub for archiving and communicating
              the issues and improvements in sustainable agriculture,
              particularly in the Global South. We are currently building a
              directory page for annotated bibliography. You are welcomed to
              send a message to us for development suggestions!
            </p>
            <Link
              href="/research"
              className="inline-block px-8 py-3 rounded-full font-semibold transition-all duration-200"
              style={{
                backgroundColor: "#FEFCE8",
                color: "#064E3B",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLAnchorElement).style.backgroundColor =
                  "#F5F5F4")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLAnchorElement).style.backgroundColor =
                  "#FEFCE8")
              }
            >
              Explore resources
            </Link>
          </div>
        </div>
      </section>

      {/* Research Papers Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <HomeResearchSection />
        </div>
      </section>
    </div>
  );
}
