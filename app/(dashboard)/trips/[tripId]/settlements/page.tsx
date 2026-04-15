"use client";

import React from "react";

// Mockowane dane rozliczeń
const BALANCES = [
  { name: "Ty", balance: 0, spent: 450, share: 450 },
  { name: "Justyna", balance: 120, spent: 570, share: 450 }, // na plusie (inni jej oddają)
  { name: "Wiktoria", balance: -70, spent: 380, share: 450 }, // na minusie (musi oddać)
  { name: "Oliwier", balance: -50, spent: 400, share: 450 },  // na minusie (musi oddać)
];

const SUGGESTED_TRANSFERS = [
  { id: 1, from: "Wiktoria", to: "Justyna", amount: 70.00, currency: "EUR", isSettled: false },
  { id: 2, from: "Oliwier", to: "Justyna", amount: 50.00, currency: "EUR", isSettled: true },
];

export default function SettlementsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <div>
          <h3 className="text-xl font-bold text-white">Rozliczenia grupy</h3>
          <p className="text-sm text-slate-400">Zminimalizowana liczba przelewów, by wyrównać długi.</p>
        </div>
        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer">
          <span>↓</span> Pobierz jako PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEWA KOLUMNA: Kto komu przelewa */}
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-white">Proponowane przelewy</h4>
          
          <div className="space-y-4">
            {SUGGESTED_TRANSFERS.map((transfer) => (
              <div 
                key={transfer.id} 
                className={`p-6 rounded-2xl border transition-all ${
                  transfer.isSettled 
                    ? "bg-slate-800/20 border-slate-700/50 opacity-60" 
                    : "bg-slate-800/60 border-slate-600 hover:border-sky-500/50"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">{transfer.from}</span>
                    <span className="text-slate-500">➔</span>
                    <span className="font-bold text-white">{transfer.to}</span>
                  </div>
                  <span className={`font-bold text-lg ${transfer.isSettled ? "text-slate-500" : "text-sky-400"}`}>
                    {transfer.amount.toFixed(2)} {transfer.currency}
                  </span>
                </div>
                
                {transfer.isSettled ? (
                  <div className="w-full text-center py-2 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium">
                    ✓ Rozliczone
                  </div>
                ) : (
                  <button className="w-full py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg text-sm font-bold transition-colors cursor-pointer">
                    Oznacz jako zapłacone
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PRAWA KOLUMNA: Bilanse szczegółowe */}
        <div className="space-y-6">
          <h4 className="text-lg font-bold text-white">Bilanse uczestników</h4>
          
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-slate-700/50">
              {BALANCES.map((user, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-base">{user.name}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Wydano: {user.spent} EUR • Udział: {user.share} EUR
                    </p>
                  </div>
                  
                  <div className="text-right">
                    {user.balance === 0 && (
                      <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-md text-sm font-bold">
                        Wyzerowany
                      </span>
                    )}
                    {user.balance > 0 && (
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-md text-sm font-bold">
                        +{user.balance.toFixed(2)} EUR
                      </span>
                    )}
                    {user.balance < 0 && (
                      <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-md text-sm font-bold">
                        {user.balance.toFixed(2)} EUR
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}