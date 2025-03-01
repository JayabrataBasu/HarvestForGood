"use client"; // Add client directive for interactivity

import { useState } from 'react';
//import Link from 'next/link';
//import { Metadata } from 'next';

// This won't work with "use client", metadata needs to be in a separate file
// or removed when using client components
// export const metadata: Metadata = {
//   title: 'Forums | Harvest For Good',
//   description: 'Join discussions about sustainable agriculture and food security',
// };

// Sample forum data
const forumCategories = [
  { 
    id: 'sustainable-ag', 
    name: 'Sustainable Agriculture', 
    posts: 24,
    description: 'Discuss sustainable farming methods, soil health, and ecological approaches to agriculture.'
  },
  { 
    id: 'food-security', 
    name: 'Food Security', 
    posts: 18,
    description: 'Addressing challenges in food access, distribution, and security across communities.'
  },
  { 
    id: 'urban-farming', 
    name: 'Urban Farming', 
    posts: 12,
    description: 'Share ideas and experiences about farming in urban environments and community gardens.'
  },
  { 
    id: 'policy', 
    name: 'Food Policy', 
    posts: 9,
    description: 'Discussions about governmental and institutional policies affecting our food systems.'
  }
];

export default function ForumsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // If a category is selected, show its discussions
  if (activeCategory) {
    const category = forumCategories.find(cat => cat.id === activeCategory);
    
    return (
      <div className="container mx-auto px-4">
        <button 
          onClick={() => setActiveCategory(null)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Forums
        </button>
        
        <h1 className="text-4xl font-bold mb-2">{category?.name}</h1>
        <p className="text-lg text-gray-700 mb-8">{category?.description}</p>
        
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Start a New Discussion</h2>
          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Discussion title..."
              className="p-2 border rounded-md"
            />
            <textarea 
              placeholder="Share your thoughts..."
              className="p-2 border rounded-md h-32"
            ></textarea>
            <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 self-start">
              Post Discussion
            </button>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Recent Discussions</h2>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold">Sample Discussion Topic {i+1}</h3>
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
              <p className="text-gray-700 mt-2">
                This is a preview of the discussion content. Click to view the full discussion and responses.
              </p>
              <div className="flex gap-2 mt-4 text-sm text-gray-600">
                <span>{Math.floor(Math.random() * 20)} replies</span>
                <span>•</span>
                <span>{Math.floor(Math.random() * 100)} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Main forum categories view
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-6">Forums</h1>
      <p className="text-lg text-gray-700 mb-8">
        Join the conversation with researchers, practitioners, and community members.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {forumCategories.map(forum => (
          <div 
            key={forum.id} 
            className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setActiveCategory(forum.id)}
          >
            <h2 className="text-2xl font-bold mb-2">{forum.name}</h2>
            <p className="text-gray-700 mb-4">{forum.description}</p>
            <div className="flex justify-between text-gray-600">
              <span>{forum.posts} discussions</span>
              <span>Last post 2h ago</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Community Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-700">63</div>
            <div className="text-sm text-gray-600">Active discussions</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-700">412</div>
            <div className="text-sm text-gray-600">Community members</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-amber-700">1,248</div>
            <div className="text-sm text-gray-600">Total posts</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-700">24</div>
            <div className="text-sm text-gray-600">New posts today</div>
          </div>
        </div>
      </div>
    </div>
  );
}
