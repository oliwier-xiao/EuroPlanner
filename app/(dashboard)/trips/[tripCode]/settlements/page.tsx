"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  CheckCircle2, 
  ArrowDownRight, 
  ArrowUpRight
} from "lucide-react";
import { useTripUi } from "../TripContext";

// Przykładowe dane rozliczeń
const MOCK_SETTLEMENTS = [
  { id: "1", from: "Oliwier", to: "Michał", amount: 120, currency: "EUR", status: "pending" },
  { id: "2", from: "Wiktoria", to: "Michał", amount: 45, currency: "EUR", status: "pending" },
  { id: "3", from: "Michał", to: "Justyna", amount: 80, currency: "EUR", status: "pending" },
  { id: "4", from: "Oliwier", to: "Justyna", amount: 25, currency: "EUR", status: "settled" },
];

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState("Moje rozliczenia");
  const { isArchived } = useTripUi();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* NAGŁÓWEK */}
      <div>
        <h2 className="text-3xl font-bold text-[#0a0b0d] tracking-tight mb-2">Rozliczenia grupy</h2>
        <p className="text-[#5b616e]">Podsumowanie kto komu i ile powinien oddać, aby wyjść na zero.</p>
      </div>

      {/* BALANS UŻYTKOWNIKA (Układ 50/50) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Karta: Do zwrotu (Na plusie) */}
        <div className="bg-[#ffffff] p-8 rounded-[40px] border border-[#5b616e]/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-0" />
          <div className="relative z-10">
            <div className="p-3 bg-green-100 text-green-700 rounded-2xl w-max mb-6">
              <ArrowDownRight size={24} />
            </div>
            <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Znajomi wiszą Ci</h3>
            <div className="text-4xl font-bold text-[#0a0b0d] tracking-tighter text-green-600">
              +165 EUR
            </div>
            <p className="text-sm font-medium text-[#5b616e] mt-4">Od 2 osób</p>
          </div>
        </div>

        {/* Karta: Twój dług (Na minusie) */}
        <div className="bg-[#ffffff] p-8 rounded-[40px] border border-[#5b616e]/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f8f9fa] rounded-bl-full -z-0" />
          <div className="relative z-10">
            <div className="p-3 bg-[#eef0f3] text-[#0a2351] rounded-2xl w-max mb-6">
              <ArrowUpRight size={24} />
            </div>
            <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Musisz oddać</h3>
            <div className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">
              -80 EUR
            </div>
            <p className="text-sm font-medium text-[#5b616e] mt-4">Dla 1 osoby</p>
          </div>
        </div>
      </div>

      {/* LISTA DŁUGÓW */}
      <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-6 md:p-8">
        
        {/* Zakładki */}
        <div className="flex bg-[#f8f9fa] p-1.5 rounded-[56px] w-max mb-8">
          {["Moje rozliczenia", "Rozliczenia grupy"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-[56px] text-sm font-bold transition-all ${
                activeTab === tab 
                  ? "bg-[#ffffff] text-[#0a2351] shadow-sm border border-[#5b616e]/10" 
                  : "text-[#5b616e] hover:text-[#0a2351]"
              } cursor-pointer`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Lista transferów */}
        <div className="space-y-4">
          {MOCK_SETTLEMENTS.map((settlement) => (
            <div 
              key={settlement.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-[32px] border transition-all ${
                settlement.status === "settled" 
                  ? "bg-[#f8f9fa] border-transparent opacity-60" 
                  : "bg-[#ffffff] border-[#5b616e]/10 hover:border-[#0a2351]/20 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Informacja kto komu */}
              <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3E67BF] text-white flex items-center justify-center font-bold text-sm shadow-inner">
                    {settlement.from.charAt(0)}
                  </div>
                  <span className={`font-bold ${settlement.status === 'settled' ? 'text-[#5b616e]' : 'text-[#0a0b0d]'}`}>
                    {settlement.from}
                  </span>
                </div>
                
                <ArrowRight size={20} className="text-[#5b616e] shrink-0" />
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0a2351] text-white flex items-center justify-center font-bold text-sm shadow-inner">
                    {settlement.to.charAt(0)}
                  </div>
                  <span className={`font-bold ${settlement.status === 'settled' ? 'text-[#5b616e]' : 'text-[#0a0b0d]'}`}>
                    {settlement.to}
                  </span>
                </div>
              </div>

              {/* Kwota i Akcja */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                <span className={`text-2xl font-bold tracking-tight ${settlement.status === 'settled' ? 'text-[#5b616e]' : 'text-[#0a0b0d]'}`}>
                  {settlement.amount} {settlement.currency}
                </span>

                {settlement.status === "pending" ? (
                  <button
                    disabled={isArchived}
                    className="px-6 py-3 bg-[#0a2351] hover:bg-[#578bfa] text-white font-bold rounded-[56px] transition-colors text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Rozlicz
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 font-bold px-6 py-3 bg-green-50 rounded-[56px] text-sm">
                    <CheckCircle2 size={18} />
                    Rozliczone
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}