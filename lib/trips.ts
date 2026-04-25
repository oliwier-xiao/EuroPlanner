import { getSupabaseServer } from "@/lib/supabaseServer";

export type TripIdentifier = {
  trip_id: string;
  slug: string;
};

export async function findTripBySlug(slug: string): Promise<TripIdentifier | null> {
  if (!slug) return null;

  const supabaseServer = getSupabaseServer();
  const { data, error } = await supabaseServer
    .from("Trips")
    .select("trip_id, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as TripIdentifier;
}
