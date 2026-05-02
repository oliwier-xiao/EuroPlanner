"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  PieChart, 
  Users, 
  Calendar,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { getAvatarById } from "@/lib/avatars";

type CategorySummary = {
  name: string;
  amount: number;
  percent: number;
};

type UserSummary = {
  user_id: string;
  name: string;
  avatar_id: string | null;
  paid: number;
  owed: number;
  balance: number;
};

type ReportResponse = {
  success: boolean;
  report?: {
    trip: {
      slug: string;
      title: string;
      start_date: string | null;
      end_date: string | null;
      budget_limit: number | null;
    };
    totals: {
      total_spent: number;
      participant_count: number;
      cost_per_person: number;
      budget_used_percent: number | null;
    };
    categories: CategorySummary[];
    users: UserSummary[];
    capabilities: {
      payer_mode: "paid_by";
    };
  };
  message?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
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

function DonutChart({ categories }: { categories: CategorySummary[] }) {
  const size = 140;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const palette = ["#0a2351", "#3E67BF", "#578bfa", "#aab8d5", "#111827", "#9CA3AF"];
  const safe = categories.filter((c) => c.amount > 0 && c.percent > 0);

  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="transparent" stroke="#eef0f3" strokeWidth={stroke} />
      {safe.map((cat, idx) => {
        const pct = Math.max(0, Math.min(100, cat.percent));
        const dash = (pct / 100) * c;
        const node = (
          <circle
            key={cat.name}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="transparent"
            stroke={palette[idx % palette.length]}
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += dash;
        return node;
      })}
    </svg>
  );
}

export default function ReportPage() {
  const [data, setData] = useState<ReportResponse["report"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripCode, setTripCode] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);

      const code = window.location.pathname.split("/").filter(Boolean).at(-2);
      setTripCode(code ?? null);
      if (!code) {
        setError("Brak identyfikatora podróży w adresie");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/trips/${encodeURIComponent(code)}/report`, { cache: "no-store" });
        const json = (await res.json()) as ReportResponse;
        if (cancelled) return;
        if (!res.ok || !json.success || !json.report) {
          setError(json.message || "Nie udało się pobrać raportu");
          setData(null);
        } else {
          setData(json.report);
        }
      } catch {
        if (!cancelled) setError("Błąd połączenia z serwerem");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = data?.categories ?? [];
  const users = data?.users ?? [];
  const totalSpent = data?.totals.total_spent ?? 0;
  const participantCount = data?.totals.participant_count ?? 0;
  const costPerPerson = data?.totals.cost_per_person ?? 0;
  const budgetLimit = data?.trip.budget_limit ?? null;

  const topCategories = useMemo(() => categories.slice(0, 6), [categories]);
  const mostExpensive = useMemo(() => {
    if (categories.length === 0) return null;
    return Math.max(...categories.map((c) => c.amount));
  }, [categories]);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-[#ffffff] p-8 rounded-[40px] border border-[#5b616e]/10 shadow-sm">
          <div className="h-8 w-64 bg-[#eef0f3] rounded-2xl mb-4" />
          <div className="h-5 w-96 bg-[#f8f9fa] rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm">
              <div className="h-10 w-10 bg-[#eef0f3] rounded-2xl mb-6" />
              <div className="h-4 w-32 bg-[#f8f9fa] rounded-2xl mb-3" />
              <div className="h-10 w-40 bg-[#eef0f3] rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#ffffff] p-8 rounded-[40px] border border-[#5b616e]/10 shadow-sm">
        <h2 className="text-2xl font-bold text-[#0a0b0d] tracking-tight mb-2">Nie udało się załadować raportu</h2>
        <p className="text-[#5b616e]">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* NAGŁÓWEK I PRZYCISKI EKSPORTU */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#ffffff] p-8 md:p-12 rounded-[40px] border border-[#5b616e]/10 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-[#f8f9fa] z-0">
          <FileText size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#eef0f3] text-[#0a2351] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <CheckCircle2 size={16} />
            Raport
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a0b0d] tracking-tighter mb-4">
            {data?.trip.title ?? "Raport końcowy"}
          </h2>
          <p className="text-[#5b616e] text-lg max-w-md">
            Kompletne podsumowanie kosztów, rozliczeń i statystyk z Twojej podróży.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
          <button
            disabled={!tripCode}
            onClick={() => {
              if (!tripCode) return;
              window.location.href = `/api/trips/${encodeURIComponent(tripCode)}/report/csv`;
            }}
            className="px-8 py-4 bg-[#f8f9fa] hover:bg-[#eef0f3] text-[#0a2351] font-bold rounded-[56px] transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-[#0a2351]/10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={20} />
            Eksportuj CSV
          </button>
          <button
            disabled={!tripCode}
            onClick={() => {
              if (!tripCode) return;
              window.location.href = `/api/trips/${encodeURIComponent(tripCode)}/report/pdf`;
            }}
            className="px-8 py-4 bg-[#0a2351] hover:bg-[#578bfa] text-white font-bold rounded-[56px] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0a2351]/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            Pobierz PDF
          </button>
        </div>
      </div>

      {/* KLUCZOWE STATYSTYKI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm flex flex-col justify-between">
          <div className="p-3 bg-[#f8f9fa] text-[#0a2351] rounded-2xl w-max mb-6">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Całkowity koszt</h3>
            <div className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">
              {formatCurrency(totalSpent)} <span className="text-xl text-[#5b616e]">EUR</span>
            </div>
            <p className="text-sm font-medium text-[#5b616e] mt-2">
              {budgetLimit ? `Z zaplanowanych ${formatCurrency(budgetLimit)} EUR` : "Brak limitu budżetu"}
            </p>
          </div>
        </div>

        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm flex flex-col justify-between">
          <div className="p-3 bg-[#f8f9fa] text-[#0a2351] rounded-2xl w-max mb-6">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Koszt na osobę</h3>
            <div className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">
              {formatCurrency(costPerPerson)} <span className="text-xl text-[#5b616e]">EUR</span>
            </div>
            <p className="text-sm font-medium text-[#5b616e] mt-2">
              {participantCount > 0 ? `Średnio dla ${participantCount} uczestników` : "Brak uczestników"}
            </p>
          </div>
        </div>

        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm flex flex-col justify-between">
          <div className="p-3 bg-[#f8f9fa] text-[#0a2351] rounded-2xl w-max mb-6">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Czas trwania</h3>
            <div className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">
              <span className="text-2xl md:text-3xl">
                {formatDateRange(data?.trip.start_date ?? null, data?.trip.end_date ?? null)}
              </span>
            </div>
            <p className="text-sm font-medium text-[#5b616e] mt-2">Zakres dat podróży</p>
          </div>
        </div>
      </div>

      {/* PODSUMOWANIE KATEGORII I ROZLICZEŃ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Lewa strona: Kategorie */}
        <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <PieChart className="text-[#3E67BF]" size={24} />
            <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight">Struktura wydatków</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="shrink-0">
              <DonutChart categories={topCategories} />
            </div>

            <div className="space-y-6 w-full">
              {topCategories.length === 0 ? (
                <div className="text-[#5b616e] font-medium">Brak wydatków do wyświetlenia.</div>
              ) : (
                topCategories.map((cat, idx) => {
                  const palette = ["bg-[#0a2351]", "bg-[#3E67BF]", "bg-[#578bfa]", "bg-[#aab8d5]", "bg-[#111827]", "bg-[#9CA3AF]"];
                  const color = palette[idx % palette.length];
                  const pct = Math.max(0, Math.min(100, Math.round(cat.percent)));
                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-bold text-[#0a0b0d]">{cat.name}</span>
                        <div className="text-right">
                          <span className="font-bold text-[#0a0b0d] block">{formatCurrency(cat.amount)} EUR</span>
                          <span className="text-xs text-[#5b616e] font-medium">{pct}% całości</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#f8f9fa] h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Prawa strona: Aktywność */}
        <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-8 md:p-10 flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 bg-[#eef0f3] rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={48} className="text-[#3E67BF]" />
          </div>
          <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight mb-4">Wszystko rozliczone!</h3>
          <p className="text-[#5b616e] mb-8 max-w-sm">
            Zestawienie zaległości i należności na podstawie tego, kto płacił za wydatki.
          </p>
          <div className="w-full p-6 bg-[#f8f9fa] rounded-[24px] border border-[#5b616e]/10 text-left space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#5b616e] font-bold">Łączna liczba paragonów:</span>
              <span className="text-[#0a0b0d] font-bold">24 szt.</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#5b616e] font-bold">Zeskanowane przez OCR:</span>
              <span className="text-[#0a0b0d] font-bold">18 szt.</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#5b616e] font-bold">Najdroższy wydatek:</span>
              <span className="text-[#0a0b0d] font-bold">
                {mostExpensive !== null ? `${formatCurrency(mostExpensive)} EUR` : "—"}
              </span>
            </div>
          </div>
        </div>

      </div>

      <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-8 md:p-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight">Uczestnicy i zaległości</h3>
            <p className="text-[#5b616e] text-sm font-medium mt-2">
              Każdy powinien finalnie wyjść na {formatCurrency(costPerPerson)} EUR (średnio).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-separate border-spacing-0">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider text-[#5b616e]">
                <th className="text-left pb-4">Użytkownik</th>
                <th className="text-right pb-4">Zapłacone</th>
                <th className="text-right pb-4">Udział</th>
                <th className="text-right pb-4">Do oddania</th>
                <th className="text-right pb-4">Do otrzymania</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5b616e]/10">
              {users.map((u) => {
                const toPay = Math.max(0, u.owed - u.paid);
                const toReceive = Math.max(0, u.paid - u.owed);
                const badgeClass =
                  toReceive >= 0.005
                    ? "bg-green-50 text-green-700"
                    : toPay >= 0.005
                      ? "bg-red-50 text-red-700"
                      : "bg-[#eef0f3] text-[#0a2351]";
                const badgeText =
                  toReceive >= 0.005 ? "Ma do otrzymania" : toPay >= 0.005 ? "Ma do oddania" : "Rozliczone";

                return (
                  <tr key={u.user_id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white border border-[#5b616e]/20 overflow-hidden">
                          <Image
                            src={getAvatarById(u.avatar_id).src}
                            alt=""
                            width={72}
                            height={72}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="font-bold text-[#0a0b0d]">{u.name}</div>
                        <div className={`ml-2 px-3 py-1 rounded-full text-[11px] font-bold ${badgeClass}`}>{badgeText}</div>
                      </div>
                    </td>
                    <td className="py-4 text-right font-bold text-[#0a0b0d]">{formatCurrency(u.paid)} EUR</td>
                    <td className="py-4 text-right font-medium text-[#5b616e]">{formatCurrency(u.owed)} EUR</td>
                    <td className={`py-4 text-right font-extrabold ${toPay >= 0.005 ? "text-red-600" : "text-[#5b616e]"}`}>
                      {toPay >= 0.005 ? `${formatCurrency(toPay)} EUR` : "—"}
                    </td>
                    <td className={`py-4 text-right font-extrabold ${toReceive >= 0.005 ? "text-green-600" : "text-[#5b616e]"}`}>
                      {toReceive >= 0.005 ? `${formatCurrency(toReceive)} EUR` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}