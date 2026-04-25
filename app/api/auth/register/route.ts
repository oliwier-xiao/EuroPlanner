import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const surname = typeof body?.surname === "string" ? body.surname.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const rawEmail = typeof body?.email === "string" ? body.email.trim() : "";
    const email = rawEmail.length > 0 ? rawEmail.toLowerCase() : null;

    if (!name || !surname || !password) {
      return NextResponse.json(
        { success: false, message: "Brak imienia, nazwiska lub hasła" },
        { status: 400 }
      );
    }

    if (email && !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, message: "Nieprawidłowy format adresu e-mail" },
        { status: 400 }
      );
    }

    const { data: existingUser, error: existingError } = await supabase
      .from("Users")
      .select("user_id")
      .eq("name", name)
      .eq("surname", surname)
      .maybeSingle();

    if (existingError) {
      console.error("Błąd podczas sprawdzania użytkownika:", existingError);
      return NextResponse.json(
        { success: false, message: "Błąd serwera podczas rejestracji" },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Użytkownik o takim imieniu i nazwisku już istnieje" },
        { status: 400 }
      );
    }

    const insertPayload: Record<string, unknown> = {
      name,
      surname,
      password,
      avatar_id: "yellow-smile",
    };
    if (email) insertPayload.email = email;

    const { error: insertError } = await supabase.from("Users").insert(insertPayload);

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { success: false, message: "Ten adres e-mail jest już używany przez inne konto" },
          { status: 409 }
        );
      }
      console.error("Błąd podczas tworzenia użytkownika:", insertError);
      return NextResponse.json(
        { success: false, message: "Nie udało się utworzyć użytkownika" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Nieoczekiwany błąd rejestracji:", err);
    return NextResponse.json(
      { success: false, message: "Nieoczekiwany błąd serwera" },
      { status: 500 }
    );
  }
}
