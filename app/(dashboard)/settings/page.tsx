"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function SettingsPage() {
  const router = useRouter(); 

  const [currency, setCurrency] = useState("EUR");
  const [notifications, setNotifications] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      {/* GŁÓWNA ZAWARTOŚĆ STRONY */}
      <div className="p-4 md:p-8 max-w-4xl space-y-8 animate-in fade-in duration-300 relative">
        <div>
          <h1 className="text-3xl font-bold text-white">Ustawienia</h1>
          <p className="text-slate-400">Zarządzaj swoim kontem i preferencjami aplikacji.</p>
        </div>

        {/* SEKCJA: PROFIL */}
        <section className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">Twój Profil</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nazwa użytkownika</label>
                <input 
                  type="text" 
                  defaultValue="admin" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
                <input 
                  type="email" 
                  defaultValue="admin@europlanner.pl" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>
            <button className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-lg transition-all cursor-pointer">
              Zapisz zmiany
            </button>
          </div>
        </section>

        {/* SEKCJA: PREFERENCJE PODRÓŻY */}
        <section className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">Preferencje Podróży</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-white font-medium">Domyślna waluta rozliczeń</p>
                <p className="text-sm text-slate-400">W tej walucie będą wyświetlane Twoje raporty i bilanse.</p>
              </div>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors cursor-pointer min-w-[120px]"
              >
                <option value="EUR">Euro (EUR)</option>
                <option value="PLN">Złoty (PLN)</option>
                <option value="CZK">Korona (CZK)</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-700/50">
              <div>
                <p className="text-white font-medium">Powiadomienia o budżecie</p>
                <p className="text-sm text-slate-400">Otrzymuj alerty po przekroczeniu 90% limitu.</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${notifications ? 'bg-sky-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* SEKCJA: BEZPIECZEŃSTWO */}
        <section className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">Bezpieczeństwo</h3>
          </div>
          <div className="p-6 space-y-4">
           <button 
  onClick={() => router.push("/settings/password")} // Dodaj to przekierowanie!
  className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors cursor-pointer"
>
  Zmień hasło dostępu
</button>
            <div className="pt-4 border-t border-slate-700/50">
              <button 
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors cursor-pointer"
              >
                Usuń konto trwale
              </button>
            </div>
          </div>
        </section>

        {/* STOPKA Z WERSJĄ */}
        <div className="text-center text-slate-600 text-xs py-4">
          EuroPlanner v1.0.0-beta • Projekt Akademicki
        </div>
      </div>

      {/* ⚠️ MODAL WYCIĄGNIĘTY POZA GŁÓWNY DIV (z dodanym z-[100], żeby przykrył wszystko) ⚠️ */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 w-screen h-screen bg-slate-950/80 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
          <div className="bg-slate-800 border border-red-500/50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 p-6 text-center">
            
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ⚠️
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">Usuwanie konta</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Czy na pewno chcesz bezpowrotnie usunąć swoje konto oraz wszystkie zapisane podróże? Tej operacji <strong className="text-slate-200">nie można</strong> cofnąć.
            </p>
            
            <div className="flex gap-3">
                
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Anuluj
              </button>
              <button 
                onClick={() => {
                  alert("Miejsce na logikę kasującą użytkownika!");
                  setIsDeleteModalOpen(false);
                }}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-500/20 cursor-pointer"
              >
                Tak, usuń trwale
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}