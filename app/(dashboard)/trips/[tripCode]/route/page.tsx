import { notFound } from "next/navigation";

import { findTripBySlug, getRoutePoints } from "@/lib/trips";
import RouteClient from "./RouteClient";

export const dynamic = "force-dynamic";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ tripCode: string }>;
}) {
  const resolvedParams = await params;
  const trip = await findTripBySlug(resolvedParams.tripCode);

  if (!trip) {
    notFound();
  }

  const routePoints = await getRoutePoints(trip.trip_id);

  return (
    <RouteClient
      initialPoints={routePoints}
      tripId={trip.trip_id}
      tripCode={resolvedParams.tripCode}
    />
  );
}