import { NextRequest, NextResponse } from "next/server";
import {
  FALLBACK_EUR_RATES,
  isSupportedCurrency,
  SUPPORTED_CURRENCIES,
  type SupportedCurrency,
} from "@/lib/currency";

export const dynamic = "force-dynamic";

function convertRatesFromEurToBase(
  eurRates: Record<string, number>,
  base: SupportedCurrency
): Record<string, number> {
  if (base === "EUR") return eurRates;

  const baseRate = eurRates[base];
  if (!baseRate) return eurRates;

  const converted: Record<string, number> = {};
  for (const currency of Object.keys(eurRates)) {
    converted[currency] = eurRates[currency] / baseRate;
  }
  converted[base] = 1;
  return converted;
}

async function fetchEurRates(): Promise<{ rates: Record<string, number>; source: "api" | "fallback" }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);

    const response = await fetch("https://api.frankfurter.app/latest?from=EUR", {
      signal: controller.signal,
      next: { revalidate: 60 * 30 },
    });
    clearTimeout(timer);

    if (!response.ok) {
      throw new Error("Nie udało się pobrać kursów z zewnętrznego API.");
    }

    const payload = (await response.json()) as {
      rates?: Record<string, number>;
    };
    const rates = payload?.rates ?? {};

    const merged: Record<string, number> = { ...FALLBACK_EUR_RATES };
    merged.EUR = 1;

    for (const code of Object.keys(rates)) {
      if (isSupportedCurrency(code) && typeof rates[code] === "number" && rates[code] > 0) {
        merged[code] = rates[code];
      }
    }

    return { rates: merged, source: "api" };
  } catch {
    return { rates: { ...FALLBACK_EUR_RATES }, source: "fallback" };
  }
}

export async function GET(request: NextRequest) {
  const baseParam = request.nextUrl.searchParams.get("base") ?? "EUR";
  const base = isSupportedCurrency(baseParam) ? baseParam : "EUR";
  const { rates: eurRates, source } = await fetchEurRates();
  const ratesForBase = convertRatesFromEurToBase(eurRates, base);

  return NextResponse.json({
    success: true,
    base,
    source,
    updatedAt: new Date().toISOString(),
    rates: SUPPORTED_CURRENCIES.reduce<Record<string, number>>((acc, code) => {
      acc[code] = ratesForBase[code] ?? 1;
      return acc;
    }, {}),
  });
}
