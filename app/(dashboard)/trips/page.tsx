"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Rozszerzone dane testowe
const ALL_MOCK_TRIPS = [
  { id: "1", name: "Majówka w Rzymie", status: "W trakcie", budget: 92, dates: "10.05.2026 - 15.05.2026", participants: 4 },
  { id: "2", name: "Weekend w Berlinie", status: "Planowana", budget: 0, dates: "20.06.2026 - 22.06.2026", participants: 2 },
  { id: "3", name: "Narty w Alpach", status: "Zakończona", budget: 100, dates: "15.01.2026 - 22.01.2026", participants: 6 },
  { id: "4", name: "Szlakiem Zamków", status: "Planowana", budget: 15, dates: "12.08.2026 - 18.08.2026", participants: 3 },
  { id: "5", name: "Korfu 2025", status: "Zakończona", budget: 88, dates: "01.07.2025 - 10.07.2025", participants: 5 },
];

export default function TripsListPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Wszystkie statusy");

  const filteredTrips = ALL_MOCK_TRIPS.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Wszystkie statusy" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-300">
        
        {/* NAGŁÓWEK */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Moje Podróże</h1>
            <p className="text-slate-400">Przeglądaj i zarządzaj wszystkimi swoimi wyjazdami.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-95 cursor-pointer"
          >
            + Nowa Podróż
          </button>
        </div>

        {/* WYSZUKIWARKA I FILTRY */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Szukaj podróży po nazwie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors cursor-pointer"
          >
            <option value="Wszystkie statusy">Wszystkie statusy</option>
            <option value="W trakcie">W trakcie</option>
            <option value="Planowana">Planowane</option>
            <option value="Zakończona">Zakończone</option>
          </select>
        </div>

        {/* LISTA PODRÓŻY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => router.push(`/dashboard/trips/${trip.id}`)}
              className="bg-slate-800/40 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-sky-500/50 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                 <span className={`px-3 py-1 text-[10px] uppercase font-bold rounded-full ${
                  trip.status === "W trakcie" ? "bg-green-500/10 text-green-400" :
                  trip.status === "Planowana" ? "bg-blue-500/10 text-blue-400" :
                  "bg-slate-700 text-slate-400"
                }`}>
                  {trip.status}
                </span>
                <span className="text-slate-500 text-xs font-medium">{trip.dates}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                {trip.name}
              </h3>
              
              <div className="flex items-center gap-4 text-slate-400 text-sm mb-6">
                <span className="flex items-center gap-1">👥 {trip.participants}</span>
                <span className="flex items-center gap-1">📍 UE</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  <span>Zużycie budżetu</span>
                  <span className={trip.budget > 90 ? "text-red-400" : ""}>{trip.budget}%</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${trip.budget > 90 ? 'bg-red-500' : 'bg-sky-500'}`}
                    style={{ width: `${trip.budget}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          {filteredTrips.length === 0 && (
            <div className="col-span-full text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <p className="text-slate-500">Nie znaleźliśmy podróży o statusie: <span className="text-white font-bold">{statusFilter}</span>.</p>
            </div>
          )}
        </div>
      </div>

      {/* RENDEROWANIE MODALA */}
      {isModalOpen && <NewTripModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}


// ------------------------------------------------------------------
// KOMPONENT MODALA
// ------------------------------------------------------------------
function NewTripModal({ onClose }: { onClose: () => void }) {
  const [participants, setParticipants] = useState<string[]>([""]);

  const addParticipant = () => setParticipants([...participants, ""]);
  
  const updateParticipant = (index: number, value: string) => {
    const newParts = [...participants];
    newParts[index] = value;
    setParticipants(newParts);
  };

  const removeParticipant = (indexToRemove: number) => {
    setParticipants(participants.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Stwórz nową podróż</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer text-xl transition-colors">✕</button>
        </div>
        
        <form className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Nazwa podróży</label>
              <input 
                type="text" 
                placeholder="np. Eurotrip 2026"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Główna waluta</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors">
                <option value="EUR">Euro (EUR) - Domyślna</option>
                <option value="PLN">Złoty (PLN)</option>
                <option value="CZK">Korona czeska (CZK)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-400">Uczestnicy</label>
            
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {participants.map((p, index) => (
                <div key={index} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-200">
                  <input 
                    type="text"
                    value={p}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    placeholder={`Imię uczestnika ${index + 1}`}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  {/* ZMIANA TUTAJ: index > 0 oznacza, że ikona kosza NIE pokaże się przy pierwszej osobie */}
                  {index > 0 && (
                    <button 
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Usuń uczestnika"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={addParticipant}
              className="text-sky-400 text-sm font-medium hover:text-sky-300 transition-colors cursor-pointer mt-2 inline-block"
            >
              + Dodaj kolejną osobę
            </button>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              Stwórz podróż
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}