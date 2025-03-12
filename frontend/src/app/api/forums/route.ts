import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: "Forums fetched successfully",
      data: []
    });
  } catch (error) {
    console.error("Error fetching forums:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch forums" },
      { status: 500 }
    );
  }
}
