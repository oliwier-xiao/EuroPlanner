import React from "react";

export default function TripSummaryPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-white">Uczestnicy</h3>
        <div className="flex flex-wrap gap-2">
          {["Ty", "Justyna", "Wiktoria", "Oliwier"].map((p, i) => (
            <span key={i} className="px-4 py-2 bg-slate-700 rounded-full text-sm text-slate-200">
              {p}
            </span>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-white">Szybkie statystyki</h3>
        <div className="space-y-2">
          <p className="text-slate-400 text-sm flex justify-between">
            <span>Wykorzystany budżet:</span>
            <span className="text-white font-bold">1 840 / 2 000 EUR</span>
          </p>
          <p className="text-slate-400 text-sm flex justify-between">
            <span>Zeskanowane paragony:</span>
            <span className="text-white font-bold">12</span>
          </p>
        </div>
      </div>
    </div>
  );
}