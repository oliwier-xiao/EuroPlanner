import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { configErrorMessage, isDev } from "@/lib/env";
import { buildTripSlug } from "@/lib/slug";
// main_currency wyłączone do czasu dodania kolumny w bazie

export const dynamic = "force-dynamic";

type TripRow = {
  trip_id: string;
  slug: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  budget_limit: number | string | null;
};

function responseSupabaseError(message: string, err: any) {
  if (!isDev()) {
    return NextResponse.json({ success: false, message }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: false,
      message,
      supabase: {
        message: err?.message ?? null,
        code: err?.code ?? null,
        details: err?.details ?? null,
        hint: err?.hint ?? null,
      },
    },
    { status: 500 }
  );
}

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

function formatDateRange(startDate: string | null, endDate: string | null) {
  const formatter = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (!startDate && !endDate) return "Brak dat";

  const start = startDate ? formatter.format(new Date(startDate)) : "?";
  const end = endDate ? formatter.format(new Date(endDate)) : "?";
  return `${start} - ${end}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;

  if (!userId) {
    return null;
  }

  return getCurrentUser(userId);
}

export async function GET() {
  let supabaseServer;
  try {
    supabaseServer = getSupabaseServer();
  } catch (err) {
    return NextResponse.json({ success: false, message: configErrorMessage(err) }, { status: 500 });
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ success: false, message: "Brak autoryzacji" }, { status: 401 });
  }

  const { data: memberships, error: membershipError } = await supabaseServer
    .from("Trip_participants")
    .select("trip_id")
    .eq("user_id", user.user_id);

  if (membershipError) {
    console.error("[api/trips] membershipError:", membershipError);
    return responseSupabaseError("Nie udało się pobrać podróży (uczestnictwo)", membershipError);
  }

  const tripIds = (memberships ?? []).map((row) => row.trip_id).filter(Boolean);

  if (tripIds.length === 0) {
    return NextResponse.json({ success: true, trips: [] });
  }

  const [{ data: tripsData, error: tripsError }, { data: participantRows }, { data: expenseRows }] = await Promise.all([
    supabaseServer
      .from("Trips")
      .select("trip_id, slug, title, description, start_date, end_date, budget_limit")
      .in("trip_id", tripIds),
    supabaseServer
      .from("Trip_participants")
      .select("trip_id")
      .in("trip_id", tripIds),
    supabaseServer
      .from("Expenses")
      .select("trip_id, amount")
      .in("trip_id", tripIds),
  ]);

  if (tripsError) {
    console.error("[api/trips] tripsError:", tripsError);
    return responseSupabaseError("Nie udało się pobrać podróży (lista)", tripsError);
  }

  const participantCountByTrip = new Map<string, number>();
  (participantRows ?? []).forEach((row) => {
    participantCountByTrip.set(row.trip_id, (participantCountByTrip.get(row.trip_id) ?? 0) + 1);
  });

  const expenseTotalByTrip = new Map<string, number>();
  (expenseRows ?? []).forEach((row) => {
    expenseTotalByTrip.set(row.trip_id, (expenseTotalByTrip.get(row.trip_id) ?? 0) + Number(row.amount ?? 0));
  });

  const trips = (tripsData ?? [])
    .map((trip: TripRow) => {
      const budgetLimit = Number(trip.budget_limit ?? 0);
      const spent = expenseTotalByTrip.get(trip.trip_id) ?? 0;

      return {
        id: trip.slug,
        name: trip.title,
        description: trip.description,
        status: formatStatus(trip.start_date ?? null, trip.end_date ?? null),
        dates: formatDateRange(trip.start_date ?? null, trip.end_date ?? null),
        participants: participantCountByTrip.get(trip.trip_id) ?? 0,
        budget: budgetLimit > 0 ? Math.min(100, Math.round((spent / budgetLimit) * 100)) : 0,
        spentValueEur: spent,
        totalValueEur: budgetLimit > 0 ? budgetLimit : null,
        spent: formatCurrency(spent),
        total: budgetLimit > 0 ? formatCurrency(budgetLimit) : "Brak limitu",
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, "pl"));

  return NextResponse.json({ success: true, trips });
}

export async function POST(request: NextRequest) {
  let supabaseServer;
  try {
    supabaseServer = getSupabaseServer();
  } catch (err) {
    return NextResponse.json({ success: false, message: configErrorMessage(err) }, { status: 500 });
  }

  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ success: false, message: "Brak autoryzacji" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Nieprawidłowe dane formularza" }, { status: 400 });
  }

  const {
    title,
    description = null,
    start_date = null,
    end_date = null,
    budget_limit = null,
  } = (body ?? {}) as {
    title?: string;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    budget_limit?: string | number | null;
  };

  if (!title || !title.trim()) {
    return NextResponse.json({ success: false, message: "Nazwa podróży jest wymagana" }, { status: 400 });
  }

  if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
    return NextResponse.json({ success: false, message: "Data początkowa nie może być późniejsza niż końcowa" }, { status: 400 });
  }

  const parsedBudget = budget_limit === null || budget_limit === ""
    ? null
    : Number(budget_limit);

  if (parsedBudget !== null && Number.isNaN(parsedBudget)) {
    return NextResponse.json({ success: false, message: "Budżet musi być liczbą" }, { status: 400 });
  }

  const tripId = crypto.randomUUID();
  const slug = buildTripSlug(title);

  const createPayload: Record<string, any> = {
    trip_id: tripId,
    slug,
    title: title.trim(),
    description: description?.trim() || null,
    start_date: start_date || null,
    end_date: end_date || null,
    budget_limit: parsedBudget,
  };

  const createError = (await supabaseServer.from("Trips").insert(createPayload)).error;

  if (createError) {
    console.error("Błąd tworzenia podróży:", createError);
    return NextResponse.json(
      {
        success: false,
        message: createError?.message || "Nie udało się utworzyć podróży",
        details: createError?.details ?? null,
        hint: createError?.hint ?? null,
        code: createError?.code ?? null,
      },
      { status: 500 }
    );
  }

  const { error: participantError } = await supabaseServer
    .from("Trip_participants")
    .insert({
      trip_id: tripId,
      user_id: user.user_id,
      role: "owner",
    });

  if (participantError) {
    console.error("Błąd przypisywania właściciela podróży:", participantError);
    return NextResponse.json(
      {
        success: false,
        message: participantError.message || "Utworzono podróż, ale nie przypisano właściciela",
        details: participantError.details ?? null,
        hint: participantError.hint ?? null,
        code: participantError.code ?? null,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    trip: {
      id: slug,
      name: title.trim(),
      description: description?.trim() || null,
      status: formatStatus(start_date || null, end_date || null),
      dates: formatDateRange(start_date || null, end_date || null),
      participants: 1,
      budget: 0,
      spentValueEur: 0,
      totalValueEur: parsedBudget ?? null,
      spent: formatCurrency(0),
      total: parsedBudget !== null ? formatCurrency(parsedBudget) : "Brak limitu",
    },
  });
}