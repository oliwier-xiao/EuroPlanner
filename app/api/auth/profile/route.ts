import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { configErrorMessage } from "@/lib/env";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;

type ProfileUpdate = {
  name?: string;
  surname?: string | null;
  email?: string | null;
};

function normalizeOptionalString(value: unknown, maxLength: number): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > maxLength) return undefined;
  return trimmed;
}

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

  const { name: rawName, surname: rawSurname, email: rawEmail } = (body ?? {}) as {
    name?: unknown;
    surname?: unknown;
    email?: unknown;
  };

  const update: ProfileUpdate = {};

  const name = normalizeOptionalString(rawName, MAX_NAME_LENGTH);
  if (name !== undefined) {
    if (name === null || name.length === 0) {
      return NextResponse.json(
        { success: false, message: "Imię nie może być puste" },
        { status: 400 }
      );
    }
    update.name = name;
  }

  const surname = normalizeOptionalString(rawSurname, MAX_NAME_LENGTH);
  if (surname !== undefined) {
    update.surname = surname;
  }

  const email = normalizeOptionalString(rawEmail, MAX_EMAIL_LENGTH);
  if (email !== undefined) {
    if (email !== null && !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, message: "Nieprawidłowy format adresu e-mail" },
        { status: 400 }
      );
    }
    update.email = email ? email.toLowerCase() : null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { success: false, message: "Brak zmian do zapisania" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("Users")
    .update(update)
    .eq("user_id", userId)
    .select("user_id, name, surname, email, avatar_id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { success: false, message: "Ten adres e-mail jest już używany przez inne konto" },
        { status: 409 }
      );
    }
    console.error("[PATCH /api/auth/profile] Supabase error:", error.message);
    return NextResponse.json(
      { success: false, message: "Nie udało się zaktualizować profilu" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, user: data });
}
