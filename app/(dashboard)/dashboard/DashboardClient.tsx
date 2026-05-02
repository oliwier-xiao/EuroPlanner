"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Plus, TrendingUp, Users, CreditCard, ArrowRight, MapPin, Clock, Mail, Shield
} from "lucide-react";
import { useAvatar } from "@/hooks/useAvatar";

type User = {
  user_id: string;
  name: string | null;
  surname: string | null;
  email: string | null;
  admin_access: boolean | null;
};

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

type Stats = {
  activeTrips: number;
  upcomingTrips: number;
  totalTrips: number;
  totalParticipants: number;
  totalSpent: number;
  displayName: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function DashboardClient({
  user,
  trips,
  stats,
}: {
  user: User | null;
  trips: TripCard[];
  stats: Stats | null;
}) {
  const router = useRouter();
  const { avatar } = useAvatar();
  const resolvedName = stats?.displayName || [user?.name, user?.surname].filter(Boolean).join(" ");
  const greeting = resolvedName ? `Witaj, ${resolvedName}!` : "Witaj!";
  const subtitle = user?.email
    ? `Zalogowano jako ${user.email}`
    : user
      ? "Twój pulpit podróży"
      : "Wczytywanie danych konta...";

  return (
    <div className="p-6 md:p-10 space-y-10 bg-[#ffffff] min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a0b0d] leading-none tracking-tighter mb-3">
            {greeting}
          </h1>
          <p className="text-[#5b616e] text-lg font-medium">
            {subtitle}
          </p>
        </div>
        <button 
          onClick={() => router.push("/trips?new=1")}
          className="w-full md:w-auto px-8 py-4 bg-[#0a2351] hover:bg-[#578bfa] text-white font-bold rounded-[56px] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          <span>Nowa podróż</span>
        </button>
      </div>

      {/* STATYSTYKI - To te karty z obrazka 2, których brakowało wcześniej */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Aktywne podróże", value: String(stats?.activeTrips ?? 0), sub: "w realizacji", icon: TrendingUp },
          { label: "Nadchodzące wyjazdy", value: String(stats?.upcomingTrips ?? 0), sub: "w kalendarzu", icon: MapPin },
          { label: "Uczestnicy łącznie", value: String(stats?.totalParticipants ?? 0), sub: "we wszystkich podróżach", icon: Users },
          { label: "Wydatki łącznie", value: `${formatCurrency(stats?.totalSpent ?? 0)} €`, sub: "wszystkie wyjazdy", icon: CreditCard },
        ].map((stat, i) => (
          <div key={i} className="bg-[#ffffff] p-6 rounded-[24px] border border-[#5b616e]/20 group hover:border-[#0a2351] transition-colors">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[#5b616e] text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <stat.icon size={18} className="text-[#0a2351]" />
            </div>
            <p className="text-3xl font-bold text-[#0a0b0d] tracking-tighter">{stat.value}</p>
            <p className="text-xs text-[#5b616e]/60 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end px-2">
            <h2 className="text-2xl font-bold text-[#0a0b0d] tracking-tight">Twoje Podróże</h2>
            <button onClick={() => router.push("/trips")} className="text-[#0a2351] font-bold text-sm hover:underline">
              Wszystkie <ArrowRight size={16} className="inline ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-[#ffffff] p-8 rounded-[40px] border border-[#5b616e]/20 hover:shadow-lg transition-all group">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-[#eef0f3] rounded-2xl group-hover:bg-[#0a2351] group-hover:text-white transition-colors text-[#0a2351]">
                    <MapPin size={24} />
                  </div>
                  <span className="px-4 py-1 text-[10px] uppercase font-black tracking-widest rounded-full bg-[#eef0f3] text-[#0a2351]">
                    {trip.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#0a0b0d] mb-6 tracking-tight">{trip.name}</h3>
                <p className="text-sm text-[#5b616e] font-medium mb-5">{trip.dates}</p>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold text-[#5b616e]">
                    <span>{trip.spent} / {trip.total} EUR</span>
                    <span className={trip.budget > 90 ? "text-red-500" : "text-[#0a0b0d]"}>{trip.budget}%</span>
                  </div>
                  <div className="w-full bg-[#eef0f3] h-3 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#0a2351]" style={{ width: `${trip.budget}%` }} />
                  </div>
                </div>
              </div>
            ))}

            {trips.length === 0 && (
              <div className="md:col-span-2 bg-[#f8f9fa] p-8 rounded-[40px] border border-dashed border-[#5b616e]/20 text-center">
                <p className="text-[#5b616e] font-medium">Nie znaleziono podróży przypisanych do tego konta.</p>
              </div>
            )}
          </div>
        </div>

        {user && (
          <div className="space-y-8">
            <section className="bg-[#f8f9fa] p-8 rounded-[40px] border border-[#5b616e]/10">
              <h2 className="text-[22px] font-bold text-[#0a0b0d] tracking-tight mb-8">Dane konta</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-4 p-4 rounded-[24px] bg-white border border-[#5b616e]/10">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#eef0f3] shrink-0">
                    <Image
                      src={avatar.src}
                      alt=""
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0a0b0d] truncate">{resolvedName || "Konto"}</p>
                    {user.email && (
                      <p className="text-sm text-[#5b616e] truncate">{user.email}</p>
                    )}
                  </div>
                </div>

                {user.email && (
                  <div className="flex items-center gap-3 text-sm text-[#5b616e] font-medium">
                    <Mail size={16} className="text-[#0a2351]" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm text-[#5b616e] font-medium">
                  <Shield size={16} className="text-[#0a2351]" />
                  <span className="truncate font-mono text-xs">{user.user_id}</span>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

    </div>
  );
}