import { NextResponse } from 'next/server';

export async function GET() {
  // Return a proper JSON response
  return NextResponse.json({
    message: 'Forums API is working'
  });
}
