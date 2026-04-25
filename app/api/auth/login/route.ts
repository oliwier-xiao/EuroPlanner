import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Nieprawidłowy JSON w żądaniu logowania:", parseError);
      return NextResponse.json(
        { success: false, message: "Nieprawidłowe dane logowania" },
        { status: 400 }
      );
    }

    const { name, password } = (body ?? {}) as { name?: string; password?: string };

    if (!name || !password) {
      return NextResponse.json(
        { success: false, message: "Brak imienia lub hasła" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from("Users")
      .select("user_id, name, password")
      .eq("name", name)
      .eq("password", password)
      .maybeSingle();

    if (error) {
      console.error("Błąd podczas logowania:", error);
      return NextResponse.json(
        { success: false, message: "Błąd serwera podczas logowania" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Nieprawidłowe imię lub hasło" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("auth-token", user.user_id, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (err) {
    console.error("Nieoczekiwany błąd logowania:", err);
    return NextResponse.json(
      { success: false, message: "Nieoczekiwany błąd serwera" },
      { status: 500 }
    );
  }
}
