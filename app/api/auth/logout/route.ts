import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // 303 See Other -> po POST przegladarka robi GET na Location,
  // co jest wymagane przy form submit z <form method="POST">.
  const response = NextResponse.redirect(new URL("/login", request.url), {
    status: 303,
  });
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
