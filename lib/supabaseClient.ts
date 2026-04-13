import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Brak NEXT_PUBLIC_SUPABASE_URL lub NEXT_PUBLIC_SUPABASE_ANON_KEY w zmiennych środowiskowych.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
