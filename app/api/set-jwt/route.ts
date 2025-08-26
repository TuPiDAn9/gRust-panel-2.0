import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { jwt } = await request.json();
    
    if (!jwt) {
      return NextResponse.json({ error: "JWT is required" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    
    // Устанавливаем HttpOnly cookie как на grust.co
    response.cookies.set({
      name: "jwt",
      value: jwt,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: false, // true только для production
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to set JWT" }, { status: 500 });
  }
}
