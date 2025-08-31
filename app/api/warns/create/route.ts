import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, reason } = body;

    if (!uid || !reason) {
      return NextResponse.json({
        success: false,
        error: "UID and reason are required"
      }, { status: 400 });
    }

    const jwt = request.cookies.get("jwt");
    if (!jwt) {
      return NextResponse.json({
        success: false,
        error: "JWT not found. Please configure your JWT token in settings."
      }, { status: 401 });
    }

    const response = await fetch("https://grust.co/api/warns/create", {
      method: 'POST',
      headers: {
        "Cookie": `jwt=${jwt.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid,
        reason
      })
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `API request failed with status ${response.status}`
      }, { status: response.status });
    }

    const apiData = await response.json();
    
    if (!apiData.success) {
      return NextResponse.json({
        success: false,
        error: "Failed to create warn"
      }, { status: 400 });
    }

    console.log(`User with UID: ${uid} has been warned.`);
    return NextResponse.json({
      success: true,
      message: "Warn created successfully"
    });

  } catch (error) {
    console.error('Create Warn API Error:', error);
    return NextResponse.json({
      success: false,
      error: "Failed to create warn"
    }, { status: 500 });
  }
}
