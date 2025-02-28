export default function AboutPage() {
    return (
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Harvest For Good</h1>
        <p className="text-lg text-gray-700 mb-4">
          Harvest For Good was founded in 2022 with a simple mission: to make academic research on sustainable food systems more accessible, actionable, and community-centered.
        </p>
        
        <h2 className="text-3xl font-bold mt-8 mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Dr. Sarah Johnson", role: "Founder & Research Director" },
            { name: "Michael Chen", role: "Technology Lead" },
            { name: "Dr. Amina Osei", role: "Community Engagement Director" }
          ].map(member => (
            <div key={member.name} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-center">{member.name}</h3>
              <p className="text-blue-600 text-center mb-2">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  