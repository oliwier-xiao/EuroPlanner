import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { configErrorMessage } from "@/lib/env";
import { AVATARS } from "@/lib/avatars";

export const dynamic = "force-dynamic";

const VALID_AVATAR_IDS = new Set(AVATARS.map((a) => a.id));

export async function PATCH(request: NextRequest) {
  let supabaseServer;
  try {
    supabaseServer = getSupabaseServer();
  } catch (err) {
    return NextResponse.json(
      { success: false, message: configErrorMessage(err) },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Brak autoryzacji" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Nieprawidłowy JSON" },
      { status: 400 }
    );
  }

  const { avatar_id } = (body ?? {}) as { avatar_id?: unknown };

  if (typeof avatar_id !== "string" || !avatar_id) {
    return NextResponse.json(
      { success: false, message: "avatar_id jest wymagany" },
      { status: 400 }
    );
  }

  if (!VALID_AVATAR_IDS.has(avatar_id)) {
    return NextResponse.json(
      { success: false, message: "Nieznany awatar" },
      { status: 400 }
    );
  }

  const { error } = await supabaseServer
    .from("Users")
    .update({ avatar_id })
    .eq("user_id", userId);

  if (error) {
    console.error("Błąd aktualizacji awatara:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Nie udało się zaktualizować awatara" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, avatar_id });
}
