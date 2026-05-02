export const SUPPORTED_CURRENCIES = [
  "EUR",
  "PLN",
  "USD",
  "CZK",
  "HUF",
  "RON",
  "GBP",
  "CHF",
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const COUNTRY_TO_CURRENCY: Record<string, SupportedCurrency> = {
  Polska: "PLN",
  Niemcy: "EUR",
  Francja: "EUR",
  Wlochy: "EUR",
  Hiszpania: "EUR",
  Czechy: "CZK",
  Wegry: "HUF",
  Rumunia: "RON",
  Wielka_Brytania: "GBP",
  Szwajcaria: "CHF",
  USA: "USD",
};

// Kursy bazowe: ile danej waluty za 1 EUR.
export const FALLBACK_EUR_RATES: Record<SupportedCurrency, number> = {
  EUR: 1,
  PLN: 4.32,
  USD: 1.08,
  CZK: 24.75,
  HUF: 393.2,
  RON: 4.97,
  GBP: 0.85,
  CHF: 0.96,
};

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(value as SupportedCurrency);
}

export function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  eurRates: Record<string, number>
): number {
  if (from === to) return amount;

  const fromRate = from === "EUR" ? 1 : eurRates[from];
  const toRate = to === "EUR" ? 1 : eurRates[to];

  if (!fromRate || !toRate) {
    return amount;
  }

  const amountInEur = from === "EUR" ? amount : amount / fromRate;
  return to === "EUR" ? amountInEur : amountInEur * toRate;
}

export function getConversionRate(
  from: SupportedCurrency,
  to: SupportedCurrency,
  eurRates: Record<string, number>
): number {
  if (from === to) return 1;

  const oneUnit = convertCurrency(1, from, to, eurRates);
  if (!Number.isFinite(oneUnit) || oneUnit <= 0) {
    return 1;
  }

  return oneUnit;
}

export function formatMoney(value: number, currency: SupportedCurrency): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function suggestCurrencyForCountry(country: string): SupportedCurrency {
  return COUNTRY_TO_CURRENCY[country] ?? "EUR";
}
