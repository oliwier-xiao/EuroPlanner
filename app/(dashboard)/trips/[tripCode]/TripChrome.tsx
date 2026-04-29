"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Map as MapIcon,
  Users2,
  FileText,
  ChevronLeft,
} from "lucide-react";

const TRIP_NAV_ITEMS = [
  { name: "Podsumowanie", href: "", icon: LayoutDashboard },
  { name: "Budżet", href: "/budget", icon: Wallet },
  { name: "Wydatki", href: "/expenses", icon: Receipt },
  { name: "Trasa", href: "/route", icon: MapIcon },
  { name: "Rozliczenia", href: "/settlements", icon: Users2 },
  { name: "Raport", href: "/report", icon: FileText },
];

type TripChromeProps = {
  children: React.ReactNode;
  title: string;
  tripCode: string;
};

export default function TripChrome({ children, title, tripCode }: TripChromeProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const fullPath = `/trips/${tripCode}${href}`;
    return pathname === fullPath;
  };

  return (
    <div className="flex flex-col h-full bg-[#ffffff] animate-in fade-in duration-500">
      {/* GÓRNY PASEK NAWIGACJI WEWNĄTRZ PODRÓŻY.
          z-20 < z-40 (DashboardChrome header), żeby dropdown user-menu (w header)
          nie był chowany za tym sticky paskiem przy scrollu. */}
      <div className="border-b border-[#5b616e]/10 bg-[#ffffff] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-4 pt-6 pb-2">
            <Link
              href="/trips"
              aria-label="Wróć do listy podróży"
              className="p-2 hover:bg-[#f8f9fa] rounded-full text-[#5b616e] transition-colors"
            >
              <ChevronLeft size={20} />
            </Link>
            <h2 className="text-xl font-bold text-[#0a0b0d] tracking-tight">
              {title}
            </h2>
          </div>

          <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {TRIP_NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={`/trips/${tripCode}${item.href}`}
                  className={`
                    flex items-center gap-2 px-6 py-3 text-sm font-bold whitespace-nowrap transition-all rounded-[56px]
                    ${active
                      ? "bg-[#0a2351] text-white shadow-md shadow-[#0a2351]/10"
                      : "text-[#5b616e] hover:text-[#0a2351] hover:bg-[#f8f9fa]"
                    }
                  `}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
