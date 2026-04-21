import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";
import DashboardClient from "./DashboardClient";

async function getUserName(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("Users")
    .select("name")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data.name ?? null;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;

  const userName = userId ? await getUserName(userId) : null;

  return <DashboardClient userName={userName} />;
}
