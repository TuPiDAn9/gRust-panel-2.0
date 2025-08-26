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
    // Используем тот же endpoint что и в Python плагине
    const res = await fetch("https://grust.co/api/users/me", {
      headers: {
        "Cookie": `jwt=${jwt.value}`,
        'Content-Type': 'application/json'
      },
    });

    const data = await res.json();
    
    if (data.success) {
      return NextResponse.json({
        success: true,
        message: "JWT is valid",
        user: data.data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "JWT is invalid",
        error: data.error
      });
    }
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Network error",
      error: String(error)
    });
  }
}
