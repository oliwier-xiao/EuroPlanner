import { getSupabaseServer } from "@/lib/supabaseServer";

export type CurrentUser = {
  user_id: string;
  name: string | null;
  surname: string | null;
  email: string | null;
  admin_access: boolean | null;
  avatar_id: string | null;
};

type UserRow = {
  user_id: string;
  name: string | null;
  surname: string | null;
  email?: string | null;
  avatar_id?: string | null;
};

const PG_UNDEFINED_COLUMN = "42703";

export async function getCurrentUser(userId: string): Promise<CurrentUser | null> {
  if (!userId) return null;

  const supabaseServer = getSupabaseServer();

  let { data, error } = await supabaseServer
    .from("Users")
    .select("user_id, name, surname, email, avatar_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error && (error.code === PG_UNDEFINED_COLUMN || /column .* does not exist/i.test(error.message))) {
    console.warn("[getCurrentUser] Brak kolumny email/avatar_id — uruchom migracje SQL. Fallback do podstawowego SELECT.");
    const fallback = await supabaseServer
      .from("Users")
      .select("user_id, name, surname")
      .eq("user_id", userId)
      .maybeSingle();
    data = fallback.data;
    error = fallback.error;
  }

  if (error) {
    console.error("[getCurrentUser] Supabase error:", error.message);
    return null;
  }

  if (!data) return null;

  const userData = data as UserRow;

  return {
    user_id: userData.user_id,
    name: userData.name ?? null,
    surname: userData.surname ?? null,
    email: userData.email ?? null,
    admin_access: null,
    avatar_id: userData.avatar_id ?? null,
  };
}

export function formatUserDisplayName(user: Pick<CurrentUser, "name" | "surname"> | null) {
  if (!user) return "Użytkownik";

  const fullName = [user.name, user.surname].filter(Boolean).join(" ").trim();
  return fullName || user.name || "Użytkownik";
}
