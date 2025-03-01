import { NextResponse } from 'next/server';

export async function GET() {
  // This ensures the route exists
  return NextResponse.next();
}
