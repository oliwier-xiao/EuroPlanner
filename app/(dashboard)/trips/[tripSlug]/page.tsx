"use client";

import React from "react";
import { 
  TrendingUp, 
  Clock, 
  MapPin, 
  Users, 
  ArrowUpRight, 
  Plus, 
  CreditCard, 
  Navigation 
} from "lucide-react";

export default function TripSummaryPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* SEKCJA 1: STATYSTYKI GŁÓWNE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KARTA: BUDŻET */}
        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#f8f9fa] rounded-2xl text-[#0a2351]">
              <TrendingUp size={24} />
            </div>
            <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full text-xs font-bold">Wysokie zużycie</span>
          </div>
          <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Wykorzystany Budżet</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">1 840</span>
            <span className="text-xl text-[#5b616e] font-medium">/ 2 000 EUR</span>
          </div>
          <div className="mt-6 w-full bg-[#eef0f3] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-[#0a2351] rounded-full w-[92%]" />
          </div>
        </div>

        {/* KARTA: CZAS */}
        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#f8f9fa] rounded-2xl text-[#0a2351]">
              <Clock size={24} />
            </div>
          </div>
          <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Pozostało dni</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">3</span>
            <span className="text-xl text-[#5b616e] font-medium">z 5 dni</span>
          </div>
          <p className="text-[#5b616e] text-sm mt-4">Powrót zaplanowany na 15.05</p>
        </div>

        {/* KARTA: UCZESTNICY */}
        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#f8f9fa] rounded-2xl text-[#0a2351]">
              <Users size={24} />
            </div>
          </div>
          <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Aktywni uczestnicy</h3>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">4</span>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-[#3E67BF] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                  U{i}
                </div>
              ))}
            </div>
          </div>
          <p className="text-[#5b616e] text-sm mt-4">Wszyscy uczestnicy są rozliczeni.</p>
        </div>
      </div>

      {/* SEKCJA 2: SZYBKIE AKCJE I NASTĘPNY PUNKT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEWA KOLUMNA: NASTĘPNY PUNKT TRASY */}
        <div className="bg-[#0a2351] rounded-[40px] p-10 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-bold mb-8">
              <Navigation size={16} />
              NASTĘPNY PUNKT
            </div>
            <h2 className="text-4xl font-bold tracking-tighter mb-4 leading-none">
              Koloseum <br /> & Forum Romanum
            </h2>
            <div className="flex items-center gap-4 text-white/70 mb-10">
              <div className="flex items-center gap-1">
                <Clock size={16} /> 14:30
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={16} /> Piazza del Colosseo
              </div>
            </div>
            <button className="px-8 py-4 bg-white text-[#0a2351] font-bold rounded-[56px] hover:bg-[#578bfa] hover:text-white transition-all flex items-center gap-2">
              Zobacz szczegóły trasy
              <ArrowUpRight size={18} />
            </button>
          </div>
          {/* Dekoracyjny element w tle */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
        </div>

        {/* PRAWA KOLUMNA: SZYBKIE AKCJE */}
        <div className="bg-[#ffffff] rounded-[40px] p-10 border border-[#5b616e]/10 shadow-sm">
          <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight mb-8">Szybkie akcje</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex flex-col items-start p-6 rounded-[24px] bg-[#f8f9fa] hover:bg-[#eef0f3] border border-transparent hover:border-[#0a2351]/10 transition-all group">
              <div className="p-3 bg-white rounded-xl text-[#3E67BF] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <CreditCard size={20} />
              </div>
              <span className="font-bold text-[#0a0b0d]">Dodaj wydatek</span>
              <span className="text-xs text-[#5b616e] mt-1">Ręcznie lub skanem</span>
            </button>

            <button className="flex flex-col items-start p-6 rounded-[24px] bg-[#f8f9fa] hover:bg-[#eef0f3] border border-transparent hover:border-[#0a2351]/10 transition-all group">
              <div className="p-3 bg-white rounded-xl text-[#3E67BF] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="font-bold text-[#0a0b0d]">Dodaj uczestnika</span>
              <span className="text-xs text-[#5b616e] mt-1">Zaproś znajomego</span>
            </button>

            <button className="flex flex-col items-start p-6 rounded-[24px] bg-[#f8f9fa] hover:bg-[#eef0f3] border border-transparent hover:border-[#0a2351]/10 transition-all group">
              <div className="p-3 bg-white rounded-xl text-[#3E67BF] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <MapPin size={20} />
              </div>
              <span className="font-bold text-[#0a0b0d]">Nowy punkt</span>
              <span className="text-xs text-[#5b616e] mt-1">Zaplanuj przystanek</span>
            </button>

            <button className="flex flex-col items-start p-6 rounded-[24px] bg-[#f8f9fa] hover:bg-[#eef0f3] border border-transparent hover:border-[#0a2351]/10 transition-all group">
              <div className="p-3 bg-white rounded-xl text-[#3E67BF] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <ArrowUpRight size={20} />
              </div>
              <span className="font-bold text-[#0a0b0d]">Eksportuj raport</span>
              <span className="text-xs text-[#5b616e] mt-1">PDF lub CSV</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}