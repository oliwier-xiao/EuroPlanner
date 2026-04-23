import { getSupabaseServer } from "@/lib/supabaseServer";

export type CurrentUser = {
  user_id: string;
  name: string | null;
  surname: string | null;
  email: string | null;
  admin_access: boolean | null;
};

type UserRow = {
  user_id: string;
  name: string | null;
  surname: string | null;
};

export async function getCurrentUser(userId: string): Promise<CurrentUser | null> {
  if (!userId) return null;

  const supabaseServer = getSupabaseServer();

  const { data, error } = await supabaseServer
    .from("Users")
    .select("user_id, name, surname")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const userData = data as UserRow;

  return {
    user_id: userData.user_id,
    name: userData.name ?? null,
    surname: userData.surname ?? null,
    email: null,
    admin_access: null,
  };
}

export function formatUserDisplayName(user: Pick<CurrentUser, "name" | "surname"> | null) {
  if (!user) return "Użytkownik";

  const fullName = [user.name, user.surname].filter(Boolean).join(" ").trim();
  return fullName || user.name || "Użytkownik";
}