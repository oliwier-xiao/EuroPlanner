// Klient Supabase z uprawnieniami service-role — TYLKO server-side.
// Nigdy nie może trafić do bundle klienta (wyciekłby SUPABASE_SERVICE_ROLE_KEY).
import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "./env";

let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseServer() {
  if (client) {
    return client;
  }

  const env = getServerEnv();

  client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return client;
}
