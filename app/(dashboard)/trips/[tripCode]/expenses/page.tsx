"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Receipt, 
  Plus, 
  Camera, 
  Search, 
  Coffee, 
  Plane, 
  Home, 
  ShoppingBag,
  Filter
} from "lucide-react";

// Przykładowe dane wydatków
const MOCK_EXPENSES = [
  { id: "1", title: "Kolacja w Trattoria", category: "Jedzenie", icon: Coffee, amount: 85, currency: "EUR", payer: "Michał", date: "Dziś, 19:30", color: "bg-[#578bfa]" },
  { id: "2", title: "Bilety do Koloseum", category: "Atrakcje", icon: ShoppingBag, amount: 48, currency: "EUR", payer: "Justyna", date: "Dziś, 14:00", color: "bg-[#aab8d5]" },
  { id: "3", title: "Taxi z lotniska", category: "Transport", icon: Plane, amount: 35, currency: "EUR", payer: "Michał", date: "Wczoraj, 09:15", color: "bg-[#3E67BF]" },
  { id: "4", title: "Airbnb (3 noce)", category: "Nocleg", icon: Home, amount: 450, currency: "EUR", payer: "Oliwier", date: "10.05.2026", color: "bg-[#0a2351]" },
  { id: "5", title: "Kawa i rogaliki", category: "Jedzenie", icon: Coffee, amount: 12, currency: "EUR", payer: "Wiktoria", date: "10.05.2026", color: "bg-[#578bfa]" },
];

export default function ExpensesPage() {
  const router = useRouter();
  const params = useParams();
  const tripCode = typeof params.tripCode === "string" ? params.tripCode : "";

  const [activeTab, setActiveTab] = useState("Wszystkie");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = ["Wszystkie", "Moje wydatki", "Do zwrotu"];

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
            onClick={() => router.push(`/trips/${tripCode}/scan`)}
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
          {MOCK_EXPENSES.map((expense) => (
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
                  {expense.amount} {expense.currency}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}