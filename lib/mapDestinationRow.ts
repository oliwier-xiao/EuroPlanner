import type { RoutePointDto } from "@/lib/routePointTypes";

export function mapDestinationRowToDto(d: Record<string, unknown>): RoutePointDto {
  return {
    destination_id: String(d.destination_id ?? ""),
    country: String(d.country ?? ""),
    city: String(d.city ?? ""),
    arrival_date: d.arrival_time ? String(d.arrival_time).substring(0, 16) : "",
    departure_date: d.departure_time ? String(d.departure_time).substring(0, 16) : "",
    lat: d.lat != null && Number.isFinite(Number(d.lat)) ? Number(d.lat) : null,
    lng: d.lng != null && Number.isFinite(Number(d.lng)) ? Number(d.lng) : null,
    visit_order:
      d.visit_order != null && Number.isFinite(Number(d.visit_order))
        ? Number(d.visit_order)
        : null,
  };
}
