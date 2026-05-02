import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { getCurrentUser, formatUserDisplayName } from "@/lib/auth/getCurrentUser";
import { configErrorMessage } from "@/lib/env";
import { findTripBySlug } from "@/lib/trips";

export const dynamic = "force-dynamic";

type ParticipantRow = { user_id: string };
type CategoryRow = { category_id: string; name: string };
type ExpenseRow = { amount: number | string | null; category_id: string | null; paid_by: string | null };
type UserRow = { user_id: string; name: string | null; surname: string | null; avatar_id: string | null };

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;
  if (!userId) return null;
  return getCurrentUser(userId);
}

function toNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ tripCode: string }> }
) {
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

  const { tripCode } = await context.params;
  const trip = await findTripBySlug(tripCode);
  if (!trip) {
    return NextResponse.json({ success: false, message: "Nie znaleziono podróży" }, { status: 404 });
  }

  const { data: membership } = await supabaseServer
    .from("Trip_participants")
    .select("trip_id")
    .eq("trip_id", trip.trip_id)
    .eq("user_id", user.user_id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ success: false, message: "Brak dostępu do podróży" }, { status: 403 });
  }

  const [{ data: participantRows, error: participantsError }, { data: categories, error: categoriesError }, expensesRes] =
    await Promise.all([
      supabaseServer.from("Trip_participants").select("user_id").eq("trip_id", trip.trip_id),
      supabaseServer.from("Expense_categories").select("category_id, name"),
      supabaseServer
        .from("Expenses")
        .select("amount, category_id, paid_by")
        .eq("trip_id", trip.trip_id),
    ]);

  if (participantsError) {
    return NextResponse.json({ success: false, message: "Nie udało się pobrać uczestników" }, { status: 500 });
  }
  if (categoriesError) {
    return NextResponse.json({ success: false, message: "Nie udało się pobrać kategorii" }, { status: 500 });
  }
  if (expensesRes.error) {
    return NextResponse.json({ success: false, message: "Nie udało się pobrać wydatków" }, { status: 500 });
  }

  const participants = (participantRows ?? []) as ParticipantRow[];
  const expenses = (expensesRes.data ?? []) as ExpenseRow[];
  const categoryNameById = new Map<string, string>();
  (categories ?? []).forEach((row: CategoryRow) => categoryNameById.set(row.category_id, row.name));

  const totalSpent = expenses.reduce((sum, row) => sum + toNumber(row.amount), 0);
  const participantCount = participants.length;
  const costPerPerson = participantCount > 0 ? totalSpent / participantCount : 0;

  const totalsByCategory = new Map<string, number>();
  expenses.forEach((row) => {
    const amount = toNumber(row.amount);
    const categoryId = row.category_id;
    const name = categoryId ? (categoryNameById.get(categoryId) ?? "Inne") : "Inne";
    totalsByCategory.set(name, (totalsByCategory.get(name) ?? 0) + amount);
  });

  const categoriesSummary = Array.from(totalsByCategory.entries())
    .map(([name, amount]) => ({
      name,
      amount,
      percent: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const ids = participants.map((p) => p.user_id).filter(Boolean);
  const { data: userRows } = ids.length
    ? await supabaseServer.from("Users").select("user_id, name, surname, avatar_id").in("user_id", ids)
    : { data: [] as any[] };

  const displayNameById = new Map<string, string>();
  const avatarIdByUserId = new Map<string, string | null>();
  (userRows ?? []).forEach((u: UserRow) => {
    displayNameById.set(u.user_id, formatUserDisplayName(u));
    avatarIdByUserId.set(u.user_id, u.avatar_id ?? null);
  });

  const paidByUser = new Map<string, number>();
  expenses.forEach((row) => {
    if (!row.paid_by) return;
    paidByUser.set(row.paid_by, (paidByUser.get(row.paid_by) ?? 0) + toNumber(row.amount));
  });

  const users = ids
    .map((id) => {
      const paid = paidByUser.get(id) ?? 0;
      const owed = costPerPerson;
      return {
        user_id: id,
        name: displayNameById.get(id) ?? "Użytkownik",
        avatar_id: avatarIdByUserId.get(id) ?? null,
        paid,
        owed,
        balance: paid - owed,
      };
    })
    .sort((a, b) => b.balance - a.balance);

  const total = trip.budget_limit ?? 0;

  return NextResponse.json({
    success: true,
    report: {
      trip: {
        slug: trip.slug,
        title: trip.title,
        start_date: trip.start_date,
        end_date: trip.end_date,
        budget_limit: trip.budget_limit,
      },
      totals: {
        total_spent: totalSpent,
        participant_count: participantCount,
        cost_per_person: costPerPerson,
        budget_used_percent: total > 0 ? Math.min(100, (totalSpent / total) * 100) : null,
      },
      categories: categoriesSummary,
      users,
      capabilities: {
        payer_mode: "paid_by" as const,
      },
    },
  });
}

