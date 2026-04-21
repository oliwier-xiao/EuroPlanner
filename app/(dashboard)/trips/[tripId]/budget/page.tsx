"use client";

import React, { useState } from "react";

export default function BudgetPage() {
  const [totalLimit, setTotalLimit] = useState(2000);
  const spent = 1840;
  const percentage = Math.round((spent / totalLimit) * 100);

  // Dane dla kategorii (User Story 11)
  const categories = [
    { name: "Jedzenie", spent: 850, limit: 1000, color: "bg-orange-400" },
    { name: "Transport", spent: 600, limit: 500, color: "bg-sky-400" }, // Przekroczone!
    { name: "Noclegi", spent: 390, limit: 500, color: "bg-purple-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* GŁÓWNY WSKAŹNIK BUDŻETU */}
      <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Budżet całkowity</h3>
            <p className="text-slate-400">Aktualne zużycie środków na całą podróż.</p>
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-4xl font-black text-white">{spent}</span>
              <span className="text-xl text-slate-500">/ {totalLimit} EUR</span>
            </div>
          </div>
          
          {/* Kołowy wskaźnik (prosty CSS) */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={364.4}
                strokeDashoffset={364.4 - (364.4 * percentage) / 100}
                className={`${percentage > 90 ? 'text-red-500' : 'text-sky-500'} transition-all duration-1000`}
              />
            </svg>
            <span className={`absolute text-xl font-bold ${percentage > 90 ? 'text-red-500' : 'text-white'}`}>
              {percentage}%
            </span>
          </div>
        </div>

        {/* OSTRZEŻENIE (User Story 18) */}
        {percentage > 90 && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-3">
            <span>⚠️</span>
            <p><strong>Uwaga!</strong> Przekroczyłeś 90% założonego budżetu. Czas zacząć oszczędzać!</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEWA KOLUMNA: USTAWIENIA LIMITÓW */}
        <div className="lg:col-span-2 space-y-6">
          <h4 className="text-lg font-bold text-white">Limity kategorii</h4>
          <div className="grid grid-cols-1 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                    <span className="font-bold text-white">{cat.name}</span>
                  </div>
                  <span className="text-sm text-slate-400">
                    {cat.spent} / <span className="text-slate-200">{cat.limit} EUR</span>
                  </span>
                </div>
                
                {/* Pasek postępu kategorii */}
                <div className="relative w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${cat.spent > cat.limit ? 'bg-red-500' : cat.color} transition-all duration-500`}
                    style={{ width: `${Math.min((cat.spent / cat.limit) * 100, 100)}%` }}
                  />
                </div>
                
                {cat.spent > cat.limit && (
                  <p className="text-[10px] text-red-400 italic">Limit przekroczony o {cat.spent - cat.limit} EUR!</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PRAWA KOLUMNA: EDYCJA GŁÓWNEGO LIMITU */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 h-fit space-y-6">
          <h4 className="text-lg font-bold text-white">Zarządzaj limitem</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">
                Całkowity limit podróży
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={totalLimit}
                  onChange={(e) => setTotalLimit(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
                <span className="text-slate-400 font-bold text-sm">EUR</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Zalecamy ustawienie realnego limitu, aby system mógł poprawnie wysyłać powiadomienia o przekroczeniach.
            </p>
            <button className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-all cursor-pointer">
              Zapisz zmiany
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}