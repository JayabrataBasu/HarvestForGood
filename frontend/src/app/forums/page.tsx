export default function ForumsPage() {
    return (
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6">Forums</h1>
        <p className="text-lg text-gray-700 mb-8">
          Join the conversation with researchers, practitioners, and community members.
        </p>
        
        <div className="grid gap-6">
          {[
            { id: 'sustainable-ag', name: 'Sustainable Agriculture', posts: 24 },
            { id: 'food-security', name: 'Food Security', posts: 18 },
            { id: 'urban-farming', name: 'Urban Farming', posts: 12 },
            { id: 'policy', name: 'Food Policy', posts: 9 }
          ].map(forum => (
            <div key={forum.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold mb-2">{forum.name}</h2>
              <p className="text-gray-600">{forum.posts} discussions</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  