import { NextResponse } from 'next/server';

// Base forum API handler
export async function GET() {
  // Return available forum routes instead of using NextResponse.next()
  return NextResponse.json({
    available_endpoints: [
      "/api/forum/posts",
      "/api/forum/categories"
    ],
    message: "Forum API is working"
  });
}
