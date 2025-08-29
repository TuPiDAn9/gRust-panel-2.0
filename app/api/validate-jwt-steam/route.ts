import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions(request))
    
    if (!session?.user?.steam) {
      return NextResponse.json({
        success: false,
        message: "Steam session not found"
      }, { status: 401 })
    }

    const jwt = request.cookies.get("jwt")
    if (!jwt) {
      return NextResponse.json({
        success: false,
        message: "JWT not found"
      }, { status: 401 })
    }

    const response = await fetch("https://grust.co/api/users/me", {
      headers: {
        "Cookie": `jwt=${jwt.value}`,
        'Content-Type': 'application/json'
      },
    })

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: `gRust API error: ${response.status}`
      }, { status: response.status })
    }

    const grustData = await response.json()
    
    if (!grustData.success || !grustData.data) {
      return NextResponse.json({
        success: false,
        message: "Invalid response from gRust API"
      }, { status: 400 })
    }

    const grustUid = grustData.data.uid
    const steamId64 = (session.user.steam as any)?.steamid

    if (!steamId64) {
      return NextResponse.json({
        success: false,
        message: "Failed to get Steam ID"
      }, { status: 400 })
    }

    if (grustUid !== steamId64) {
      return NextResponse.json({
        success: false,
        message: "JWT token does not match your Steam account. Make sure you are using a token from the same account you used to log in to the panel."
      }, { status: 403 })
    }

    const userPower = grustData.data.power || 0
    if (userPower < 5) {
      return NextResponse.json({
        success: false,
        message: "Access denied. Administrator privileges required."
      }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      message: "JWT token is valid and matches your Steam account",
      user: grustData.data
    })

  } catch (error) {
    console.error('JWT validation error:', error)
    return NextResponse.json({
      success: false,
      message: "Error validating JWT token"
    }, { status: 500 })
  }
}
