"use client";

import React, { useState } from "react";

// Proste typy dla naszego mocka
type RoutePoint = {
  id: string;
  location: string;
  timeToNext?: string; // np. "2h 30m"
  transport?: string;  // np. "Samochód", "Pociąg", "Samolot"
};

const INITIAL_ROUTE: RoutePoint[] = [
  { id: "1", location: "Warszawa, Polska", timeToNext: "1h 45m", transport: "✈️ Samolot" },
  { id: "2", location: "Rzym, Włochy", timeToNext: "3h 10m", transport: "🚄 Pociąg" },
  { id: "3", location: "Neapol, Włochy", timeToNext: null, transport: null },
];

export default function RoutePage() {
  const [route, setRoute] = useState<RoutePoint[]>(INITIAL_ROUTE);
  const [newLocation, setNewLocation] = useState("");

  // Dodawanie nowego punktu na koniec trasy
  const handleAddPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.trim()) return;

    const newPoint: RoutePoint = {
      id: Date.now().toString(),
      location: newLocation,
    };

    // Jeśli jest już jakiś punkt, aktualizujemy jego "czas do następnego" na domyślny
    if (route.length > 0) {
      const updatedRoute = [...route];
      updatedRoute[updatedRoute.length - 1].timeToNext = "2h 00m";
      updatedRoute[updatedRoute.length - 1].transport = "🚗 Samochód";
      setRoute([...updatedRoute, newPoint]);
    } else {
      setRoute([newPoint]);
    }
    
    setNewLocation("");
  };

  // Przesuwanie punktów (zmiana kolejności)
  const movePoint = (index: number, direction: 'up' | 'down') => {
    const newRoute = [...route];
    if (direction === 'up' && index > 0) {
      [newRoute[index - 1], newRoute[index]] = [newRoute[index], newRoute[index - 1]];
    } else if (direction === 'down' && index < newRoute.length - 1) {
      [newRoute[index], newRoute[index + 1]] = [newRoute[index + 1], newRoute[index]];
    }
    setRoute(newRoute);
  };

  // Usuwanie punktu
  const removePoint = (id: string) => {
    setRoute(route.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* FORMULARZ DODAWANIA PUNKTU */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Dodaj przystanek</h3>
        <form onSubmit={handleAddPoint} className="flex gap-3">
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="np. Florencja, Włochy"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={!newLocation.trim()}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 text-white font-bold rounded-lg transition-all cursor-pointer"
          >
            + Dodaj do trasy
          </button>
        </form>
      </div>

      {/* OŚ CZASU (TIMELINE) Z TRASĄ */}
      <div className="bg-slate-800/30 p-6 sm:p-8 rounded-2xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-8">Twój plan podróży</h3>
        
        {route.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Trasa jest pusta. Dodaj swój pierwszy przystanek wyżej!</p>
        ) : (
          <div className="relative pl-4 sm:pl-8">
            {/* Pionowa linia łącząca */}
            <div className="absolute left-6 sm:left-10 top-6 bottom-6 w-0.5 bg-slate-700 z-0"></div>

            {route.map((point, index) => (
              <div key={point.id} className="relative z-10 mb-8 last:mb-0">
                <div className="flex items-start gap-4 sm:gap-6">
                  
                  {/* Kółko na osi czasu */}
                  <div className="w-5 h-5 mt-1.5 rounded-full bg-slate-900 border-4 border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)] shrink-0"></div>

                  {/* Karta lokacji */}
                  <div className="flex-1 bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 group hover:border-sky-500/50 transition-colors">
                    <div>
                      <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">Przystanek {index + 1}</p>
                      <h4 className="text-lg font-bold text-white">{point.location}</h4>
                    </div>
                    
                    {/* Przyciski akcji (góra/dół/usuń) */}
                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => movePoint(index, 'up')} disabled={index === 0} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer">
                        ↑
                      </button>
                      <button onClick={() => movePoint(index, 'down')} disabled={index === route.length - 1} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer">
                        ↓
                      </button>
                      <button onClick={() => removePoint(point.id)} className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 cursor-pointer ml-2">
                        ✕
                      </button>
                    </div>
                  </div>
                </div>

                {/* Informacja o transporcie pomiędzy punktami */}
                {point.timeToNext && (
                  <div className="ml-8 sm:ml-12 mt-4 flex items-center gap-3 text-sm text-slate-400">
                    <span className="px-3 py-1 bg-slate-800 rounded-md border border-slate-700">
                      {point.transport}
                    </span>
                    <span>Szacowany czas: <span className="text-slate-300 font-medium">{point.timeToNext}</span></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}