"use client";

import React, { useState } from "react";
import { 
  Wallet, 
  Home, 
  Plane, 
  Coffee, 
  Ticket, 
  Plus,
  AlertCircle
} from "lucide-react";
import { useTripUi } from "../TripContext";

// Przykładowe dane kategorii budżetowych
const BUDGET_CATEGORIES = [
  { id: "zakwaterowanie", name: "Zakwaterowanie", icon: Home, spent: 800, limit: 800, color: "bg-[#0a2351]" },
  { id: "transport", name: "Transport", icon: Plane, spent: 450, limit: 500, color: "bg-[#3E67BF]" },
  { id: "jedzenie", name: "Jedzenie", icon: Coffee, spent: 320, limit: 400, color: "bg-[#578bfa]" },
  { id: "atrakcje", name: "Atrakcje i inne", icon: Ticket, spent: 270, limit: 300, color: "bg-[#aab8d5]" },
];

export default function BudgetPage() {
  // Stan przechowujący aktualnie "najechany" (aktywowany) element wykresu
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { isArchived } = useTripUi();

  const totalSpent = BUDGET_CATEGORIES.reduce((acc, cat) => acc + cat.spent, 0);
  const totalLimit = BUDGET_CATEGORIES.reduce((acc, cat) => acc + cat.limit, 0);
  const percentUsed = Math.min(Math.round((totalSpent / totalLimit) * 100), 100);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* SEKCJA 1: GŁÓWNE PODSUMOWANIE I INTERAKTYWNY WYKRES PASKOWY */}
      <div className="bg-[#ffffff] rounded-[40px] p-8 md:p-12 border border-[#5b616e]/10 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-[#5b616e] text-sm font-bold uppercase tracking-wider mb-2">Całkowite wydatki</h2>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold text-[#0a0b0d] tracking-tighter">{totalSpent.toLocaleString()}</span>
              <span className="text-2xl text-[#5b616e] font-medium">/ {totalLimit.toLocaleString()} EUR</span>
            </div>
          </div>
          
          <button
            disabled={isArchived}
            className="px-6 py-3 bg-[#f8f9fa] hover:bg-[#eef0f3] text-[#0a2351] font-bold rounded-[56px] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            Zwiększ budżet
          </button>
        </div>

        {/* --- INTERAKTYWNY WYKRES --- */}
        <div className="relative pt-8">
          {/* Dymek (Tooltip) pojawiający się nad wykresem */}
          <div className="absolute top-0 left-0 w-full flex justify-between text-sm font-bold text-[#5b616e] mb-2">
            <span>0 EUR</span>
            <span>{percentUsed}% wykorzystano</span>
          </div>

          {/* Główny pasek */}
          <div className="w-full h-8 bg-[#f8f9fa] rounded-full flex overflow-hidden mt-6 cursor-pointer">
            {BUDGET_CATEGORIES.map((category) => {
              const widthPercent = (category.spent / totalLimit) * 100;
              const isActive = activeCategory === category.id;
              const isFaded = activeCategory !== null && activeCategory !== category.id;

              return (
                <div
                  key={category.id}
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                  className={`h-full ${category.color} transition-all duration-300 ease-in-out border-r-2 border-white last:border-r-0 relative group`}
                  style={{ 
                    width: `${widthPercent}%`,
                    opacity: isFaded ? 0.3 : 1 // Interakcja: przyciemnianie nieaktywnych
                  }}
                >
                  {/* Wewnętrzny Tooltip pojawiający się na hover */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0a0b0d] text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {category.name}: {category.spent} EUR
                    {/* Trójkącik pod dymkiem */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0a0b0d]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SEKCJA 2: KATEGORIE Z INTERAKTYWNYMI KARTAMI */}
      <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight mb-6">Rozbicie na kategorie</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BUDGET_CATEGORIES.map((category) => {
          const categoryPercent = Math.round((category.spent / category.limit) * 100);
          const isOverBudget = categoryPercent >= 100;
          // Sprawdzamy czy najeżdzamy na element na górnym wykresie
          const isHighlighted = activeCategory === category.id;

          return (
            <div 
              key={category.id}
              onMouseEnter={() => setActiveCategory(category.id)}
              onMouseLeave={() => setActiveCategory(null)}
              className={`bg-[#ffffff] p-6 rounded-[32px] border transition-all duration-300 cursor-pointer
                ${isHighlighted ? 'border-[#0a2351] shadow-md scale-[1.02]' : 'border-[#5b616e]/10 shadow-sm'}
              `}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl text-white ${category.color} transition-transform ${isHighlighted ? 'scale-110' : ''}`}>
                    <category.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a0b0d] text-lg">{category.name}</h4>
                    <p className="text-[#5b616e] text-sm">Limit: {category.limit} EUR</p>
                  </div>
                </div>
                {isOverBudget && (
                  <div className="text-red-500 bg-red-50 p-2 rounded-full animate-pulse">
                    <AlertCircle size={20} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-sm font-bold">
                  <span className={isOverBudget ? "text-red-500" : "text-[#5b616e]"}>
                    Wydano: {category.spent} EUR
                  </span>
                  <span className={isOverBudget ? "text-red-500" : "text-[#0a0b0d]"}>
                    {categoryPercent}%
                  </span>
                </div>
                <div className="w-full bg-[#f8f9fa] h-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isOverBudget ? 'bg-red-500' : category.color}`}
                    style={{ width: `${Math.min(categoryPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}