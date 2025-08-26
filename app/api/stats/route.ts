import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const jwt = request.cookies.get("jwt");
  
  if (!jwt) {
    return NextResponse.json({ 
      success: false, 
      message: "JWT not found - Please save your JWT token in Settings"
    }, { status: 401 });
  }

  try {
    const res = await fetch("https://grust.co/api/util/stats", {
      headers: {
        // ИСПРАВЛЕНИЕ: Используем Cookie вместо Authorization
        "Cookie": `jwt=${jwt.value}`,
        'Content-Type': 'application/json',
        'User-Agent': 'gRust-Panel/2.0'
      },
    });

    const responseText = await res.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        message: "Invalid JSON response from gRust API",
        debug: { responseText }
      }, { status: 500 });
    }

    if (data.success === false) {
      return NextResponse.json({
        success: false,
        message: data.error || data.message || "gRust API returned error",
        debug: { 
          httpStatus: res.status,
          responseBody: data,
          jwtPrefix: jwt.value.substring(0, 10) + '...'
        }
      });
    }

    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Network error connecting to gRust API",
      debug: { error: String(error) }
    }, { status: 500 });
  }
}
