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
    <TripChrome title={trip.title} tripCode={trip.slug}>
      {children}
    </TripChrome>
  );
}
