import "server-only";

import type {
  RouteAlternativeDto,
  RoutePointDto,
  RoutePreviewDto,
} from "@/lib/routePointTypes";

const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

type OsrmRouteResponse = {
  code: string;
  routes?: Array<{
    distance: number;
    duration: number;
    geometry?: { coordinates: [number, number][] };
    legs?: Array<{ distance: number; duration: number }>;
  }>;
  message?: string;
};

export async function buildRoutePreview(
  points: RoutePointDto[]
): Promise<RoutePreviewDto | null> {
  const withCoords = points.filter(
    (point) =>
      point.lat != null &&
      point.lng != null &&
      Number.isFinite(point.lat) &&
      Number.isFinite(point.lng)
  );

  if (withCoords.length < 2) return null;

  const coordinateString = withCoords.map((p) => `${p.lng},${p.lat}`).join(";");
  const url = `${OSRM_BASE_URL}/${coordinateString}?overview=full&geometries=geojson&steps=false`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "EuroPlanner/1.0 route-preview",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OSRM routing HTTP ${res.status}: ${text || "empty body"}`);
  }

  const payload = (await res.json()) as OsrmRouteResponse;
  const route = payload.routes?.[0];
  if (payload.code !== "Ok" || !route?.geometry?.coordinates) {
    throw new Error(payload.message || "Failed to build route preview.");
  }

  return {
    geometry: route.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]),
    total_duration_seconds: Math.round(route.duration ?? 0),
    total_distance_meters: Math.round(route.distance ?? 0),
    legs: (route.legs ?? []).map((leg, index) => ({
      from_destination_id: withCoords[index]?.destination_id ?? String(index),
      to_destination_id: withCoords[index + 1]?.destination_id ?? String(index + 1),
      duration_seconds: Math.round(leg.duration ?? 0),
      distance_meters: Math.round(leg.distance ?? 0),
    })),
  };
}

export async function buildRouteAlternatives(
  from: RoutePointDto,
  to: RoutePointDto,
  maxAlternatives = 3
): Promise<RouteAlternativeDto[]> {
  if (
    from.lat == null ||
    from.lng == null ||
    to.lat == null ||
    to.lng == null ||
    !Number.isFinite(from.lat) ||
    !Number.isFinite(from.lng) ||
    !Number.isFinite(to.lat) ||
    !Number.isFinite(to.lng)
  ) {
    return [];
  }

  const coordinateString = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `${OSRM_BASE_URL}/${coordinateString}?overview=full&geometries=geojson&steps=false&alternatives=${Math.max(
    1,
    Math.min(maxAlternatives, 5)
  )}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "EuroPlanner/1.0 route-alternatives",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OSRM alternatives HTTP ${res.status}: ${text || "empty body"}`);
  }

  const payload = (await res.json()) as OsrmRouteResponse;
  if (payload.code !== "Ok" || !payload.routes?.length) {
    throw new Error(payload.message || "Failed to fetch route alternatives.");
  }

  const previews = payload.routes
    .filter((r) => r.geometry?.coordinates?.length)
    .map((r) => ({
      geometry: r.geometry!.coordinates.map(
        ([lng, lat]) => [lat, lng] as [number, number]
      ),
      total_duration_seconds: Math.round(r.duration ?? 0),
      total_distance_meters: Math.round(r.distance ?? 0),
      legs: [
        {
          from_destination_id: from.destination_id,
          to_destination_id: to.destination_id,
          duration_seconds: Math.round(r.duration ?? 0),
          distance_meters: Math.round(r.distance ?? 0),
        },
      ],
    }))
    .sort((a, b) => a.total_duration_seconds - b.total_duration_seconds)
    .slice(0, maxAlternatives);

  return previews.map((preview, i) => ({ id: `alt-${i + 1}`, preview }));
}

export async function buildFastestPerLegPreview(
  points: RoutePointDto[],
  maxAlternativesPerLeg = 3
): Promise<RoutePreviewDto | null> {
  const withCoords = points.filter(
    (p) =>
      p.lat != null &&
      p.lng != null &&
      Number.isFinite(p.lat) &&
      Number.isFinite(p.lng)
  );

  if (withCoords.length < 2) return null;
  if (withCoords.length === 2) {
    const alts = await buildRouteAlternatives(withCoords[0], withCoords[1], maxAlternativesPerLeg);
    return alts[0]?.preview ?? null;
  }

  let total_duration_seconds = 0;
  let total_distance_meters = 0;
  const legs: RoutePreviewDto["legs"] = [];
  const geometry: [number, number][] = [];

  for (let i = 0; i < withCoords.length - 1; i++) {
    const from = withCoords[i]!;
    const to = withCoords[i + 1]!;
    const alts = await buildRouteAlternatives(from, to, maxAlternativesPerLeg);
    const fastest = alts[0]?.preview;
    if (!fastest) return await buildRoutePreview(withCoords);

    total_duration_seconds += fastest.total_duration_seconds;
    total_distance_meters += fastest.total_distance_meters;
    legs.push({
      from_destination_id: from.destination_id,
      to_destination_id: to.destination_id,
      duration_seconds: fastest.total_duration_seconds,
      distance_meters: fastest.total_distance_meters,
    });

    if (geometry.length === 0) geometry.push(...fastest.geometry);
    else geometry.push(...fastest.geometry.slice(1));
  }

  return {
    geometry,
    total_duration_seconds: Math.round(total_duration_seconds),
    total_distance_meters: Math.round(total_distance_meters),
    legs,
  };
}
