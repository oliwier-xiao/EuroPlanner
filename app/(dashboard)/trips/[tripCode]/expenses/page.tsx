"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Plus, 
  Camera, 
  Search, 
  Coffee, 
  Plane, 
  Home, 
  ShoppingBag,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  convertCurrency,
  COUNTRY_TO_CURRENCY,
  FALLBACK_EUR_RATES,
  formatMoney,
  getConversionRate,
  SUPPORTED_CURRENCIES,
  suggestCurrencyForCountry,
  type SupportedCurrency,
} from "@/lib/currency";

// Przykładowe dane wydatków
const MOCK_EXPENSES = [
  { id: "1", title: "Kolacja w Trattoria", category: "Jedzenie", icon: Coffee, amount: 85, currency: "EUR", payer: "Michał", date: "Dziś, 19:30", color: "bg-[#578bfa]" },
  { id: "2", title: "Bilety do Koloseum", category: "Atrakcje", icon: ShoppingBag, amount: 52, currency: "USD", payer: "Justyna", date: "Dziś, 14:00", color: "bg-[#aab8d5]" },
  { id: "3", title: "Taxi z lotniska", category: "Transport", icon: Plane, amount: 880, currency: "CZK", payer: "Michał", date: "Wczoraj, 09:15", color: "bg-[#3E67BF]" },
  { id: "4", title: "Airbnb (3 noce)", category: "Nocleg", icon: Home, amount: 450, currency: "EUR", payer: "Oliwier", date: "10.05.2026", color: "bg-[#0a2351]" },
  { id: "5", title: "Kawa i rogaliki", category: "Jedzenie", icon: Coffee, amount: 60, currency: "PLN", payer: "Wiktoria", date: "10.05.2026", color: "bg-[#578bfa]" },
];

const TRIP_COUNTRIES = Object.keys(COUNTRY_TO_CURRENCY);

const MOCK_TRIP_TOTALS = [
  { id: "t1", name: "Majowka w Rzymie", amount: 1840, currency: "EUR" as SupportedCurrency },
  { id: "t2", name: "Praga weekend", amount: 12800, currency: "CZK" as SupportedCurrency },
  { id: "t3", name: "Roadtrip Polska", amount: 3920, currency: "PLN" as SupportedCurrency },
];

type ExchangeRatesPayload = {
  base: SupportedCurrency;
  source: "api" | "fallback";
  rates: Record<string, number>;
  updatedAt: string | null;
};

export default function ExpensesPage() {
  const router = useRouter();
  const params = useParams();
  const tripCode = typeof params.tripCode === "string" ? params.tripCode : "";
  const [activeTab, setActiveTab] = useState("Wszystkie");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Wlochy");
  const [selectedCurrency, setSelectedCurrency] = useState<SupportedCurrency>("EUR");
  const [ratesMeta, setRatesMeta] = useState<ExchangeRatesPayload>({
    base: "EUR",
    source: "fallback",
    rates: { ...FALLBACK_EUR_RATES },
    updatedAt: null,
  });
  const [isRatesLoading, setIsRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);

  const tabs = ["Wszystkie", "Moje wydatki", "Do zwrotu"];
  const suggestedCurrency = suggestCurrencyForCountry(selectedCountry);

  const loadRates = async () => {
    setIsRatesLoading(true);
    setRatesError(null);

    try {
      const response = await fetch("/api/exchange-rates?base=EUR", { credentials: "include" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Nie udało się pobrać kursów walut.");
      }

      setRatesMeta({
        base: payload.base ?? "EUR",
        source: payload.source ?? "fallback",
        rates: payload.rates ?? { ...FALLBACK_EUR_RATES },
        updatedAt: payload.updatedAt ?? null,
      });
    } catch {
      setRatesError("Nie udało się pobrać aktualnych kursów, użyto bezpiecznego fallbacku.");
      setRatesMeta((current) => ({
        ...current,
        source: "fallback",
        rates: current.rates ?? { ...FALLBACK_EUR_RATES },
      }));
    } finally {
      setIsRatesLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleExpenses = useMemo(() => {
    return MOCK_EXPENSES.filter((expense) => {
      const joined = `${expense.title} ${expense.category} ${expense.payer}`.toLowerCase();
      return joined.includes(normalizedSearch);
    });
  }, [normalizedSearch]);

  const convertedExpenses = useMemo(() => {
    return visibleExpenses.map((expense) => {
      const sourceCurrency = expense.currency as SupportedCurrency;
      const convertedAmount = convertCurrency(expense.amount, sourceCurrency, selectedCurrency, ratesMeta.rates);
      const conversionRate = getConversionRate(sourceCurrency, selectedCurrency, ratesMeta.rates);

      return {
        ...expense,
        sourceCurrency,
        convertedAmount,
        conversionRate,
      };
    });
  }, [visibleExpenses, selectedCurrency, ratesMeta.rates]);

  const comparisonRows = useMemo(() => {
    return MOCK_TRIP_TOTALS.map((trip) => {
      const converted = convertCurrency(trip.amount, trip.currency, selectedCurrency, ratesMeta.rates);
      return { ...trip, converted };
    }).sort((a, b) => b.converted - a.converted);
  }, [selectedCurrency, ratesMeta.rates]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* NAGŁÓWEK I PRZYCISKI AKCJI */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#ffffff] p-8 rounded-[40px] border border-[#5b616e]/10 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-[#0a0b0d] tracking-tight mb-2">Wydatki grupy</h2>
          <p className="text-[#5b616e]">Zarządzaj kosztami i skanuj paragony.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              if (!tripCode) return;
              router.push(`/trips/${tripCode}/scan`);
            }}
            className="px-6 py-4 bg-[#f8f9fa] hover:bg-[#eef0f3] text-[#0a2351] font-bold rounded-[56px] transition-colors flex items-center justify-center gap-2 group border border-transparent hover:border-[#0a2351]/10"
          >
            <Camera size={20} className="group-hover:scale-110 transition-transform" />
            Skanuj paragon
          </button>
          <button className="px-6 py-4 bg-[#0a2351] hover:bg-[#578bfa] text-white font-bold rounded-[56px] transition-colors flex items-center justify-center gap-2">
            <Plus size={20} />
            Dodaj wydatek
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#ffffff] p-5 rounded-[32px] border border-[#5b616e]/10 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#5b616e] mb-2">Wybrany kraj trasy</p>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCountry}
              onChange={(event) => setSelectedCountry(event.target.value)}
              className="flex-1 bg-[#f8f9fa] border border-[#5b616e]/20 rounded-full px-4 py-2.5 text-sm text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors"
            >
              {TRIP_COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setSelectedCurrency(suggestedCurrency)}
              className="px-4 py-2.5 rounded-full bg-[#eef0f3] hover:bg-[#dfe4ec] text-[#0a2351] text-sm font-bold transition-colors"
            >
              Sugestia: {suggestedCurrency}
            </button>
          </div>
          <p className="mt-3 text-xs text-[#5b616e]">Aplikacja sugeruje walutę na podstawie kraju wybranego na trasie.</p>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-[32px] border border-[#5b616e]/10 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#5b616e] mb-2">Waluta prezentacji kosztów</p>
          <select
            value={selectedCurrency}
            onChange={(event) => setSelectedCurrency(event.target.value as SupportedCurrency)}
            className="w-full bg-[#f8f9fa] border border-[#5b616e]/20 rounded-full px-4 py-2.5 text-sm text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors"
          >
            {SUPPORTED_CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <p className="mt-3 text-xs text-[#5b616e]">Wszystkie wydatki i porównania są przeliczane do tej waluty.</p>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-[32px] border border-[#5b616e]/10 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5b616e] mb-1">Kursy walut</p>
              <p className="text-sm font-semibold text-[#0a0b0d]">
                Zrodlo: {ratesMeta.source === "api" ? "API EBC/Frankfurter" : "fallback lokalny"}
              </p>
            </div>
            <button
              type="button"
              onClick={loadRates}
              className="p-2.5 rounded-full bg-[#f8f9fa] hover:bg-[#eef0f3] text-[#0a2351] transition-colors"
              aria-label="Odśwież kursy"
            >
              <RefreshCw size={16} className={isRatesLoading ? "animate-spin" : ""} />
            </button>
          </div>
          <p className="mt-3 text-xs text-[#5b616e]">
            Aktualizacja: {ratesMeta.updatedAt ? new Date(ratesMeta.updatedAt).toLocaleString("pl-PL") : "brak danych"}
          </p>
          {ratesError && <p className="mt-2 text-xs text-red-600 font-medium">{ratesError}</p>}
        </div>
      </div>

      {/* PASEK NARZĘDZI: ZAKŁADKI, WYSZUKIWARKA, FILTRY */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Zakładki (Tabs) */}
        <div className="flex bg-[#ffffff] p-1.5 rounded-[56px] border border-[#5b616e]/10 shadow-sm overflow-x-auto w-full lg:w-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-[56px] text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? "bg-[#0a2351] text-white shadow-md" 
                  : "text-[#5b616e] hover:text-[#0a2351] hover:bg-[#f8f9fa]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Wyszukiwarka i Filtry */}
        <div className="flex w-full lg:w-auto gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5b616e]" size={18} />
            <input
              type="text"
              placeholder="Szukaj wydatku..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#ffffff] border border-[#5b616e]/10 rounded-[56px] pl-11 pr-4 py-3 text-sm text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors shadow-sm"
            />
          </div>
          <button className="p-3 bg-[#ffffff] border border-[#5b616e]/10 rounded-full text-[#5b616e] hover:text-[#0a2351] hover:bg-[#f8f9fa] transition-colors shadow-sm shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* LISTA WYDATKÓW */}
      <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm overflow-hidden">
        
        {/* Nagłówki kolumn (ukryte na małych ekranach) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-[#f8f9fa] border-b border-[#5b616e]/10 text-xs font-bold uppercase tracking-wider text-[#5b616e]">
          <div className="col-span-5">Wydatek</div>
          <div className="col-span-3">Kto zapłacił</div>
          <div className="col-span-2">Data</div>
          <div className="col-span-2 text-right">Kwota</div>
        </div>

        {/* Elementy listy */}
        <div className="divide-y divide-[#5b616e]/10">
          {convertedExpenses.map((expense) => (
            <div 
              key={expense.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-5 items-center hover:bg-[#f8f9fa] transition-colors cursor-pointer group"
            >
              {/* Ikona i Tytuł */}
              <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                <div className={`p-3 rounded-2xl text-white ${expense.color} group-hover:scale-110 transition-transform`}>
                  <expense.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a0b0d] text-base group-hover:text-[#3E67BF] transition-colors">{expense.title}</h4>
                  <span className="text-xs text-[#5b616e] font-medium">{expense.category}</span>
                </div>
              </div>

              {/* Kto zapłacił */}
              <div className="hidden md:flex col-span-3 items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#eef0f3] border border-[#5b616e]/20 flex items-center justify-center text-[10px] font-bold text-[#0a2351]">
                  {expense.payer.charAt(0)}
                </div>
                <span className="text-sm font-medium text-[#0a0b0d]">{expense.payer}</span>
              </div>

              {/* Data */}
              <div className="hidden md:block col-span-2 text-sm text-[#5b616e]">
                {expense.date}
              </div>

              {/* Kwota (Zawsze widoczna) */}
              <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center">
                <div className="md:hidden flex items-center gap-2">
                  <span className="text-xs text-[#5b616e]">Zapłacił: {expense.payer}</span>
                </div>
                <span className="text-lg font-bold text-[#0a0b0d] tracking-tight">
                  {formatMoney(expense.convertedAmount, selectedCurrency)}
                </span>
              </div>

              <div className="col-span-1 md:col-span-12 md:pl-16">
                <p className="text-xs text-[#5b616e]">
                  Oryginalnie: {formatMoney(expense.amount, expense.sourceCurrency)} | Kurs: 1 {expense.sourceCurrency} = {expense.conversionRate.toFixed(4)} {selectedCurrency}
                </p>
              </div>
            </div>
          ))}

          {convertedExpenses.length === 0 && (
            <div className="px-8 py-10 text-center text-[#5b616e]">
              Brak wydatkow pasujacych do filtra wyszukiwania.
            </div>
          )}
        </div>

      </div>

      <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-8">
        <h3 className="text-xl font-bold text-[#0a0b0d] tracking-tight mb-2">
          Porownanie wydatkow z kilku podrozy
        </h3>
        <p className="text-sm text-[#5b616e] mb-6">
          Wszystkie podsumowania sa przeliczane do waluty: <span className="font-bold text-[#0a2351]">{selectedCurrency}</span>
        </p>

        <div className="space-y-4">
          {comparisonRows.map((trip) => (
            <div key={trip.id} className="flex items-center justify-between gap-4 bg-[#f8f9fa] rounded-[24px] px-5 py-4 border border-[#5b616e]/10">
              <div>
                <p className="font-bold text-[#0a0b0d]">{trip.name}</p>
                <p className="text-xs text-[#5b616e]">
                  Oryginalnie: {formatMoney(trip.amount, trip.currency)}
                </p>
              </div>
              <p className="text-lg font-bold text-[#0a0b0d]">{formatMoney(trip.converted, selectedCurrency)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}