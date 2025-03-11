import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MOCK_POSTS = [
  {
    id: "1",
    title: "Best practices for urban community gardens",
    content: "I've been running a community garden in Chicago for 3 years and wanted to share some lessons learned...",
    authorName: "GreenThumb",
    createdAt: "2025-02-15T14:23:00Z",
    commentCount: 8,
    tags: ["urban gardening", "community", "tips"]
  },
  {
    id: "2",
    title: "Sustainable irrigation methods for dry climates",
    content: "With water becoming scarcer in many regions, I've been experimenting with several water-saving techniques...",
    authorName: "WaterWise",
    createdAt: "2025-03-02T09:15:00Z",
    commentCount: 12,
    tags: ["irrigation", "sustainability", "drought"]
  },
  {
    id: "3",
    title: "Connecting local farmers with food banks",
    content: "Our nonprofit has developed a system to help small farmers donate excess produce to local food banks...",
    authorName: "HarvestShare",
    createdAt: "2025-03-05T16:30:00Z",
    commentCount: 6,
    tags: ["food banks", "donations", "community support"]
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Forums fetched successfully",
    data: MOCK_POSTS
  });
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
      id: MOCK_POSTS.length + 1,
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
