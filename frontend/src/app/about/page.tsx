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
    bio: "Brief profile bio for this person will live here. Add an overview of this person's role or any other info."
  },
  {
    id: 2,
    name: "Parin Shah",
    role: "Student at Schulich School of Business - York University",
    affiliation: "York University",
    image: "/team/parin.jpg",
    bio: "Brief profile bio for this person will live here. Add an overview of this person's role or any other info."
  },
  {
    id: 3,
    name: "Diya Yang",
    role: "PhD Candidate at Schulich School of Business - York University",
    affiliation: "York University",
    image: "/team/diya.jpg",
    bio: "Brief profile bio for this person will live here. Add an overview of this person's role or any other info."
  }
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <section className="relative h-[300px] mb-12">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="Sustainable agriculture field"
            fill
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome To The Hub Of Sustainable Agriculture Research
            </h1>
            <p className="text-white text-lg">
              Collecting Research and Best Practices for Sustainable Agriculture
            </p>
          </div>
        </div>
      </section>

      {/* Vision section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Image
              src="/images/vision-image.jpg"
              alt="Sustainable agriculture vision"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-semibold text-green-800 mb-2">Explore goals of sustainable agriculture</h2>
            <h3 className="text-3xl font-bold mb-6">Visions</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-green-800 font-bold text-xl">01</div>
                <div>
                  <h4 className="font-bold mb-1">Business</h4>
                  <p className="text-gray-600">Explore how sustainable agriculture can benefit businesses at all sizes.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-green-800 font-bold text-xl">02</div>
                <div>
                  <h4 className="font-bold mb-1">Policy Making</h4>
                  <p className="text-gray-600">Discover the role of policymakers in promoting sustainable agriculture practices.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="text-green-800 font-bold text-xl">03</div>
                <div>
                  <h4 className="font-bold mb-1">Research</h4>
                  <p className="text-gray-600">Discover the latest research findings on sustainable agriculture and its impact.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          We are a team of researchers at the Schulich School of Business, York University. We are passionate about studying sustainable agriculture-related practices, businesses, and farmer livelihoods in the Global South.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map(member => (
            <div key={member.id} className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="relative h-80 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{member.role}</p>
                <p className="text-gray-700 mb-4">{member.bio}</p>
                <Link href="#" className="text-green-800 hover:underline text-sm">
                  Read more...
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
