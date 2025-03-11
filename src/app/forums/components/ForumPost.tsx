'use client';

import Link from 'next/link';

interface ForumPostProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  commentCount: number;
  tags?: string[];
}

export default function ForumPost({ id, title, content, author, createdAt, commentCount, tags }: ForumPostProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-4 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        <Link href={`/forums/posts/${id}`} className="hover:text-green-700">
          {title}
        </Link>
      </h2>
      
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <span className="mr-3">{author}</span>
        <span className="mr-3">•</span>
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-2">
        {content.replace(/(<([^>]+)>)/gi, '').substring(0, 150)}
        {content.length > 150 ? '...' : ''}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {tags?.map(tag => (
            <span 
              key={tag} 
              className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center text-gray-500">
          <svg 
            className="w-5 h-5 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <span>{commentCount} comments</span>
        </div>
      </div>
    </div>
  );
}
