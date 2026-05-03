"use server";

import { revalidatePath } from "next/cache";
import { geocodeCityCountry } from "@/lib/geocoding/nominatim";
import { mapDestinationRowToDto } from "@/lib/mapDestinationRow";
import type { RoutePointDto } from "@/lib/routePointTypes";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { findTripBySlug } from "@/lib/trips";

function routePagePath(tripCode: string) {
  return `/trips/${tripCode}/route`;
}

async function assertTripNotArchived(tripCode: string) {
  const trip = await findTripBySlug(tripCode);
  if (!trip) {
    throw new Error("Nie znaleziono podróży.");
  }
  if (trip.is_archived) {
    throw new Error("Ta podróż jest zarchiwizowana — nie można wprowadzać zmian.");
  }
  return trip;
}

async function nextVisitOrder(supabase: any, tripId: string): Promise<number> {
  const { data, error } = await supabase
    .from("Destinations")
    .select("visit_order")
    .eq("trip_id", tripId);

  if (error) {
    console.error("visit_order select:", error);
    throw new Error("Nie udalo sie ustalic kolejnosci punktu.");
  }

  const orders = (data ?? [])
    .map((r: { visit_order: number | null }) => r.visit_order)
    .filter((n: unknown): n is number => typeof n === "number" && Number.isFinite(n));

  const max = orders.length > 0 ? Math.max(...orders) : 0;
  return max + 1;
}

export async function addRoutePointAction(
  tripCode: string,
  point: {
    trip_id: string;
    country: string;
    city: string;
    arrival_date: string;
    departure_date: string;
  }
): Promise<RoutePointDto> {
  const trip = await assertTripNotArchived(tripCode);
  const supabaseServer = getSupabaseServer() as any;

  const geo = await geocodeCityCountry(point.city, point.country);
  if (!geo) {
    throw new Error(
      "Nie znaleziono lokalizacji na mapie (OpenStreetMap). Sprawdz miasto i kraj."
    );
  }

  const visit_order = await nextVisitOrder(supabaseServer, trip.trip_id);

  const { data, error } = await supabaseServer
    .from("Destinations")
    .insert([
      {
        trip_id: trip.trip_id,
        country: point.country,
        city: point.city,
        arrival_time: point.arrival_date ? `${point.arrival_date}:00` : null,
        departure_time: point.departure_date ? `${point.departure_date}:00` : null,
        lat: geo.lat,
        lng: geo.lon,
        visit_order,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Blad zapisu Destinations:", error);
    throw new Error("Blad zapisu lokalizacji.");
  }

  revalidatePath(routePagePath(tripCode));
  return mapDestinationRowToDto(data as Record<string, unknown>);
}

export async function updateRoutePointAction(
  tripCode: string,
  id: string,
  data: {
    country: string;
    city: string;
    arrival_date: string;
    departure_date: string;
  }
): Promise<RoutePointDto> {
  const trip = await assertTripNotArchived(tripCode);
  const supabaseServer = getSupabaseServer() as any;

  const geo = await geocodeCityCountry(data.city, data.country);
  if (!geo) {
    throw new Error(
      "Nie znaleziono lokalizacji na mapie (OpenStreetMap). Sprawdz miasto i kraj."
    );
  }

  const { data: row, error } = await supabaseServer
    .from("Destinations")
    .update({
      country: data.country,
      city: data.city,
      arrival_time: data.arrival_date ? `${data.arrival_date}:00` : null,
      departure_time: data.departure_date ? `${data.departure_date}:00` : null,
      lat: geo.lat,
      lng: geo.lon,
    })
    .eq("destination_id", id)
    .eq("trip_id", trip.trip_id)
    .select()
    .single();

  if (error) {
    console.error("Blad edycji Destinations:", error);
    throw new Error("Blad edycji miejsca");
  }

  revalidatePath(routePagePath(tripCode));
  return mapDestinationRowToDto(row as Record<string, unknown>);
}

export async function deleteRoutePointAction(tripCode: string, destinationId: string) {
  const trip = await assertTripNotArchived(tripCode);
  const supabaseServer = getSupabaseServer() as any;
  const { error } = await supabaseServer
    .from("Destinations")
    .delete()
    .eq("destination_id", destinationId)
    .eq("trip_id", trip.trip_id);

  if (error) throw new Error("Nie udalo sie usunac punktu.");
  revalidatePath(routePagePath(tripCode));
}
