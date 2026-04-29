import "server-only";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  TrendingUp,
  Clock,
  MapPin,
  Users,
  ArrowUpRight,
  Plus,
  CreditCard,
  Navigation,
} from "lucide-react";
import { findTripBySlug, getTripSummary, type TripParticipant } from "@/lib/trips";
import { getAvatarById } from "@/lib/avatars";

export const dynamic = "force-dynamic";

const timeFormatter = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
});
const dayMonthFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
});
const integerFormatter = new Intl.NumberFormat("pl-PL", {
  maximumFractionDigits: 0,
});

const DAY_MS = 1000 * 60 * 60 * 24;

function tripDayMetrics(startDate: string | null, endDate: string | null) {
  if (!startDate || !endDate) {
    return { remaining: null, total: null, returnDate: null };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { remaining: null, total: null, returnDate: null };
  }
  const total = Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1);
  const remaining = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / DAY_MS));
  return { remaining, total, returnDate: dayMonthFormatter.format(end) };
}

function participantInitials(participant: TripParticipant): string {
  const fromName = participant.name?.trim()?.[0];
  const fromSurname = participant.surname?.trim()?.[0];
  const initials = `${fromName ?? ""}${fromSurname ?? ""}`.toUpperCase();
  return initials || "?";
}

export default async function TripSummaryPage({
  params,
}: {
  params: Promise<{ tripCode: string }>;
}) {
  const { tripCode } = await params;
  const trip = await findTripBySlug(tripCode);
  if (!trip) notFound();

  const summary = await getTripSummary(trip.trip_id);

  const budgetLimit = trip.budget_limit ?? 0;
  const spent = summary.expensesTotal;
  const hasBudget = budgetLimit > 0;
  const usagePercent = hasBudget ? Math.min(100, Math.round((spent / budgetLimit) * 100)) : 0;
  const isHighUsage = hasBudget && usagePercent >= 90;

  const { remaining: daysRemaining, total: totalDays, returnDate } = tripDayMetrics(
    trip.start_date,
    trip.end_date,
  );

  const visibleParticipants = summary.participants.slice(0, 4);
  const overflowCount = Math.max(0, summary.participants.length - visibleParticipants.length);

  const nextDest = summary.nextDestination;
  const nextDestTime = nextDest?.arrival_time ? timeFormatter.format(new Date(nextDest.arrival_time)) : null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#f8f9fa] rounded-2xl text-[#0a2351]">
              <TrendingUp size={24} />
            </div>
            {isHighUsage && (
              <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-bold">
                Wysokie zużycie
              </span>
            )}
          </div>
          <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">
            Wykorzystany Budżet
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">
              {integerFormatter.format(spent)}
            </span>
            <span className="text-xl text-[#5b616e] font-medium">
              / {hasBudget ? `${integerFormatter.format(budgetLimit)} EUR` : "Brak limitu"}
            </span>
          </div>
          <div className="mt-6 w-full bg-[#eef0f3] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isHighUsage ? "bg-red-500" : "bg-[#0a2351]"}`}
              style={{ width: `${hasBudget ? usagePercent : 0}%` }}
            />
          </div>
        </div>

        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#f8f9fa] rounded-2xl text-[#0a2351]">
              <Clock size={24} />
            </div>
          </div>
          <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">
            Pozostało dni
          </h3>
          {daysRemaining !== null && totalDays !== null ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">
                  {daysRemaining}
                </span>
                <span className="text-xl text-[#5b616e] font-medium">z {totalDays} dni</span>
              </div>
              <p className="text-[#5b616e] text-sm mt-4">Powrót zaplanowany na {returnDate}</p>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">—</span>
              </div>
              <p className="text-[#5b616e] text-sm mt-4">Brak harmonogramu</p>
            </>
          )}
        </div>

        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#f8f9fa] rounded-2xl text-[#0a2351]">
              <Users size={24} />
            </div>
          </div>
          <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">
            Aktywni uczestnicy
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">
              {summary.participants.length}
            </span>
            <div className="flex -space-x-3">
              {visibleParticipants.map((participant) => {
                const avatar = getAvatarById(participant.avatar_id);
                return (
                  <div
                    key={participant.user_id}
                    title={`${participant.name ?? ""} ${participant.surname ?? ""}`.trim() || "Uczestnik"}
                    className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-[#eef0f3]"
                  >
                    <Image
                      src={avatar.src}
                      alt=""
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
              {overflowCount > 0 && (
                <div className="w-8 h-8 rounded-full bg-[#3E67BF] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                  +{overflowCount}
                </div>
              )}
              {summary.participants.length === 0 && (
                <span className="text-sm text-[#5b616e]">Brak uczestników</span>
              )}
            </div>
          </div>
          <p className="text-[#5b616e] text-sm mt-4">
            {summary.participants.length === 1
              ? "Jak na razie tylko Ty."
              : `Łącznie ${summary.participants.length} ${
                  summary.participants.length < 5 ? "osoby" : "osób"
                } w podróży.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0a2351] rounded-[40px] p-10 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-bold mb-8">
              <Navigation size={16} />
              NASTĘPNY PUNKT
            </div>
            {nextDest ? (
              <>
                <h2 className="text-4xl font-bold tracking-tighter mb-4 leading-none">
                  {nextDest.name}
                </h2>
                <div className="flex items-center gap-4 text-white/70 mb-10">
                  {nextDestTime && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} /> {nextDestTime}
                    </div>
                  )}
                  {typeof nextDest.visit_order === "number" && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} /> Punkt #{nextDest.visit_order}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold tracking-tighter mb-4 leading-none">
                  Brak punktów trasy
                </h2>
                <p className="text-white/70 mb-10 max-w-md">
                  Dodaj pierwszy przystanek, żeby zobaczyć harmonogram tutaj.
                </p>
              </>
            )}
            <Link
              href={`/trips/${trip.slug}/route`}
              className="inline-flex px-8 py-4 bg-white text-[#0a2351] font-bold rounded-[56px] hover:bg-[#578bfa] hover:text-white transition-all items-center gap-2"
            >
              {nextDest ? "Zobacz szczegóły trasy" : "Zaplanuj trasę"}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
        </div>

        <div className="bg-[#ffffff] rounded-[40px] p-10 border border-[#5b616e]/10 shadow-sm">
          <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight mb-8">Szybkie akcje</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href={`/trips/${trip.slug}/expenses`}
              className="flex flex-col items-start p-6 rounded-[24px] bg-[#f8f9fa] hover:bg-[#eef0f3] border border-transparent hover:border-[#0a2351]/10 transition-all group"
            >
              <div className="p-3 bg-white rounded-xl text-[#3E67BF] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <CreditCard size={20} />
              </div>
              <span className="font-bold text-[#0a0b0d]">Dodaj wydatek</span>
              <span className="text-xs text-[#5b616e] mt-1">Ręcznie lub skanem</span>
            </Link>

            <Link
              href={`/trips/${trip.slug}/settlements`}
              className="flex flex-col items-start p-6 rounded-[24px] bg-[#f8f9fa] hover:bg-[#eef0f3] border border-transparent hover:border-[#0a2351]/10 transition-all group"
            >
              <div className="p-3 bg-white rounded-xl text-[#3E67BF] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="font-bold text-[#0a0b0d]">Rozliczenia grupy</span>
              <span className="text-xs text-[#5b616e] mt-1">Zobacz kto komu ile</span>
            </Link>

            <Link
              href={`/trips/${trip.slug}/route`}
              className="flex flex-col items-start p-6 rounded-[24px] bg-[#f8f9fa] hover:bg-[#eef0f3] border border-transparent hover:border-[#0a2351]/10 transition-all group"
            >
              <div className="p-3 bg-white rounded-xl text-[#3E67BF] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <MapPin size={20} />
              </div>
              <span className="font-bold text-[#0a0b0d]">Nowy punkt</span>
              <span className="text-xs text-[#5b616e] mt-1">Zaplanuj przystanek</span>
            </Link>

            <Link
              href={`/trips/${trip.slug}/report`}
              className="flex flex-col items-start p-6 rounded-[24px] bg-[#f8f9fa] hover:bg-[#eef0f3] border border-transparent hover:border-[#0a2351]/10 transition-all group"
            >
              <div className="p-3 bg-white rounded-xl text-[#3E67BF] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <ArrowUpRight size={20} />
              </div>
              <span className="font-bold text-[#0a0b0d]">Eksportuj raport</span>
              <span className="text-xs text-[#5b616e] mt-1">PDF lub CSV</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
