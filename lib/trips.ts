import { getSupabaseServer } from "@/lib/supabaseServer";

export type TripIdentifier = {
  trip_id: string;
  slug: string;
};

export type TripDetails = TripIdentifier & {
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  budget_limit: number | null;
};

export async function findTripBySlug(slug: string): Promise<TripDetails | null> {
  if (!slug) return null;

  const supabaseServer = getSupabaseServer();
  const { data, error } = await supabaseServer
    .from("Trips")
    .select("trip_id, slug, title, description, start_date, end_date, budget_limit")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as {
    trip_id: string;
    slug: string;
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    budget_limit: number | string | null;
  };

  return {
    trip_id: row.trip_id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? null,
    start_date: row.start_date ?? null,
    end_date: row.end_date ?? null,
    budget_limit:
      row.budget_limit !== null && row.budget_limit !== undefined
        ? Number(row.budget_limit)
        : null,
  };
}
