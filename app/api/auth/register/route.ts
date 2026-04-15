import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const { name, surname, password } = await request.json();

    if (!name || !surname || !password) {
      return NextResponse.json(
        { success: false, message: "Brak imienia, nazwiska lub hasła" },
        { status: 400 }
      );
    }

    // sprawdź czy użytkownik już istnieje
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

    // TODO: w realnej aplikacji zahaszuj hasło (np. bcrypt)
    const { error: insertError } = await supabase
      .from("Users")
      .insert({ name, surname, password });

    if (insertError) {
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
