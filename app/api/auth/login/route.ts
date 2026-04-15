import { NextRequest, NextResponse } from "next/server";

const MOCK_USER = { username: "admin", password: "admin" };

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  if (username === MOCK_USER.username && password === MOCK_USER.password) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth-token", "mock-session-admin", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  }

  return NextResponse.json(
    { success: false, message: "Nieprawidłowa nazwa użytkownika lub hasło" },
    { status: 401 }
  );
}
