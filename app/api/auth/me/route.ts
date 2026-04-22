import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser, formatUserDisplayName } from "@/lib/auth/getCurrentUser";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  const user = await getCurrentUser(userId);

  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user: {
      ...user,
      displayName: formatUserDisplayName(user),
    },
  });
}