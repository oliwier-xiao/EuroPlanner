import { cache } from "react";
import { mapDestinationRowToDto } from "@/lib/mapDestinationRow";
import { compareRoutePointsForDisplay } from "@/lib/routePointSort";
import type { RoutePointDto } from "@/lib/routePointTypes";
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

export type TripParticipant = {
  user_id: string;
  role: string;
  name: string | null;
  surname: string | null;
  avatar_id: string | null;
};

export type TripDestination = {
  destination_id: number;
  name: string;
  arrival_time: string | null;
  visit_order: number | null;
};

export type TripSummary = {
  participants: TripParticipant[];
  expensesTotal: number;
  nextDestination: TripDestination | null;
};

export const findTripBySlug = cache(async (slug: string): Promise<TripDetails | null> => {
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
});

export const getTripSummary = cache(async (tripId: string): Promise<TripSummary> => {
  const supabaseServer = getSupabaseServer();

  const [participantsRes, expensesRes, destinationRes] = await Promise.all([
    supabaseServer
      .from("Trip_participants")
      .select("user_id, role")
      .eq("trip_id", tripId),
    supabaseServer
      .from("Expenses")
      .select("amount")
      .eq("trip_id", tripId),
    supabaseServer
      .from("Destinations")
      .select("destination_id, name, arrival_time, visit_order")
      .eq("trip_id", tripId)
      .order("visit_order", { ascending: true, nullsFirst: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const participantRows = (participantsRes.data ?? []) as { user_id: string; role: string }[];
  const userIds = participantRows.map((row) => row.user_id);

  let userById = new Map<string, { name: string | null; surname: string | null; avatar_id: string | null }>();
  if (userIds.length > 0) {
    const { data: usersData } = await supabaseServer
      .from("Users")
      .select("user_id, name, surname, avatar_id")
      .in("user_id", userIds);

    userById = new Map(
      ((usersData ?? []) as { user_id: string; name: string | null; surname: string | null; avatar_id: string | null }[])
        .map((user) => [user.user_id, { name: user.name, surname: user.surname, avatar_id: user.avatar_id }])
    );
  }

  const participants: TripParticipant[] = participantRows.map((row) => {
    const profile = userById.get(row.user_id);
    return {
      user_id: row.user_id,
      role: row.role,
      name: profile?.name ?? null,
      surname: profile?.surname ?? null,
      avatar_id: profile?.avatar_id ?? null,
    };
  });

  const expenseRows = (expensesRes.data ?? []) as { amount: number | string | null }[];
  const expensesTotal = expenseRows.reduce((acc, row) => acc + Number(row.amount ?? 0), 0);

  const destinationRow = destinationRes.data as
    | { destination_id: number; name: string; arrival_time: string | null; visit_order: number | null }
    | null;

  const nextDestination: TripDestination | null = destinationRow
    ? {
        destination_id: destinationRow.destination_id,
        name: destinationRow.name,
        arrival_time: destinationRow.arrival_time ?? null,
        visit_order: destinationRow.visit_order ?? null,
      }
    : null;

  return { participants, expensesTotal, nextDestination };
});

export async function getRoutePoints(tripId: string): Promise<RoutePointDto[]> {
  const supabaseServer = getSupabaseServer();

  const { data, error } = await (supabaseServer as any)
    .from("Destinations")
    .select(
      "destination_id, country, city, arrival_time, departure_time, lat, lng, visit_order"
    )
    .eq("trip_id", tripId);

  if (error) {
    console.error("SZCZEGOLY BLEDU SUPABASE:", error.message, error.hint, error.details);
    throw new Error(error.message);
  }

  const rows: RoutePointDto[] = (data ?? []).map((d: Record<string, unknown>) =>
    mapDestinationRowToDto(d)
  );

  return [...rows].sort(compareRoutePointsForDisplay);
}
