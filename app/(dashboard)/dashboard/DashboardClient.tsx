"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, TrendingUp, Users, CreditCard, Scan, ArrowRight, MapPin, Clock, X
} from "lucide-react";

// Dane testowe z Twojego page1.tsx
const MOCK_TRIPS = [
  { id: "1", name: "Majówka w Rzymie", status: "W trakcie", budget: 92, spent: "1 840", total: "2 000" },
  { id: "2", name: "Weekend w Berlinie", status: "Planowana", budget: 0, spent: "0", total: "1 200" },
];

const RECENT_ACTIVITY = [
  { id: 1, user: "Justyna", action: "dodała wydatek", item: "Kolacja w Trattoria", amount: "45 EUR", date: "2H TEMU" },
  { id: 2, user: "Wiktoria", action: "zmieniła trasę", item: "Rzym → Florencja", amount: null, date: "5H TEMU" },
  { id: 3, user: "Oliwier", action: "zeskanował paragon", item: "Bilety do Koloseum", amount: "120 EUR", date: "WCZORAJ" },
];

export default function DashboardClient({ userName }: { userName: string | null }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 md:p-10 space-y-10 bg-[#ffffff] min-h-full">
      
      {/* NAGŁÓWEK - Identyczny z obrazkiem 2 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a0b0d] leading-none tracking-tighter mb-3">
            Witaj, {userName || "Podróżniku"}!
          </h1>
          <p className="text-[#5b616e] text-lg font-medium">Masz 1 aktywną podróż i oczekujące rozliczenia.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-8 py-4 bg-[#0a2351] hover:bg-[#578bfa] text-white font-bold rounded-[56px] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          <span>Nowa podróż</span>
        </button>
      </div>

      {/* STATYSTYKI - To te karty z obrazka 2, których brakowało wcześniej */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Wydatki łącznie", value: "3 250 €", sub: "wszystkie wyjazdy", icon: CreditCard },
          { label: "Aktywne podróże", value: "1", sub: "w realizacji", icon: TrendingUp },
          { label: "Twoje saldo", value: "+120 €", sub: "do zwrotu", icon: Users },
          { label: "Skany OCR", value: "15", sub: "paragony", icon: Scan },
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
            {MOCK_TRIPS.map((trip) => (
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
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-[#f8f9fa] p-8 rounded-[40px] border border-[#5b616e]/10">
            <h2 className="text-[22px] font-bold text-[#0a0b0d] tracking-tight mb-8">Ostatnie zdarzenia</h2>
            <div className="space-y-8">
              {RECENT_ACTIVITY.map((act) => (
                <div key={act.id} className="relative pl-6 border-l-[1.5px] border-[#5b616e]/20 group">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#0a2351]"></div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-[16px] font-bold text-[#0a0b0d] leading-none">{act.user}</p>
                    <div className="flex items-center gap-1 text-[10px] text-[#5b616e] font-bold uppercase tracking-widest">
                      <Clock size={12} /> {act.date}
                    </div>
                  </div>
                  <p className="text-[15px] text-[#5b616e] mb-3 font-medium">{act.action} {act.item}</p>
                  {act.amount && (
                    <span className="text-[#0a2351] font-bold text-[13px] bg-[#0a2351]/10 px-3 py-1.5 rounded-md inline-block">
                      {act.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#0a0b0d]/20 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-[#ffffff] border border-[#5b616e]/20 w-full max-w-xl rounded-[40px] p-10 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black">
               <X size={24} />
            </button>
            <h2 className="text-3xl font-bold text-[#0a0b0d] tracking-tight mb-8 text-center">Zaplanuj przygodę</h2>
            <div className="space-y-6">
              <input type="text" placeholder="Nazwa wyprawy" className="w-full bg-[#f8f9fa] border border-[#5b616e]/20 rounded-full px-6 py-4 text-[#0a0b0d] outline-none focus:border-[#0a2351]" />
              <button className="w-full py-4 bg-[#0a2351] text-white font-bold rounded-full">Dalej</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}