import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { jwt } = await request.json();
    
    if (!jwt) {
      return NextResponse.json({ error: "JWT is required" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    
    response.cookies.set({
      name: "jwt",
      value: jwt,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: false, 
      maxAge: 60 * 60 * 24 * 7, 
    });

    console.log('JWT token has been set/updated');
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to set JWT" }, { status: 500 });
  }
}
