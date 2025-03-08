import { NextResponse } from 'next/server';

// Base API handler
export async function GET() {
  // Instead of NextResponse.next(), return a proper response
  return NextResponse.json({ 
    message: 'API is working',
    version: '1.0.0'
  });
}
