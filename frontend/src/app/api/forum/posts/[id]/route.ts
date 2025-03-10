import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/forum/posts/${params.id}/`, {
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
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Post not found: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Return the backend response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error fetching forum post ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch forum post' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/forum/posts/${params.id}/`, {
      method: 'PATCH',
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
    console.error(`Error updating forum post ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update forum post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Forward the delete request to the backend API
    const response = await fetch(`${API_URL}/api/forum/posts/${params.id}/`, {
      method: 'DELETE',
      headers: {
        // Forward any authorization headers from the original request
        ...(request.headers.get('Authorization') 
          ? { 'Authorization': request.headers.get('Authorization')! } 
          : {}),
      },
      // Forward cookies for authentication if needed
      credentials: 'include',
    });
    
    // If the response is 204 No Content (successful deletion), return an empty response
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    
    const data = await response.json().catch(() => ({}));
    
    // Return the backend response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error deleting forum post ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete forum post' },
      { status: 500 }
    );
  }
}
