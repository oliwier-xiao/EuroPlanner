"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Funkcja pomocnicza do generowania klas dla linków
  const getLinkClasses = (path: string) => {
    // Sprawdzamy dokładne dopasowanie dla /dashboard, a dla reszty czy ścieżka się od tego zaczyna
    const isActive = path === "/dashboard" 
      ? pathname === "/dashboard" 
      : pathname.startsWith(path);

    return `px-4 py-3 rounded-xl font-medium transition-all ${
      isActive 
        ? "bg-sky-500/20 text-sky-400" 
        : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-200 font-sans">
      
      {/* Pasek boczny (Sidebar) */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">E</div>
            <h2 className="text-xl font-bold text-white tracking-tight">EuroPlanner</h2>
          </div>

          <nav className="flex flex-col gap-2">
            <Link href="/dashboard" className={getLinkClasses("/dashboard")}>
              <div className="flex items-center gap-3">
                <span>🏠</span> Pulpit
              </div>
            </Link>
            
            {/* Poprawione na czyste /trips */}
            <Link href="/trips" className={getLinkClasses("/trips")}>
              <div className="flex items-center gap-3">
                <span>🌍</span> Moje Podróże
              </div>
            </Link>
            
            {/* Poprawione na czyste /settings */}
            <Link href="/settings" className={getLinkClasses("/settings")}>
              <div className="flex items-center gap-3">
                <span>⚙️</span> Ustawienia
              </div>
            </Link>
          </nav>
        </div>

        {/* Sekcja wylogowania */}
        <div className="p-6 border-t border-slate-700">
          <form action="/api/auth/logout" method="POST">
            <button className="w-full px-4 py-2 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-white rounded-lg transition-all cursor-pointer font-medium">
              Wyloguj się
            </button>
          </form>
        </div>
      </aside>

      {/* Główna zawartość */}
      <main className="flex-1 max-h-screen overflow-y-auto relative">
        {children}
      </main>

    </div>
  );
}