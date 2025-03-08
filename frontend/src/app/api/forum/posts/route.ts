import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Sample data for development
const samplePosts = [
  {
    id: 1,
    title: "Best practices for sustainable crop rotation",
    content: "I've been experimenting with different crop rotation methods and wanted to share my findings...",
    author: { username: "GreenFarmer" },
    created_at: "2023-05-15T08:32:45Z",
    updated_at: "2023-05-15T08:32:45Z",
    comments_count: 8
  },
  {
    id: 2,
    title: "Urban composting solutions",
    content: "Living in an apartment doesn't mean you can't compost! Here's how I set up a small-scale system...",
    author: { username: "CityGardener" },
    created_at: "2023-05-10T14:21:33Z",
    updated_at: "2023-05-11T09:45:12Z",
    comments_count: 12
  }
];

export async function GET(request: NextRequest) {
  // Get query parameters (for filtering by category, pagination, etc.)
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  try {
    // In a real app, this would query a database
    // For now, return sample data
    let filteredPosts = samplePosts;
    
    // Optional filtering by category
    if (category) {
      filteredPosts = samplePosts.filter(post => 
        // This is simplistic; in reality you'd have a category field
        post.title.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // DON'T use: return NextResponse.next();
    
    // Instead, return the data directly:
    return NextResponse.json({ 
      results: filteredPosts,
      count: filteredPosts.length 
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate inputs
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }
    
    // In a real app, this would create a post in the database
    // For now, just return a success response with the created post
    const newPost = {
      id: samplePosts.length + 1,
      title: body.title,
      content: body.content,
      author: { username: "CurrentUser" }, // In real app, get from auth
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      comments_count: 0
    };
    
    // DON'T use: return NextResponse.next();
    
    // Instead, return the data directly:
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
