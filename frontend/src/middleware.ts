import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the path starts with /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get token from cookies (JWT would typically be stored in a cookie in a production app)
    const token = request.cookies.get('access_token')?.value || 
                  request.cookies.get('next-auth.session-token')?.value;
    
    // Get token from Authorization header as fallback (for API routes)
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader ? authHeader.split(' ')[1] : null;
    
    // Check localStorage token (this will only work client-side)
    const localStorageToken = typeof window !== 'undefined' ? 
      localStorage.getItem('access_token') : null;
    
    // If no token is found, redirect to login
    if (!token && !headerToken && !localStorageToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
