import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MOCK_POSTS = [
  {
    id: "1",
    title: "Best practices for urban community gardens",
    content: "I've been running a community garden in Chicago for 3 years and wanted to share some lessons learned...",
    authorId: "user-1",
    createdAt: "2023-05-15T14:23:00Z",
    updatedAt: "2023-05-15T14:23:00Z",
  },
  {
    id: "2",
    title: "Sustainable irrigation methods for dry climates",
    content: "With water becoming scarcer in many regions, I've been experimenting with several water-saving techniques...",
    authorId: "user-2",
    createdAt: "2023-06-02T09:15:00Z",
    updatedAt: "2023-06-02T09:15:00Z",
  },
  {
    id: "3",
    title: "Connecting local farmers with food banks",
    content: "Our nonprofit has developed a system to help small farmers donate excess produce to local food banks...",
    authorId: "user-3",
    createdAt: "2023-06-05T16:30:00Z",
    updatedAt: "2023-06-05T16:30:00Z",
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
      id: (MOCK_POSTS.length + 1).toString(),
      title: body.title,
      content: body.content,
      authorId: "current-user", // In real app, get from auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      data: newPost
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}
