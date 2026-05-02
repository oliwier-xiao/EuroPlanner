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

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\r\n;]/.test(str)) return `"${str.replaceAll('"', '""')}"`;
  return str;
}

function toCsv(rows: string[][]): string {
  return rows.map((r) => r.map(csvEscape).join(";")).join("\r\n") + "\r\n";
}

function safeFilenamePart(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
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

  const [{ data: participantRows }, { data: categories }, expensesRes] = await Promise.all([
    supabaseServer.from("Trip_participants").select("user_id").eq("trip_id", trip.trip_id),
    supabaseServer.from("Expense_categories").select("category_id, name"),
    supabaseServer.from("Expenses").select("amount, category_id, paid_by").eq("trip_id", trip.trip_id),
  ]);

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
  const budgetLimit = trip.budget_limit ?? 0;

  const totalsByCategory = new Map<string, number>();
  expenses.forEach((row) => {
    const amount = toNumber(row.amount);
    const categoryId = row.category_id;
    const name = categoryId ? (categoryNameById.get(categoryId) ?? "Inne") : "Inne";
    totalsByCategory.set(name, (totalsByCategory.get(name) ?? 0) + amount);
  });

  const ids = participants.map((p) => p.user_id).filter(Boolean);
  const { data: userRows } = ids.length
    ? await supabaseServer.from("Users").select("user_id, name, surname").in("user_id", ids)
    : { data: [] as any[] };

  const displayNameById = new Map<string, string>();
  (userRows ?? []).forEach((u: any) => displayNameById.set(u.user_id, formatUserDisplayName(u)));

  const paidByUser = new Map<string, number>();
  expenses.forEach((row) => {
    if (!row.paid_by) return;
    paidByUser.set(row.paid_by, (paidByUser.get(row.paid_by) ?? 0) + toNumber(row.amount));
  });

  const userSummary = ids
    .map((id) => {
      const paid = paidByUser.get(id) ?? 0;
      const owed = costPerPerson;
      const toPay = Math.max(0, owed - paid);
      const toReceive = Math.max(0, paid - owed);
      return {
        name: displayNameById.get(id) ?? "Użytkownik",
        paid,
        owed,
        toPay,
        toReceive,
      };
    })
    .sort((a, b) => b.toReceive - a.toReceive || b.paid - a.paid);

  const lines: string[][] = [];
  lines.push(["EuroPlanner - Raport (CSV)"]);
  lines.push(["Podróż", trip.title]);
  lines.push(["Slug", trip.slug]);
  lines.push(["Start", trip.start_date ?? ""]);
  lines.push(["Koniec", trip.end_date ?? ""]);
  lines.push([""]);

  lines.push(["Podsumowanie"]);
  lines.push(["Suma wydatków (EUR)", totalSpent.toFixed(2)]);
  lines.push(["Liczba uczestników", String(participantCount)]);
  lines.push(["Koszt / osoba (EUR)", costPerPerson.toFixed(2)]);
  lines.push(["Limit budżetu (EUR)", budgetLimit > 0 ? budgetLimit.toFixed(2) : ""]);
  lines.push(["Wykorzystanie budżetu (%)", budgetLimit > 0 ? ((totalSpent / budgetLimit) * 100).toFixed(2) : ""]);
  lines.push([""]);

  lines.push(["Wydatki wg kategorii"]);
  lines.push(["Kategoria", "Kwota (EUR)", "Udział (%)"]);
  Array.from(totalsByCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, amount]) => {
      const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
      lines.push([name, amount.toFixed(2), pct.toFixed(2)]);
    });
  lines.push([""]);

  lines.push(["Użytkownicy"]);
  lines.push(["Użytkownik", "Zapłacone (EUR)", "Udział (EUR)", "Do oddania (EUR)", "Do otrzymania (EUR)"]);
  userSummary.forEach((u) => {
    lines.push([u.name, u.paid.toFixed(2), u.owed.toFixed(2), u.toPay.toFixed(2), u.toReceive.toFixed(2)]);
  });

  const csv = toCsv(lines);
  const filename = `europlanner-raport-${safeFilenamePart(trip.title)}-${trip.slug}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=\"${filename}\"`,
      "Cache-Control": "no-store",
    },
  });
}

