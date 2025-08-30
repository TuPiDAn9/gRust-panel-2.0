import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    const jwt = request.cookies.get("jwt");

    if (!jwt) {
      return NextResponse.json({
        error: "JWT not found. Please configure your JWT token in settings."
      }, { status: 401 });
    }

    const response = await fetch(`https://grust.co/api/warns/${uid}`, {
      headers: {
        "Cookie": `jwt=${jwt.value}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        error: `API request failed with status ${response.status}`
      }, { status: response.status });
    }

    const apiData = await response.json();

    if (apiData.success === false) {
      return NextResponse.json({
        error: "Invalid API response"
      }, { status: 500 });
    }

    return NextResponse.json(apiData.data || []);
  } catch (error) {
    console.error('Warns API Error:', error);
    return NextResponse.json({
      error: "Failed to fetch warns from external API"
    }, { status: 500 });
  }
}