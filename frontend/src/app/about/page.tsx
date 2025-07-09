"use client";
import Image from "next/image";
import Link from "next/link";

// Team member data
const teamMembers = [
  {
    id: 1,
    name: "Preet S. Aulakh",
    role: "Professor of Strategy and International Business; Pierre Lassonde Chair in International Business",
    affiliation: "York University",
    image: "/team/preet.jpg",
    bio: "Brief profile bio for this person will live here. Add an overview of this person's role or any other info.",
  },
  {
    id: 2,
    name: "Parin Shah",
    role: "Student at Schulich School of Business - York University",
    affiliation: "York University",
    image: "/team/parin.jpg",
    bio: "Brief profile bio for this person will live here. Add an overview of this person's role or any other info.",
  },
  {
    id: 3,
    name: "Diya Yang",
    role: "PhD Candidate at Schulich School of Business - York University",
    affiliation: "York University",
    image: "/team/diya.jpg",
    bio: "Brief profile bio for this person will live here. Add an overview of this person's role or any other info.",
  },
];

export default function AboutPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #F8F9F1, #E2F0CB, #B5D99C, #A3C4A8, #93B48B, #AC8F6F, #816953)",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Hero section with enhanced styling */}
        <section className="relative h-[400px] mb-16 rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/about-hero.jpg"
              alt="Sustainable agriculture field"
              fill
              style={{ objectFit: "cover" }}
              className="hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/60 via-primary/40 to-transparent"></div>
          </div>
          <div className="relative h-full flex items-center grain-overlay">
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
                    className="inline-block bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white text-primary-dark hover:text-primary font-medium px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-highlight border border-white/20"
                  >
                    Explore Research
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision section with improved card design */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/3">
              <div className="relative">
                <Image
                  src="/images/vision-image.jpg"
                  alt="Sustainable agriculture vision"
                  width={400}
                  height={500}
                  className="rounded-xl shadow-card-hover object-cover h-full"
                />
                <div className="absolute -bottom-4 -right-4 bg-accent p-4 rounded-lg shadow-md z-10">
                  <span className="text-primary-dark font-bold">
                    Our Vision
                  </span>
                </div>
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold text-primary mb-2">
                Explore goals of sustainable agriculture
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-8 text-gradient">
                Visions for a Sustainable Future
              </h3>

              <div className="space-y-8">
                <div className="flex gap-6 feature-card paper-texture p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="feature-icon text-2xl font-bold">01</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Business</h4>
                    <p className="text-gray-600">
                      Explore how sustainable agriculture can benefit businesses
                      at all sizes. Learn about economic models that support
                      both profitability and environmental stewardship.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 feature-card bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="feature-icon text-2xl font-bold">02</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Policy Making</h4>
                    <p className="text-gray-600">
                      Discover the role of policymakers in promoting sustainable
                      agriculture practices through effective governance,
                      incentives, and regulatory frameworks.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 feature-card bg-white p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300">
                  <div className="feature-icon text-2xl font-bold">03</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Research</h4>
                    <p className="text-gray-600">
                      Discover the latest research findings on sustainable
                      agriculture and its impact on food security, climate
                      resilience, and ecosystem health.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team section with enhanced cards */}
        <section className="mb-20 bg-diagonal-lines py-16 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gradient">
            Meet Our Team
          </h2>
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
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col max-w-sm mx-auto"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={0}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  className="w-full h-auto"
                />
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary/80 mb-4">{member.role}</p>
                  <p className="text-gray-700 mb-4">{member.bio}</p>
                  <Link
                    href="#"
                    className="inline-flex items-center text-primary hover:text-primary-dark transition-colors font-medium mt-3"
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
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient p-10 rounded-xl mx-auto max-w-4xl text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Join Our Research Community
              </h3>
              <p className="mb-8 text-white/90 max-w-2xl mx-auto">
                Contribute to our growing community of researchers,
                practitioners, and policymakers working toward sustainable
                agricultural systems.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-white text-primary-dark hover:bg-gray-100 font-medium px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                Get Involved
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
