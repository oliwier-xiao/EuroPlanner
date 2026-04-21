"use client";

import React from "react";
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  PieChart, 
  Users, 
  Calendar,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

export default function ReportPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* NAGŁÓWEK I PRZYCISKI EKSPORTU */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[#ffffff] p-8 md:p-12 rounded-[40px] border border-[#5b616e]/10 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 text-[#f8f9fa] z-0">
          <FileText size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#eef0f3] text-[#0a2351] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <CheckCircle2 size={16} />
            Podróż Zakończona
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a0b0d] tracking-tighter mb-4">
            Raport końcowy
          </h2>
          <p className="text-[#5b616e] text-lg max-w-md">
            Kompletne podsumowanie kosztów, rozliczeń i statystyk z Twojej podróży.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10">
          <button className="px-8 py-4 bg-[#f8f9fa] hover:bg-[#eef0f3] text-[#0a2351] font-bold rounded-[56px] transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-[#0a2351]/10">
            <FileSpreadsheet size={20} />
            Eksportuj CSV
          </button>
          <button className="px-8 py-4 bg-[#0a2351] hover:bg-[#578bfa] text-white font-bold rounded-[56px] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#0a2351]/20">
            <Download size={20} />
            Pobierz PDF
          </button>
        </div>
      </div>

      {/* KLUCZOWE STATYSTYKI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm flex flex-col justify-between">
          <div className="p-3 bg-[#f8f9fa] text-[#0a2351] rounded-2xl w-max mb-6">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Całkowity koszt</h3>
            <div className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">
              1 840 <span className="text-xl text-[#5b616e]">EUR</span>
            </div>
            <p className="text-sm font-medium text-[#5b616e] mt-2">Z zaplanowanych 2 000 EUR</p>
          </div>
        </div>

        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm flex flex-col justify-between">
          <div className="p-3 bg-[#f8f9fa] text-[#0a2351] rounded-2xl w-max mb-6">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Koszt na osobę</h3>
            <div className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">
              460 <span className="text-xl text-[#5b616e]">EUR</span>
            </div>
            <p className="text-sm font-medium text-[#5b616e] mt-2">Średnio dla 4 uczestników</p>
          </div>
        </div>

        <div className="bg-[#ffffff] p-8 rounded-[32px] border border-[#5b616e]/10 shadow-sm flex flex-col justify-between">
          <div className="p-3 bg-[#f8f9fa] text-[#0a2351] rounded-2xl w-max mb-6">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Czas trwania</h3>
            <div className="text-4xl font-bold text-[#0a0b0d] tracking-tighter">
              5 <span className="text-xl text-[#5b616e]">dni</span>
            </div>
            <p className="text-sm font-medium text-[#5b616e] mt-2">10.05.2026 - 15.05.2026</p>
          </div>
        </div>
      </div>

      {/* PODSUMOWANIE KATEGORII I ROZLICZEŃ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Lewa strona: Kategorie */}
        <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <PieChart className="text-[#3E67BF]" size={24} />
            <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight">Struktura wydatków</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { name: "Zakwaterowanie", amount: 800, percent: 43, color: "bg-[#0a2351]" },
              { name: "Transport", amount: 450, percent: 24, color: "bg-[#3E67BF]" },
              { name: "Jedzenie", amount: 320, percent: 17, color: "bg-[#578bfa]" },
              { name: "Atrakcje", amount: 270, percent: 16, color: "bg-[#aab8d5]" },
            ].map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-[#0a0b0d]">{cat.name}</span>
                  <div className="text-right">
                    <span className="font-bold text-[#0a0b0d] block">{cat.amount} EUR</span>
                    <span className="text-xs text-[#5b616e] font-medium">{cat.percent}% całości</span>
                  </div>
                </div>
                <div className="w-full bg-[#f8f9fa] h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prawa strona: Aktywność */}
        <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-8 md:p-10 flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 bg-[#eef0f3] rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={48} className="text-[#3E67BF]" />
          </div>
          <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight mb-4">Wszystko rozliczone!</h3>
          <p className="text-[#5b616e] mb-8 max-w-sm">
            Wszyscy uczestnicy uregulowali swoje długi. Wygeneruj i pobierz raport, aby zachować go w swoim archiwum.
          </p>
          <div className="w-full p-6 bg-[#f8f9fa] rounded-[24px] border border-[#5b616e]/10 text-left space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#5b616e] font-bold">Łączna liczba paragonów:</span>
              <span className="text-[#0a0b0d] font-bold">24 szt.</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#5b616e] font-bold">Zeskanowane przez OCR:</span>
              <span className="text-[#0a0b0d] font-bold">18 szt.</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#5b616e] font-bold">Najdroższy wydatek:</span>
              <span className="text-[#0a0b0d] font-bold">450 EUR</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}