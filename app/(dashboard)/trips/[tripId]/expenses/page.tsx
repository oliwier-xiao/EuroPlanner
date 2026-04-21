"use client";

import React from "react";

// Mockowane dane wydatków (później zastąpisz to pobieraniem z Supabase)
const MOCK_EXPENSES = [
  { id: 1, title: "Kolacja w Trattoria", category: "Jedzenie", amount: 45.50, currency: "EUR", paidBy: "Justyna", date: "12.05.2026", icon: "🍕" },
  { id: 2, title: "Bilety do Koloseum", category: "Atrakcje", amount: 120.00, currency: "EUR", paidBy: "Oliwier", date: "13.05.2026", icon: "🏛️" },
  { id: 3, title: "Paliwo na autostradzie", category: "Transport", amount: 65.00, currency: "EUR", paidBy: "Ty", date: "13.05.2026", icon: "🚗" },
  { id: 4, title: "Nocleg Airbnb (3 noce)", category: "Noclegi", amount: 450.00, currency: "EUR", paidBy: "Wiktoria", date: "11.05.2026", icon: "🛏️" },
];

export default function ExpensesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* NAGŁÓWEK I PRZYCISKI AKCJI */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <div>
          <h3 className="text-xl font-bold text-white">Wydatki grupy</h3>
          <p className="text-sm text-slate-400">Zarządzaj wspólnymi kosztami wyjazdu.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Przycisk Ręczny */}
          <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition-all cursor-pointer">
            + Ręcznie
          </button>
          {/* Przycisk Skanera (Główny) */}
          <button className="flex-1 sm:flex-none px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-sky-500/20 transition-all cursor-pointer flex items-center justify-center gap-2">
            <span>📷</span> Skanuj paragon
          </button>
        </div>
      </div>

      {/* LISTA WYDATKÓW */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-slate-700/50">
          {MOCK_EXPENSES.length > 0 ? MOCK_EXPENSES.map((expense) => (
            <div 
              key={expense.id} 
              className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              {/* Lewa strona: Ikona i Tytuł */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {expense.icon}
                </div>
                <div>
                  <p className="font-bold text-white text-base sm:text-lg">{expense.title}</p>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Zapłacił(a): <span className="text-slate-300 font-medium">{expense.paidBy}</span> • {expense.date}
                  </p>
                </div>
              </div>

              {/* Prawa strona: Kwota */}
              <div className="text-right">
                <p className="font-bold text-white text-lg sm:text-xl">
                  {expense.amount.toFixed(2)} <span className="text-sky-400">{expense.currency}</span>
                </p>
                <p className="text-xs text-slate-500 bg-slate-800 inline-block px-2 py-0.5 rounded-md mt-1">
                  {expense.category}
                </p>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-slate-500">
              Brak wydatków. Dodaj pierwszy paragon, aby zacząć!
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}