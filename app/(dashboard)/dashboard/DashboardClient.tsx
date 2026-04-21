"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const MOCK_TRIPS = [
  { id: "1", name: "Majówka w Rzymie", status: "W trakcie", budget: 92, spent: "1 840", total: "2 000" },
  { id: "2", name: "Weekend w Berlinie", status: "Planowana", budget: 0, spent: "0", total: "1 200" },
];

const RECENT_ACTIVITY = [
  { id: 1, user: "Justyna", action: "dodała wydatek", item: "Kolacja w Trattoria", amount: "45 EUR", date: "2h temu" },
  { id: 2, user: "Wiktoria", action: "zmieniła trasę", item: "Rzym → Florencja", amount: null, date: "5h temu" },
  { id: 3, user: "Oliwier", action: "zeskanował paragon", item: "Bilety do Koloseum", amount: "120 EUR", date: "Wczoraj" },
];

type DashboardClientProps = {
  userName: string | null;
};

export default function DashboardClient({ userName }: DashboardClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const greetingName = userName
    ? userName.charAt(0).toLocaleUpperCase("pl-PL") + userName.slice(1)
    : "Podróżniku";

  return (
    <div className="p-4 md:p-8 space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Witaj, {greetingName}! 🌍</h1>
          <p className="text-slate-400">Masz dzisiaj 1 aktywną podróż i 3 nowe powiadomienia.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-95 cursor-pointer"
        >
          + Nowa Podróż
        </button>
      </div>

      {MOCK_TRIPS.some(t => t.budget > 90) && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl flex items-center gap-4 text-red-400">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold">Uwaga: Przekroczenie budżetu!</p>
            <p className="text-sm opacity-90">W podróży &quot;Majówka w Rzymie&quot; wykorzystano już ponad 90% środków.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Łączne wydatki", value: "3 250 EUR", sub: "We wszystkich podróżach" },
          { label: "Aktywne podróże", value: "1", sub: "W trakcie realizacji" },
          { label: "Twoje saldo", value: "+120 EUR", sub: "Znajomi są Ci winni" },
          { label: "Skaner OCR", value: "15", sub: "Zeskanowanych paragonów" },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800 p-5 rounded-2xl border border-slate-700/50">
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Twoje Podróże</h2>
            <button
              onClick={() => router.push("/trips")}
              className="text-sky-400 text-sm hover:underline cursor-pointer transition-colors"
            >
              Zobacz wszystkie
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_TRIPS.map((trip) => (
              <div
                key={trip.id}
                onClick={() => router.push(`/trips/${trip.id}`)}
                className="bg-slate-800/40 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-sky-500/10 rounded-lg text-xl group-hover:scale-110 transition-transform">📍</div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    trip.status === "W trakcie" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"
                  }`}>
                    {trip.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{trip.name}</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Budżet: {trip.spent} / {trip.total} EUR</span>
                    <span className={trip.budget > 90 ? "text-red-400 font-bold" : ""}>{trip.budget}%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${trip.budget > 90 ? 'bg-red-500' : 'bg-sky-500'}`}
                      style={{ width: `${trip.budget}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4">Ostatnia aktywność</h2>
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((act) => (
                <div key={act.id} className="flex gap-3 text-sm border-l-2 border-slate-700 pl-4 py-1">
                  <div className="flex-1">
                    <p className="text-slate-300">
                      <span className="font-bold text-white">{act.user}</span> {act.action}
                    </p>
                    <p className="text-slate-500 text-xs italic">{act.item}</p>
                    {act.amount && <p className="text-sky-400 font-bold text-xs mt-1">{act.amount}</p>}
                  </div>
                  <span className="text-slate-600 text-[10px] uppercase font-bold">{act.date}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4">Struktura wydatków</h2>
            <div className="space-y-3">
              {[
                { cat: "Jedzenie", p: 45, color: "bg-orange-400" },
                { cat: "Transport", p: 30, color: "bg-sky-400" },
                { cat: "Noclegi", p: 25, color: "bg-purple-400" },
              ].map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{c.cat}</span>
                    <span>{c.p}%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.p}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {isModalOpen && (
        <NewTripModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

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
