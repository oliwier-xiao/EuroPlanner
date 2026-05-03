// Server Component — pobiera dane wycieczki z bazy żeby wyświetlić jej tytuł
// w pasku nawigacji bez "flash" i bez hardcoda.
//
// ❌ NIE dodawaj tutaj "use client" — Next.js 15 nie pozwala na async w Client Components.
// ✅ Cała interaktywność (sticky tabs, isActive, hover) siedzi w ./TripChrome.tsx.
import "server-only";
import { notFound } from "next/navigation";
import { findTripBySlug } from "@/lib/trips";
import TripChrome from "./TripChrome";

export const dynamic = "force-dynamic";

function formatStatus(startDate: string | null, endDate: string | null) {
  if (!startDate && !endDate) return "Planowana";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(0, 0, 0, 0);

  if (start && start > today) return "Planowana";
  if (start && end && start <= today && end >= today) return "W trakcie";
  if (end && end < today) return "Zakończona";
  return "Planowana";
}

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tripCode: string }>;
}) {
  const { tripCode } = await params;
  const trip = await findTripBySlug(tripCode);

  if (!trip) {
    notFound();
  }

  return (
    <TripChrome
      title={trip.title}
      tripCode={trip.slug}
      status={formatStatus(trip.start_date, trip.end_date)}
      isArchived={trip.is_archived}
    >
      {children}
    </TripChrome>
  );
}
