import { createClient } from "@supabase/supabase-js";
import { getClientEnv } from "./env";

const env = getClientEnv();

export const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
