import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, duration, reason, proof } = body;

    if (!uid || reason === undefined || proof === undefined) {
      return NextResponse.json({
        success: false,
        error: "UID, reason, and proof are required"
      }, { status: 400 });
    }

    if (duration !== undefined && duration < 0) {
      return NextResponse.json({
        success: false,
        error: "Duration must be greater than or equal to 0"
      }, { status: 400 });
    }

    const jwt = request.cookies.get("jwt");
    if (!jwt) {
      return NextResponse.json({
        success: false,
        error: "JWT not found. Please configure your JWT token in settings."
      }, { status: 401 });
    }

    const payload: any = {
      uid,
      reason,
      proof
    };

    if (duration !== undefined) {
      payload.duration = duration;
    } else {
      payload.duration = 0;
    }

    const response = await fetch("https://grust.co/api/bans/create", {
      method: 'POST',
      headers: {
        "Cookie": `jwt=${jwt.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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
        error: "Failed to create ban"
      }, { status: 400 });
    }

    console.log(`User with UID: ${uid} has been banned.`);
    return NextResponse.json({
      success: true,
      message: "Ban created successfully"
    });

  } catch (error) {
    console.error('Create Ban API Error:', error);
    return NextResponse.json({
      success: false,
      error: "Failed to create ban"
    }, { status: 500 });
  }
}
