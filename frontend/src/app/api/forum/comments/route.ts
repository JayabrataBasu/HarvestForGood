import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  // Get query parameters from the request URL
  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  
  try {
    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/forum/comments/?${queryString}`, {
      headers: {
        // Forward any authorization headers from the original request
        ...(request.headers.get('Authorization') 
          ? { 'Authorization': request.headers.get('Authorization')! } 
          : {}),
        'Content-Type': 'application/json',
      },
      // Forward cookies for authentication if needed
      credentials: 'include',
    });
    
    const data = await response.json();
    
    // Return the backend response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/forum/comments/`, {
      method: 'POST',
      headers: {
        // Forward any authorization headers from the original request
        ...(request.headers.get('Authorization') 
          ? { 'Authorization': request.headers.get('Authorization')! } 
          : {}),
        'Content-Type': 'application/json',
      },
      // Include the body in the request
      body: JSON.stringify(body),
      // Forward cookies for authentication if needed
      credentials: 'include',
    });
    
    const data = await response.json();
    
    // Return the backend response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
