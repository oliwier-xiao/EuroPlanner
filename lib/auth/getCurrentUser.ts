import { supabaseServer } from "@/lib/supabaseServer";

export type CurrentUser = {
  user_id: string;
  name: string | null;
  surname: string | null;
  email: string | null;
  admin_access: boolean | null;
};

export async function getCurrentUser(userId: string): Promise<CurrentUser | null> {
  if (!userId) return null;

  const { data, error } = await supabaseServer
    .from("Users")
    .select("user_id, name, surname")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    user_id: data.user_id,
    name: data.name ?? null,
    surname: data.surname ?? null,
    email: null,
    admin_access: null,
  };
}

export function formatUserDisplayName(user: Pick<CurrentUser, "name" | "surname"> | null) {
  if (!user) return "Użytkownik";

  const fullName = [user.name, user.surname].filter(Boolean).join(" ").trim();
  return fullName || user.name || "Użytkownik";
}