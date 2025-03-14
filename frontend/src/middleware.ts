import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Example: Redirect /forum to /forums
  if (request.nextUrl.pathname === '/forum') {
    return NextResponse.redirect(new URL('/forums', request.url));
  }

  // Handle API requests
  if (request.nextUrl.pathname.startsWith('/api')) {
    // For /api requests that don't exist in Next.js routes,
    // proxy them to the backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const apiPath = request.nextUrl.pathname.replace(/^\/api/, '');
    
    // Create URL to the backend API with the same path
    const url = new URL(apiPath, backendUrl);
    
    // Add any query parameters
    url.search = request.nextUrl.search;
    
    return NextResponse.rewrite(url);
  }
  
  // IMPORTANT: Don't use NextResponse.next()
  // Simply return undefined to continue the request without modification
  return undefined;
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    // Add paths that need middleware processing
    '/forum',
    '/api/:path*',
  ],
};
