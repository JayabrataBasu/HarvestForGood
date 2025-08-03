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
      <section className="bg-gradient-to-r from-emerald-900 via-forest-800 via-teal-800 via-green-700 via-emerald-600 via-cyan-600 to-teal-500 text-cream py-12">
        <div className="container mx-auto px-4 md:flex">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-4xl font-bold mb-4 text-amber-50">Welcome!</h2>
          </div>
          <div className="md:w-1/2">
            <p className="text-lg mb-4 text-stone-100">
              This website is a developing hub for archiving and communicating
              the issues and improvements in sustainable agriculture,
              particularly in the Global South. We are currently building a
              directory page for annotated bibliography. You are welcomed to
              send a message to us for development suggestions!
            </p>
            <Link
              href="/research"
              className="inline-block bg-amber-50 text-emerald-800 px-6 py-2 rounded-full font-semibold hover:bg-stone-100 transition-colors"
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
