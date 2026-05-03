import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { configErrorMessage } from "@/lib/env";
import { findTripBySlug } from "@/lib/trips";

export const dynamic = "force-dynamic";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;
  if (!userId) return null;
  return getCurrentUser(userId);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ tripCode: string }> }
) {
  let supabaseServer;
  try {
    supabaseServer = getSupabaseServer();
  } catch (err) {
    return NextResponse.json({ success: false, message: configErrorMessage(err) }, { status: 500 });
  }

  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ success: false, message: "Brak autoryzacji" }, { status: 401 });
  }

  const { tripCode } = await context.params;
  const trip = await findTripBySlug(tripCode);
  if (!trip) {
    return NextResponse.json({ success: false, message: "Nie znaleziono podróży" }, { status: 404 });
  }

  const { data: membership } = await supabaseServer
    .from("Trip_participants")
    .select("trip_id, role")
    .eq("trip_id", trip.trip_id)
    .eq("user_id", user.user_id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ success: false, message: "Brak dostępu do podróży" }, { status: 403 });
  }

  if (membership.role !== "owner") {
    return NextResponse.json({ success: false, message: "Tylko właściciel może archiwizować podróż" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Nieprawidłowe dane" }, { status: 400 });
  }

  const { is_archived } = (body ?? {}) as { is_archived?: boolean };
  if (typeof is_archived !== "boolean") {
    return NextResponse.json({ success: false, message: "Pole is_archived jest wymagane" }, { status: 400 });
  }

  const { error } = await supabaseServer
    .from("Trips")
    .update({ is_archived })
    .eq("trip_id", trip.trip_id);

  if (error) {
    return NextResponse.json({ success: false, message: "Nie udało się zaktualizować podróży" }, { status: 500 });
  }

  return NextResponse.json({ success: true, trip: { slug: trip.slug, isArchived: is_archived } });
}

