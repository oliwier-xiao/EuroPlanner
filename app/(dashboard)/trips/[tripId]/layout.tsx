"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";

export default function TripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId;

  // W przyszłości pobierzemy te dane z bazy na podstawie tripId
  const tripName = "Majówka w Rzymie"; 

const tabs = [
    { id: "summary", label: "Podsumowanie", path: `/trips/${tripId}` },
    { id: "expenses", label: "Wydatki & OCR", path: `/trips/${tripId}/expenses` },
    { id: "route", label: "Plan trasy", path: `/trips/${tripId}/route` },
    { id: "settlements", label: "Rozliczenia", path: `/trips/${tripId}/settlements` },
    { id: "budget", label: "Budżet", path: `/trips/${tripId}/budget` },
    { id: "report", label: "Raporty", path: `/trips/${tripId}/report` },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* POWRÓT I NAGŁÓWEK */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => router.push("/dashboard")}
          className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors cursor-pointer w-fit"
        >
          ← Powrót do pulpitu
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white">{tripName}</h1>
            <p className="text-slate-400 mt-1">ID Podróży: <span className="text-sky-400 font-mono">{tripId}</span></p>
          </div>
        </div>
      </div>

      {/* PRAWDZIWE ZAKŁADKI (ROUTING) */}
      <div className="flex border-b border-slate-700 gap-6 overflow-x-auto">
        {tabs.map((tab) => {
          // Sprawdzamy czy dany link jest aktywny, żeby go podświetlić
          const isActive = pathname === tab.path;
          return (
            <Link
              key={tab.id}
              href={tab.path}
              className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap ${
                isActive ? "text-sky-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400" />
              )}
            </Link>
          );
        })}
      </div>

      {/* TREŚĆ ZALEŻNA OD FOLDERU (Podsumowanie, route, expenses, itd.) */}
      <div className="py-4">
        {children}
      </div>
    </div>
  );
}