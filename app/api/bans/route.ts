import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const jwt = request.cookies.get("jwt");
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '21');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!jwt) {
      return NextResponse.json({
        error: "JWT not found. Please configure your JWT token in settings."
      }, { status: 401 });
    }

    const response = await fetch(`https://grust.co/api/bans?search=${search}&limit=${limit}&offset=${offset}`, {
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

    return NextResponse.json(apiData.data || apiData);
  } catch (error) {
    console.error('Bans API Error:', error);
    return NextResponse.json({
      error: "Failed to fetch bans from external API"
    }, { status: 500 });
  }
}
