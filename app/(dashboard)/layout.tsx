"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  Settings, 
  LogOut, 
  Bell,
  User
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Pulpit", href: "/dashboard", icon: LayoutDashboard },
  { name: "Moje podróże", href: "/trips", icon: Map },
  { name: "Ustawienia", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

const handleLogout = async () => {
    console.log("Wylogowywanie użytkownika...");
    
    // Odpytujemy endpoint, który usuwa autoryzację/ciasteczka
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error("Błąd podczas wylogowywania:", e);
    }

    // Odświeżamy stan routera i wracamy na logowanie
    router.refresh();
    router.push("/login");
  };

  return (
    // Główny kontener: niebieskie tło i biały tekst dla nawigacji
    <div className="flex h-screen bg-[#3A67BF] text-white overflow-hidden font-sans">
      {/* SIDEBAR - Nowy, mocny niebieski */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-[#3E67BF]">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            {/* Logo odwrócone: białe tło, niebieska litera */}
            <div className="w-8 h-8 bg-[#0a2351] rounded-lg flex items-center justify-center">
              <span className="text-[#ffffff] font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter leading-none text-[#ffffff]">
              EuroPlanner
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group ${
                  isActive 
                    ? "bg-white text-[#3E67BF] shadow-md" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-[#3E67BF]" : "text-white/70 group-hover:text-white"} />
                <span className="font-semibold text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-red-500/20 rounded-full transition-all cursor-pointer font-semibold"
          >
            <LogOut size={20} />
            <span className="text-[15px]">Wyloguj</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR - Nowy, mocny niebieski */}
        <header className="h-20 border-b border-white/10 bg-[#3E67BF] flex items-center justify-between px-8 z-50">
          <div className="md:hidden flex items-center gap-3">
             <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-[#3E67BF] font-bold text-sm">
              E
            </div>
          </div>
          
          <div className="flex-1 max-w-xl mx-4 hidden sm:block"></div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-[#3E67BF]"></span>
            </button>
            
            <div className="h-8 w-px bg-white/20 mx-2"></div>
            
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/10 transition-all cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/10 flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <span className="hidden sm:block text-sm font-bold text-white pr-2">Michał</span>
            </button>
          </div>
        </header>

        {/* MAIN CONTENT - Białe tło dla idealnego kontrastu z niebieską nawigacją */}
        <main className="flex-1 overflow-y-auto bg-[#ffffff]">
          {children}
        </main>
      </div>
    </div>
  );
}
