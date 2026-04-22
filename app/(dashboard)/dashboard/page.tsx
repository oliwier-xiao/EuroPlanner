import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";
import DashboardClient from "./DashboardClient";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getUserName(userId: string): Promise<string | null> {
  if (!UUID_RE.test(userId)) return null;

  try {
    const { data, error } = await supabase
      .from("Users")
      .select("name")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) return null;
    return data.name ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;

  const userName = userId ? await getUserName(userId) : null;

  // Przekazujemy imię do komponentu klienta
  return <DashboardClient userName={userName} />;
}