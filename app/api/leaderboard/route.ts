import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_OPENFORMAT_API_KEY;
const API_BASE_URL = "https://api.openformat.tech/v1";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const response = await fetch(`${API_BASE_URL}/leaderboard?${searchParams}`, {
      headers: {
        "X-API-KEY": API_KEY || "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const responseData = await response.json();
    
    // The data is directly in responseData.data array
    if (responseData?.status === "success" && Array.isArray(responseData.data)) {
      return NextResponse.json(responseData.data);
    }

    console.error('Unexpected data structure:', responseData);
    return NextResponse.json(
      { error: 'Invalid data format received from API' },
      { status: 500 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}