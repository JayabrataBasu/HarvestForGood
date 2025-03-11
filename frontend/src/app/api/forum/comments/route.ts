import { NextRequest, NextResponse } from "next/server";

// Define interfaces for type safety
interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
  updatedAt?: string;
}

interface CommentRequest {
  content: string;
  postId: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Validate comment request body
function validateCommentRequest(body: Partial<CommentRequest>): { isValid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
    errors.push('Comment content is required');
  }
  
  if (!body.postId || typeof body.postId !== 'string') {
    errors.push('Valid postId is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

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
      // Add timeout for network requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json<ErrorResponse>(
        { 
          error: 'Failed to fetch comments', 
          details: errorData?.message || `Server responded with status: ${response.status}`
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Return the backend response with type safety
    return NextResponse.json<Comment[]>(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching comments:', error);
    
    // Specific error handling based on error type
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Network error', details: 'Unable to connect to the comments server' },
        { status: 503 }
      );
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json<ErrorResponse>(
        { error: 'Request timeout', details: 'The server took too long to respond' },
        { status: 504 }
      );
    }
    
    return NextResponse.json<ErrorResponse>(
      { error: 'Failed to fetch comments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Validate the request body
    const validation = validateCommentRequest(body);
    if (!validation.isValid) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Invalid comment data', details: validation.errors?.join(', ') },
        { status: 400 }
      );
    }
    
    // Check authorization
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Unauthorized', details: 'Authentication required to post comments' },
        { status: 401 }
      );
    }
    
    // Forward the request to the backend API
    const response = await fetch(`${API_URL}/api/forum/comments/`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      // Include the body in the request
      body: JSON.stringify(body),
      // Forward cookies for authentication if needed
      credentials: 'include',
      // Add timeout for network requests
      signal: AbortSignal.timeout(15000), // 15 second timeout for POST
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json<ErrorResponse>(
        { 
          error: 'Failed to create comment', 
          details: errorData?.message || `Server responded with status: ${response.status}`
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Return the backend response with type safety
    return NextResponse.json<Comment>(data, { status: response.status });
  } catch (error) {
    console.error('Error creating comment:', error);
    
    // Specific error handling based on error type
    if (error instanceof SyntaxError) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Invalid request format', details: 'The request body is not valid JSON' },
        { status: 400 }
      );
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Network error', details: 'Unable to connect to the comments server' },
        { status: 503 }
      );
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json<ErrorResponse>(
        { error: 'Request timeout', details: 'The server took too long to respond' },
        { status: 504 }
      );
    }
    
    return NextResponse.json<ErrorResponse>(
      { error: 'Failed to create comment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
