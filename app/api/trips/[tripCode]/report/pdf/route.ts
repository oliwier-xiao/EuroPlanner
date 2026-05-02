import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "node:fs/promises";
import path from "node:path";
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
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

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);

  const regularFontBytes = await readFile(
    path.join(process.cwd(), "node_modules", "dejavu-fonts-ttf", "ttf", "DejaVuSans.ttf")
  );
  const boldFontBytes = await readFile(
    path.join(process.cwd(), "node_modules", "dejavu-fonts-ttf", "ttf", "DejaVuSans-Bold.ttf")
  );

  const font = await pdf.embedFont(regularFontBytes, { subset: true });
  const fontBold = await pdf.embedFont(boldFontBytes, { subset: true });

  const margin = 48;
  const lineH = 14;

  let page = pdf.addPage();
  let { height } = page.getSize();
  let y = height - margin;

  const drawLine = (
    text: string,
    opts?: { bold?: boolean; size?: number; color?: { r: number; g: number; b: number } }
  ) => {
    const size = opts?.size ?? 11;
    const useFont = opts?.bold ? fontBold : font;
    const color = opts?.color ? rgb(opts.color.r, opts.color.g, opts.color.b) : rgb(0.06, 0.07, 0.08);

    if (y < margin + lineH) {
      page = pdf.addPage();
      ({ height } = page.getSize());
      y = height - margin;
    }

    page.drawText(text, { x: margin, y, size, font: useFont, color });
    y -= Math.max(lineH, size + 4);
  };

  const drawSpacer = (h = 8) => {
    y -= h;
  };

  // Header
  drawLine("EuroPlanner — Raport", { bold: true, size: 18, color: { r: 0.04, g: 0.14, b: 0.32 } });
  drawLine(trip.title, { bold: true, size: 20 });
  drawLine(`Okres: ${trip.start_date ?? "?"} — ${trip.end_date ?? "?"}`);
  drawLine(`Slug: ${trip.slug}`);
  drawSpacer(10);

  // Totals
  drawLine("Podsumowanie", { bold: true, size: 14 });
  drawLine(`Suma wydatków: ${formatCurrency(totalSpent)} EUR`);
  drawLine(`Uczestnicy: ${participantCount}`);
  drawLine(`Koszt / osoba: ${formatCurrency(costPerPerson)} EUR`);
  if (budgetLimit > 0) {
    drawLine(`Limit budżetu: ${formatCurrency(budgetLimit)} EUR`);
    drawLine(`Wykorzystanie budżetu: ${((totalSpent / budgetLimit) * 100).toFixed(2)}%`);
  } else {
    drawLine("Limit budżetu: brak");
  }
  drawSpacer(10);

  // Categories
  drawLine("Wydatki wg kategorii", { bold: true, size: 14 });
  Array.from(totalsByCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .forEach(([name, amount]) => {
      const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
      drawLine(`- ${name}: ${formatCurrency(amount)} EUR (${pct.toFixed(1)}%)`);
    });
  drawSpacer(10);

  // Users
  drawLine("Zaległości / długi (per użytkownik)", { bold: true, size: 14 });
  userSummary.slice(0, 40).forEach((u) => {
    drawLine(`${u.name}`);
    drawLine(`  Zapłacone: ${formatCurrency(u.paid)} EUR | Udział: ${formatCurrency(u.owed)} EUR`);
    drawLine(`  Do oddania: ${formatCurrency(u.toPay)} EUR | Do otrzymania: ${formatCurrency(u.toReceive)} EUR`);
    drawSpacer(2);
  });

  const bytes = await pdf.save();
  const filename = `europlanner-raport-${safeFilenamePart(trip.title)}-${trip.slug}.pdf`;

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

