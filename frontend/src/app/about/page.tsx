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
    email: "paulakh@schulich.yorku.ca",
  },
  {
    id: 2,
    name: "Parin Shah",
    role: "JD candidate at the University of Toronto Faculty of Law - University of Toronto",
    affiliation: "University of Toronto",
    image: "/team/parin.jpg",
    bio: "Parin Shah is a JD candidate at the University of Toronto Faculty of Law and a graduate of the BBA program at the Schulich School of Business. Passionate about creating impact, Parin engages with corporate governance through the provincial legal system and is deeply interested in community-driven agriculture.",
    email: "paringshah@gmail.com",
  },
  {
    id: 3,
    name: "Diya Yang",
    role: "PhD Candidate at Schulich School of Business - York University",
    affiliation: "York University",
    image: "/team/diya.jpg",
    bio: "Diya Yang is a PhD candidate at the Schulich School of Business, York University. Her research looks at how businesses that combine profit goals with social or public missions—so-called “hybrid firms”—are governed. She focuses on how ownership, boards, and partnerships shape whether these firms succeed at balancing financial returns with social impact. ",
    email: "diyayang@schulich.yorku.ca",
  },
  {
    id: 4,
    name: "Jayabrata Basu",
    role: "Developer and Maintainer",
    affiliation: "Student",
    image: "/team/jayabrata.jpg",
    bio: "Software developer and maintainer of the website.",
    email: "jayabratabasu@gmail.com",
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
          className="absolute top-4 right-4 text-gray-400 hover:text-green-600 text-2xl transition-colors duration-200"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <Image
              src={member.image}
              alt={member.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-green-100 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2">
              🧑‍🔬
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1 text-gray-800">
            {member.name}
          </h3>
          <p className="text-green-600 mb-2 font-medium">{member.role}</p>
          <p className="text-gray-700 mb-4 text-center leading-relaxed text-justify">
            {member.bio}
          </p>
          <div className="flex gap-4 mb-4">
            <a
              href={`mailto:${member.email}`}
              className="bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <svg width="16" height="16" fill="currentColor">
                <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2-.5a.5.5 0 00-.5.5v.217l5 3.1 5-3.1V4a.5.5 0 00-.5-.5H4zm9 1.383l-4.445 2.756a.5.5 0 01-.555 0L4 4.883V12a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V4.883z" />
              </svg>
              <span>Email</span>
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

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        background:
          "linear-gradient(135deg, #f7f8d4 0%, #e8f5c8 15%, #d4ecce 30%, #c8e6d0 45%, #b8dbd1 60%, #a8cfd2 75%, #9bc3d3 90%, #8fb7d4 100%)",
        position: "relative",
      }}
    >
      {/* Subtle texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.4,
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-slate-800/40 to-transparent" />
          </div>
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl p-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-lg">
                  Welcome To The Hub Of Sustainable Agriculture Research
                </h1>
                <p className="text-white/95 text-lg md:text-xl leading-relaxed drop-shadow-md">
                  Collecting Research and Best Practices for Sustainable
                  Agriculture
                </p>
                <div className="mt-8">
                  <Link
                    href="/research"
                    className="inline-block bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white text-teal-800 hover:text-teal-900 font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg border border-white/20"
                  >
                    Explore Research
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                <div className="absolute -bottom-4 -right-4 bg-amber-50 p-4 rounded-lg shadow-md z-10 border border-amber-200">
                  <span className="text-teal-800 font-bold">Our Vision</span>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold text-teal-700 mb-2 flex items-center gap-2">
                <span className="text-3xl">🌍</span>
                Explore goals of sustainable agriculture
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent border-b-4 border-teal-200 pb-2">
                Visions for a Sustainable Future
              </h3>
              <ul className="space-y-8">
                <li className="flex gap-6 bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-200">
                  <div className="bg-emerald-100 text-emerald-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                    01
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 flex items-center gap-2 text-gray-800">
                      Business <span className="text-emerald-600">📈</span>
                    </h4>
                    <ul className="list-disc ml-6 text-gray-700 space-y-1">
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
                <li className="flex gap-6 bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-200">
                  <div className="bg-sky-100 text-sky-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                    02
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 flex items-center gap-2 text-gray-800">
                      Policy Making <span className="text-sky-600">📜</span>
                    </h4>
                    <ul className="list-disc ml-6 text-gray-700 space-y-1">
                      <li>Enable effective governance and incentives</li>
                      <li>
                        Shape regulatory frameworks for sustainable practices
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="flex gap-6 bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200">
                  <div className="bg-amber-100 text-amber-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                    03
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 flex items-center gap-2 text-gray-800">
                      Research <span className="text-amber-600">🧪</span>
                    </h4>
                    <ul className="list-disc ml-6 text-gray-700 space-y-1">
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

        {/* Team section with enhanced cards */}
        <section
          id="team"
          className="mb-20 bg-white/25 backdrop-blur-sm py-16 rounded-2xl border border-teal-100"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
              <span className="text-5xl">🌿</span>
              Meet Our Team
            </h2>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-1 bg-gradient-to-r from-teal-400 via-emerald-500 to-amber-400 rounded-full" />
            </div>
            <p className="text-gray-800 max-w-3xl mx-auto leading-relaxed">
              We are a team of researchers at the Schulich School of Business,
              York University. We are passionate about studying sustainable
              agriculture-related practices, businesses, and farmer livelihoods
              in the Global South.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="profile-card bg-gradient-to-br from-emerald-50/90 to-teal-50/90 backdrop-blur-sm rounded-[20px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col max-w-[320px] min-h-[520px] mx-auto cursor-pointer group border border-teal-200/50 hover:-translate-y-1.5"
                onClick={() => setModalMember(member)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setModalMember(member);
                }}
                aria-label={`Read more about ${member.name}`}
              >
                <div className="w-full h-[280px] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={320}
                    height={280}
                    className="w-full h-[280px] object-cover"
                  />
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <h3 className="text-xl font-bold mb-1 text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-sm text-teal-700 mb-3 font-medium italic">
                    {member.role}
                  </p>
                  <p className="text-gray-700 mb-4 leading-relaxed flex-grow text-justify">
                    {member.bio}
                  </p>
                  <button
                    className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium mt-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalMember(member);
                    }}
                  >
                    Read more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1"
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

          {modalMember && (
            <TeamModal
              member={modalMember}
              onClose={() => setModalMember(null)}
            />
          )}
        </section>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600&display=swap");

        html {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        h1,
        h2,
        h3,
        h4 {
          font-family: "Merriweather", serif;
          font-weight: 700;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
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

        .profile-card {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .profile-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }
        .profile-card img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
        }
      `}</style>
    </div>
  );
}
