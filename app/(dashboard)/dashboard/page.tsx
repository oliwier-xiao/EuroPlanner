import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";
import DashboardClient from "./DashboardClient";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

import { getCurrentUser, formatUserDisplayName } from "@/lib/auth/getCurrentUser";

type TripCard = {
  id: string;
  name: string;
  status: string;
  budget: number;
  spent: string;
  total: string;
  participants: number;
  dates: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatTripDates(startDate: string | null, endDate: string | null) {
  if (!startDate && !endDate) return "Brak dat";

  const formatter = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const start = startDate ? formatter.format(new Date(startDate)) : "?";
  const end = endDate ? formatter.format(new Date(endDate)) : "?";
  return `${start} - ${end}`;
}

function getTripStatus(startDate: string | null, endDate: string | null) {
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

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;

  if (!userId || !UUID_RE.test(userId)) {
    return <DashboardClient user={null} trips={[]} stats={null} />;
  }

  const user = await getCurrentUser(userId);

  if (!user) {
    return <DashboardClient user={null} trips={[]} stats={null} />;
  }

  const { data: membershipRows } = await supabase
    .from("Trip_participants")
    .select("trip_id")
    .eq("user_id", userId);

  const tripIds = (membershipRows ?? []).map((row) => row.trip_id).filter(Boolean);

  if (tripIds.length === 0) {
    return (
      <DashboardClient
        user={user}
        trips={[]}
        stats={{
          activeTrips: 0,
          upcomingTrips: 0,
          totalTrips: 0,
          totalParticipants: 0,
          totalSpent: 0,
          displayName: formatUserDisplayName(user),
        }}
      />
    );
  }

  const [{ data: tripsData }, { data: participantRows }, { data: expenseRows }] = await Promise.all([
    supabase
      .from("Trips")
      .select("trip_id, title, start_date, end_date, budget_limit")
      .in("trip_id", tripIds),
    supabase
      .from("Trip_participants")
      .select("trip_id")
      .in("trip_id", tripIds),
    supabase
      .from("Expenses")
      .select("trip_id, amount")
      .in("trip_id", tripIds),
  ]);

  const participantCountByTrip = new Map<string, number>();
  (participantRows ?? []).forEach((row) => {
    participantCountByTrip.set(row.trip_id, (participantCountByTrip.get(row.trip_id) ?? 0) + 1);
  });

  const expenseTotalByTrip = new Map<string, number>();
  (expenseRows ?? []).forEach((row) => {
    expenseTotalByTrip.set(row.trip_id, (expenseTotalByTrip.get(row.trip_id) ?? 0) + Number(row.amount ?? 0));
  });

  const trips: TripCard[] = (tripsData ?? [])
    .map((trip) => {
      const total = Number(trip.budget_limit ?? 0);
      const spent = expenseTotalByTrip.get(trip.trip_id) ?? 0;
      const participants = participantCountByTrip.get(trip.trip_id) ?? 0;

      return {
        id: trip.trip_id,
        name: trip.title,
        status: getTripStatus(trip.start_date ?? null, trip.end_date ?? null),
        budget: total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0,
        spent: formatCurrency(spent),
        total: total > 0 ? formatCurrency(total) : "Brak limitu",
        participants,
        dates: formatTripDates(trip.start_date ?? null, trip.end_date ?? null),
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, "pl"));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeTrips = (tripsData ?? []).filter((trip) => {
    const start = trip.start_date ? new Date(trip.start_date) : null;
    const end = trip.end_date ? new Date(trip.end_date) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(0, 0, 0, 0);

    return Boolean(start && end && start <= today && end >= today);
  }).length;

  const upcomingTrips = (tripsData ?? []).filter((trip) => {
    if (!trip.start_date) return false;
    const start = new Date(trip.start_date);
    start.setHours(0, 0, 0, 0);
    return start > today;
  }).length;

  const totalParticipants = participantCountByTrip.size > 0
    ? Array.from(participantCountByTrip.values()).reduce((sum, count) => sum + count, 0)
    : 0;

  const totalSpent = expenseTotalByTrip.size > 0
    ? Array.from(expenseTotalByTrip.values()).reduce((sum, amount) => sum + amount, 0)
    : 0;

  return (
    <DashboardClient
      user={user}
      trips={trips}
      stats={{
        activeTrips,
        upcomingTrips,
        totalTrips: trips.length,
        totalParticipants,
        totalSpent,
        displayName: formatUserDisplayName(user),
      }}
    />
  );
}