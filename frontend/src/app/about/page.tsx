"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

// Remove LinkedIn, research areas, and publications for demo
const teamMembers = [
  {
    id: 1,
    name: "Preet S. Aulakh",
    role: "Professor of Strategy and International Business; Pierre Lassonde Chair in International Business",
    affiliation: "York University",
    image: "/team/preet.jpg",
    bio: "Expert in international business strategy and sustainable agriculture. Leads research on global agri-food systems.",
    email: "preet.aulakh@yorku.ca",
  },
  {
    id: 2,
    name: "Parin Shah",
    role: "Student at Schulich School of Business - York University",
    affiliation: "York University",
    image: "/team/parin.jpg",
    bio: "Researches sustainable business models and community-driven agriculture. Passionate about food security.",
    email: "parin.shah@yorku.ca",
  },
  {
    id: 3,
    name: "Diya Yang",
    role: "PhD Candidate at Schulich School of Business - York University",
    affiliation: "York University",
    image: "/team/diya.jpg",
    bio: "Focuses on climate resilience and policy in sustainable agriculture. Drives data-driven research.",
    email: "diya.yang@yorku.ca",
  },
];

// Modal for team member details
function TeamModal({
  member,
  onClose,
}: {
  member: (typeof teamMembers)[0];
  onClose: () => void;
}) {
  if (!member) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-primary text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          <Image
            src={member.image}
            alt={member.name}
            width={120}
            height={120}
            className="rounded-full border-4 border-green-100 shadow-lg mb-4"
          />
          <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
          <p className="text-primary/80 mb-2">{member.role}</p>
          <p className="text-gray-700 mb-4 text-center">{member.bio}</p>
          <div className="flex gap-4 mb-4">
            <a
              href={`mailto:${member.email}`}
              className="text-green-700 hover:underline flex items-center gap-1"
            >
              <span>Email</span>
              <svg width="16" height="16" fill="currentColor">
                <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2-.5a.5.5 0 00-.5.5v.217l5 3.1 5-3.1V4a.5.5 0 00-.5-.5H4zm9 1.383l-4.445 2.756a.5.5 0 01-.555 0L4 4.883V12a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V4.883z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [modalMember, setModalMember] = useState<
    (typeof teamMembers)[0] | null
  >(null);
  const [ctaEmail, setCtaEmail] = useState("");
  const [ctaSubmitted, setCtaSubmitted] = useState(false);

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background: "linear-gradient(to bottom, #e9f8ec 0%, #d4ecce 100%)",
        position: "relative",
      }}
    >
      {/* Subtle noise overlay for texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/images/noise.png')",
          opacity: 0.07,
          mixBlendMode: "multiply",
        }}
      />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero section with overlay and improved contrast */}
        <section
          id="hero"
          className="relative h-[400px] mb-16 rounded-2xl overflow-hidden shadow-xl group"
        >
          <div className="absolute inset-0">
            <Image
              src="/images/about-hero.jpg"
              alt="Sustainable agriculture field"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-2xl transition-transform duration-700 ease-in-out group-hover:scale-105"
              priority
            />
            {/* Blurred gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-primary/40 to-transparent" />
          </div>
          <div className="relative h-full flex items-center grain-overlay">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl p-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-lg font-serif">
                  Welcome To The Hub Of Sustainable Agriculture Research
                </h1>
                <p className="text-white/95 text-lg md:text-xl leading-relaxed drop-shadow-md">
                  Collecting Research and Best Practices for Sustainable
                  Agriculture
                </p>
                <div className="mt-8">
                  <Link
                    href="/research"
                    className="inline-block bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white text-primary-dark hover:text-primary font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-highlight border border-white/20"
                  >
                    Explore Research
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section anchor navigation */}
        <nav className="flex gap-6 mb-12 justify-center text-primary-dark font-medium text-lg">
          <a href="#vision" className="hover:underline hover:text-primary">
            🌍 Vision
          </a>
          <a href="#team" className="hover:underline hover:text-primary">
            👥 Team
          </a>
          <a href="#join" className="hover:underline hover:text-primary">
            🌱 Join
          </a>
        </nav>

        {/* Vision section with improved card design */}
        <section id="vision" className="mb-20">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/3">
              <div className="relative">
                <Image
                  src="/images/vision-image.jpg"
                  alt="Sustainable agriculture vision"
                  width={400}
                  height={500}
                  className="rounded-xl shadow-xl object-cover h-full"
                />
                <div className="absolute -bottom-4 -right-4 bg-accent p-4 rounded-lg shadow-md z-10">
                  <span className="text-primary-dark font-bold">
                    Our Vision
                  </span>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold text-primary mb-2 flex items-center gap-2">
                <span className="text-3xl">🌍</span>
                Explore goals of sustainable agriculture
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-8 text-gradient border-b-4 border-green-200 pb-2">
                Visions for a Sustainable Future
              </h3>
              <ul className="space-y-8">
                <li
                  className="flex gap-6 feature-card paper-texture p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div className="feature-icon text-2xl font-bold">01</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                      Business <span className="text-green-400">📈</span>
                    </h4>
                    <ul className="list-disc ml-6 text-gray-600">
                      <li>
                        Support economic models that balance profit and
                        sustainability
                      </li>
                      <li>
                        Promote environmental stewardship in agri-business
                      </li>
                    </ul>
                  </div>
                </li>
                <li
                  className="flex gap-6 feature-card bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="feature-icon text-2xl font-bold">02</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                      Policy Making <span className="text-blue-400">📜</span>
                    </h4>
                    <ul className="list-disc ml-6 text-gray-600">
                      <li>Enable effective governance and incentives</li>
                      <li>
                        Shape regulatory frameworks for sustainable practices
                      </li>
                    </ul>
                  </div>
                </li>
                <li
                  className="flex gap-6 feature-card bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div className="feature-icon text-2xl font-bold">03</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                      Research <span className="text-purple-400">🧪</span>
                    </h4>
                    <ul className="list-disc ml-6 text-gray-600">
                      <li>
                        Advance knowledge on food security and climate
                        resilience
                      </li>
                      <li>Promote ecosystem health through innovation</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Team section with enhanced cards and modal */}
        <section
          id="team"
          className="mb-20 bg-diagonal-lines py-16 rounded-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-gradient flex items-center justify-center gap-2">
            <span className="text-5xl">👥</span> Meet Our Team
          </h2>
          <div className="flex justify-center mb-8">
            <div className="w-24 h-2 bg-gradient-to-r from-green-300 via-green-500 to-green-300 rounded-full" />
          </div>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            We are a team of researchers at the Schulich School of Business,
            York University. We are passionate about studying sustainable
            agriculture-related practices, businesses, and farmer livelihoods in
            the Global South.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col max-w-sm mx-auto cursor-pointer group"
                style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.10)" }}
                onClick={() => setModalMember(member)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setModalMember(member);
                }}
                aria-label={`Read more about ${member.name}`}
              >
                <div className="relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={0}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                    className="w-full h-auto rounded-t-xl transition-all duration-300 group-hover:scale-105"
                  />
                  {/* Extra details on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="text-white text-sm mb-2">
                      <span className="block font-semibold">
                        {member.affiliation}
                      </span>
                      <span className="block">{member.email}</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${member.email}`}
                        className="text-green-200 hover:text-white underline"
                      >
                        Email
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary/80 mb-4">{member.role}</p>
                  <p className="text-gray-700 mb-4">{member.bio}</p>
                  <button
                    className="inline-flex items-center text-primary hover:text-primary-dark transition-colors font-medium mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalMember(member);
                    }}
                  >
                    Read more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Modal for team member */}
          {modalMember && (
            <TeamModal
              member={modalMember}
              onClose={() => setModalMember(null)}
            />
          )}

          {/* Call to Action Section */}
          <section id="join" className="mt-20 text-center">
            <div className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 p-10 rounded-xl mx-auto max-w-4xl text-white relative shadow-lg hover:shadow-2xl transition-all duration-300 border-4 border-green-200 animate-fade-in">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <span className="text-3xl animate-bounce">🌱</span>
                Join Our Research Community!
              </h3>
              <p className="mb-8 text-white/90 max-w-2xl mx-auto">
                Contribute to our growing community of researchers,
                practitioners, and policymakers working toward sustainable
                agricultural systems.
              </p>
              {/* Newsletter-style input */}
              {!ctaSubmitted ? (
                <form
                  className="flex flex-col md:flex-row gap-4 items-center justify-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCtaSubmitted(true);
                  }}
                >
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    value={ctaEmail}
                    onChange={(e) => setCtaEmail(e.target.value)}
                    className="px-4 py-3 rounded-lg text-primary-dark w-64 focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                  <button
                    type="submit"
                    className="inline-block bg-white text-primary-dark hover:bg-gray-100 font-medium px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg border border-white/20"
                  >
                    Join
                  </button>
                </form>
              ) : (
                <div className="text-lg font-semibold flex items-center justify-center gap-2">
                  <span>Thank you for joining!</span>{" "}
                  <span className="animate-bounce">🎉</span>
                </div>
              )}
            </div>
          </section>
        </section>
      </div>
      {/* Animations (AOS or similar) */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Merriweather:wght@700&family=Inter:wght@400;500&display=swap");
        html {
          font-family: "Inter", Arial, sans-serif;
        }
        h1,
        h2,
        h3,
        h4 {
          font-family: "Merriweather", serif;
        }
        .text-gradient {
          background: linear-gradient(90deg, #3d9a50 0%, #a0c49d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
