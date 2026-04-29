"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Clock, 
  Plus, 
  Map as MapIcon, 
  Plane, 
  Coffee, 
  Camera, 
  Home,
  Navigation2,
  MoreVertical,
  CalendarDays
} from "lucide-react";

// Przykładowe dane trasy (Itinerarz)
const MOCK_ROUTE = [
  { id: "1", day: "Dzień 1", date: "10 Maj 2026", items: [
    { id: "1a", type: "flight", title: "Lot Warszawa - Rzym", time: "10:00", location: "Lotnisko Chopina (WAW)", icon: Plane, color: "bg-[#3E67BF]" },
    { id: "1b", type: "hotel", title: "Zameldowanie w apartamencie", time: "14:30", location: "Trastevere, Rzym", icon: Home, color: "bg-[#0a2351]" },
    { id: "1c", type: "food", title: "Późny obiad", time: "16:00", location: "Trattoria Da Enzo", icon: Coffee, color: "bg-[#aab8d5]", text: "Koniecznie spróbować Cacio e Pepe!" },
  ]},
  { id: "2", day: "Dzień 2", date: "11 Maj 2026", items: [
    { id: "2a", type: "sightseeing", title: "Koloseum i Forum Romanum", time: "09:00", location: "Piazza del Colosseo", icon: Camera, color: "bg-[#578bfa]", text: "Bilety kupione (zeskanowane w zakładce Wydatki)." },
    { id: "2b", type: "sightseeing", title: "Panteon i Fontanna di Trevi", time: "15:00", location: "Centro Storico", icon: Camera, color: "bg-[#578bfa]" },
  ]}
];

export default function RoutePage() {
  const [activeDay, setActiveDay] = useState("Dzień 1");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* NAGŁÓWEK */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#ffffff] p-8 rounded-[40px] border border-[#5b616e]/10 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-[#0a0b0d] tracking-tight mb-2">Plan Trasy</h2>
          <p className="text-[#5b616e]">Zarządzaj harmonogramem i punktami na mapie.</p>
        </div>
        <button className="w-full md:w-auto px-8 py-4 bg-[#0a2351] hover:bg-[#578bfa] text-white font-bold rounded-[56px] transition-colors flex items-center justify-center gap-2">
          <Plus size={20} />
          Dodaj punkt trasy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEWA KOLUMNA: HARMONOGRAM (TIMELINE) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Wybór dnia (Tabs) */}
          <div className="flex bg-[#ffffff] p-1.5 rounded-[56px] border border-[#5b616e]/10 shadow-sm overflow-x-auto no-scrollbar">
            {MOCK_ROUTE.map((day) => (
              <button
                key={day.id}
                onClick={() => setActiveDay(day.day)}
                className={`flex items-center gap-2 px-6 py-3 rounded-[56px] text-sm font-bold whitespace-nowrap transition-all ${
                  activeDay === day.day 
                    ? "bg-[#0a2351] text-white shadow-md" 
                    : "text-[#5b616e] hover:text-[#0a2351] hover:bg-[#f8f9fa]"
                }`}
              >
                <CalendarDays size={16} />
                {day.day} <span className="font-normal text-xs opacity-80">({day.date})</span>
              </button>
            ))}
          </div>

          {/* Oś czasu (Timeline) dla wybranego dnia */}
          <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-6 md:p-10 relative">
            
            {/* Pionowa linia tła */}
            <div className="absolute left-[54px] md:left-[78px] top-10 bottom-10 w-1 bg-[#eef0f3] rounded-full z-0" />

            <div className="space-y-8 relative z-10">
              {MOCK_ROUTE.find(d => d.day === activeDay)?.items.map((item, index, arr) => (
                <div key={item.id} className="flex gap-4 md:gap-8 group">
                  
                  {/* Znacznik czasu i ikona */}
                  <div className="flex flex-col items-center gap-2 shrink-0 w-16 md:w-20 pt-1">
                    <span className="text-sm font-bold text-[#0a0b0d]">{item.time}</span>
                    <div className={`w-12 h-12 rounded-full text-white flex items-center justify-center shadow-md ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon size={20} />
                    </div>
                  </div>

                  {/* Karta z detalami punktu */}
                  <div className="flex-1 bg-[#f8f9fa] border border-transparent group-hover:border-[#0a2351]/10 group-hover:bg-[#ffffff] group-hover:shadow-sm transition-all rounded-[32px] p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-[#0a0b0d] tracking-tight group-hover:text-[#3E67BF] transition-colors">
                        {item.title}
                      </h3>
                      <button className="text-[#5b616e] hover:text-[#0a0b0d] hover:bg-[#eef0f3] p-2 rounded-full transition-colors -mt-2 -mr-2">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-[#5b616e] font-medium mb-3">
                      <MapPin size={16} className="text-[#0a2351]" />
                      {item.location}
                    </div>

                    {item.text && (
                      <p className="text-sm text-[#5b616e] bg-[#ffffff] p-3 rounded-2xl border border-[#5b616e]/10 mt-4">
                        {item.text}
                      </p>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA: MAPA (Placeholder) */}
        <div className="lg:col-span-1">
          <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-4 h-[400px] lg:h-[calc(100%-2rem)] sticky top-24 flex flex-col">
            
            {/* Header mapy */}
            <div className="flex items-center gap-3 px-4 py-2 mb-4">
              <div className="p-2 bg-[#f8f9fa] rounded-xl text-[#0a2351]">
                <MapIcon size={20} />
              </div>
              <h3 className="font-bold text-[#0a0b0d]">Podgląd mapy</h3>
            </div>

            {/* Miejsce na integrację np. z Google Maps / Mapbox */}
            <div className="flex-1 bg-[#f8f9fa] rounded-[32px] border border-[#5b616e]/10 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230a2351\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} 
              />
              <Navigation2 size={48} className="text-[#3E67BF] mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
              <p className="text-[#5b616e] font-medium text-sm z-10">
                Tutaj pojawi się interaktywna mapa z pinezkami wybranego dnia.
              </p>
              <button className="mt-6 px-6 py-3 bg-[#ffffff] border border-[#5b616e]/20 hover:border-[#0a2351] text-[#0a0b0d] font-bold rounded-[56px] transition-all text-sm z-10 shadow-sm">
                Otwórz pełny ekran
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}