"use client";

import React from "react";

export default function ReportPage() {
  // Przykładowe dane do raportu
  const tripSummary = {
    name: "Majówka w Rzymie",
    date: "10.05.2026 - 15.05.2026",
    totalSpent: "1 840.00 EUR",
    averagePerDay: "306.66 EUR",
    topCategory: "Jedzenie (45%)",
    totalParagons: 12
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* NAGŁÓWEK SEKCI RAPORTÓW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <div>
          <h3 className="text-xl font-bold text-white">Raporty i Eksport</h3>
          <p className="text-sm text-slate-400">Wygeneruj oficjalne podsumowanie Twojej podróży.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-bold transition-all cursor-pointer">
            Eksportuj CSV
          </button>
          <button className="flex-1 sm:flex-none px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-sky-500/20 transition-all cursor-pointer">
            Pobierz PDF
          </button>
        </div>
      </div>

      {/* PODGLĄD RAPORTU */}
      <div className="bg-white text-slate-900 p-8 md:p-12 rounded-sm shadow-2xl max-w-4xl mx-auto font-serif relative overflow-hidden">
        {/* Znak wodny EuroPlanner */}
        <div className="absolute top-10 right-[-40px] rotate-45 bg-sky-500 text-white px-10 py-1 text-xs font-sans font-bold uppercase tracking-widest opacity-20">
          EuroPlanner
        </div>

        {/* Nagłówek dokumentu */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Raport Podróży</h2>
            <p className="text-slate-500 font-sans text-sm mt-1 uppercase tracking-widest">{tripSummary.name}</p>
          </div>
          <div className="text-right font-sans text-xs text-slate-400">
            <p>Data wygenerowania:</p>
            <p className="font-bold text-slate-900">16.05.2026</p>
          </div>
        </div>

        {/* Tabela z kluczowymi danymi */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-10 font-sans">
          <div className="border-b border-slate-200 pb-2">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Czas trwania</p>
            <p className="font-medium text-sm">{tripSummary.date}</p>
          </div>
          <div className="border-b border-slate-200 pb-2">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Łączny koszt</p>
            <p className="font-bold text-sm text-sky-600">{tripSummary.totalSpent}</p>
          </div>
          <div className="border-b border-slate-200 pb-2">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Średnia dziennie</p>
            <p className="font-medium text-sm">{tripSummary.averagePerDay}</p>
          </div>
          <div className="border-b border-slate-200 pb-2">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Główna kategoria</p>
            <p className="font-medium text-sm">{tripSummary.topCategory}</p>
          </div>
        </div>

        {/* Sekcja Rozliczeń Końcowych */}
        <div className="mt-12">
          <h4 className="font-sans font-bold text-xs uppercase tracking-widest bg-slate-100 p-2 mb-4">Ostateczne rozliczenia między uczestnikami</h4>
          <table className="w-full text-left text-sm font-sans">
            <thead className="text-slate-400 text-[10px] uppercase border-b">
              <tr>
                <th className="py-2">Osoba płacąca</th>
                <th className="py-2">Odbiorca</th>
                <th className="py-2 text-right">Kwota przelewu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 font-medium">Wiktoria</td>
                <td className="py-3 italic">Justyna</td>
                <td className="py-3 text-right font-bold">70.00 EUR</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Oliwier</td>
                <td className="py-3 italic">Justyna</td>
                <td className="py-3 text-right font-bold">50.00 EUR</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Stopka raportu */}
        <div className="mt-20 pt-8 border-t border-slate-100 text-[10px] text-slate-400 text-center font-sans italic">
          Dokument wygenerowany automatycznie przez aplikację EuroPlanner. 🌍
        </div>
      </div>

    </div>
  );
}