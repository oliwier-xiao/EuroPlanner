import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentUser, formatUserDisplayName } from "@/lib/auth/getCurrentUser";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;

  if (!userId) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  let user = null;
  try {
    user = await getCurrentUser(userId);
  } catch {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user: {
      ...user,
      displayName: formatUserDisplayName(user),
      avatar_id: user.avatar_id,
    },
  });
}