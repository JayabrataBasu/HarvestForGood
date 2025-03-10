import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Example: Redirect /forum to /forums
  if (request.nextUrl.pathname === '/forum') {
    return NextResponse.redirect(new URL('/forums', request.url));
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
    '/api/:path*'
  ],
};
