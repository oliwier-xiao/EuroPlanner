"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Stany do kontrolowania widoczności haseł
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert("Hasło zostało pomyślnie zmienione!");
      setLoading(false);
      router.push("/settings");
    }, 1500);
  };

  // Ikonka otwartego oka
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  // Ikonka przekreślonego oka
  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <button 
          onClick={() => router.push("/settings")}
          className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors cursor-pointer mb-4"
        >
          ← Powrót do ustawień
        </button>
        <h1 className="text-3xl font-bold text-white">Zmiana hasła</h1>
        <p className="text-slate-400 text-sm">
          Dla bezpieczeństwa Twojego konta, używaj silnego hasła (min. 8 znaków, cyfry i symbole).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 md:p-8 space-y-6 shadow-xl">
        <div className="space-y-4">
          
          {/* OBECNE HASŁO */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">
              Obecne hasło
            </label>
            <div className="relative">
              <input 
                type={showCurrent ? "text" : "password"} 
                required
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
              <button 
                type="button" 
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
              >
                {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-700/50 my-2" />

          {/* NOWE HASŁO */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">
              Nowe hasło
            </label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"} 
                required
                placeholder="Min. 8 znaków"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
              <button 
                type="button" 
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
              >
                {showNew ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* POTWIERDŹ NOWE HASŁO */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">
              Powtórz nowe hasło
            </label>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"} 
                required
                placeholder="Potwierdź nowe hasło"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
          >
            {loading ? "Przetwarzanie..." : "Zaktualizuj hasło"}
          </button>
          <button 
            type="button"
            onClick={() => router.push("/settings")}
            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}