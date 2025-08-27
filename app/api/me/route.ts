import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const jwt = request.cookies.get("jwt");
  
  if (!jwt) {
    return NextResponse.json({
      success: false,
      message: "JWT not found"
    }, { status: 401 });
  }

  try {
    const response = await fetch("https://grust.co/api/users/me", {
      headers: {
        "Cookie": `jwt=${jwt.value}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: `API request failed with status ${response.status}`
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json({
        success: true,
        data: data.data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to get user info",
        error: data.error
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Network error",
      error: String(error)
    }, { status: 500 });
  }
}
