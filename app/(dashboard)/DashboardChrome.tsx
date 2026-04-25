"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  Settings, 
  LogOut, 
  Bell,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AvatarPicker } from "@/components/ui/AvatarPicker";
import { useAvatar } from "@/hooks/useAvatar";

type DashboardChromeProps = {
  children: React.ReactNode;
  initialDisplayName: string;
  initialAvatarId: string | null;
};

const NAV_ITEMS = [
  { name: "Pulpit", href: "/dashboard", icon: LayoutDashboard },
  { name: "Moje podróże", href: "/trips", icon: Map },
  { name: "Ustawienia", href: "/settings", icon: Settings },
];

export default function DashboardChrome({
  children,
  initialDisplayName,
  initialAvatarId,
}: DashboardChromeProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { avatar, setAvatarId } = useAvatar(initialAvatarId);
  const displayName = initialDisplayName;

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsUserMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isUserMenuOpen]);

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

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((current) => !current);

  return (
    <div className="flex h-screen bg-[#3A67BF] text-white overflow-hidden font-sans relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#eef0f3]/40 bg-[#3E67BF] transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 pt-8 pb-4 flex justify-between items-start gap-4">
          <Link
            href="/dashboard"
            onClick={closeSidebar}
            aria-label="EuroPlanner - przejdź do pulpitu"
            className="inline-flex items-center -m-1 p-1 rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <Logo variant="light" width={170} />
          </Link>

          <button
            onClick={closeSidebar}
            aria-label="Zamknij menu"
            className="shrink-0 p-2 -m-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
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

        <div className="p-4 border-t border-[#eef0f3]/40">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-red-500/20 rounded-full transition-all cursor-pointer font-semibold"
          >
            <LogOut size={20} />
            <span className="text-[15px]">Wyloguj</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        <header className="h-20 border-b border-[#eef0f3]/40 bg-[#3E67BF] flex items-center justify-between gap-4 px-4 sm:px-6 md:px-8 z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/dashboard"
              aria-label="EuroPlanner - przejdź do pulpitu"
              className="inline-flex items-center shrink-0 -ml-1 px-1 py-1 -my-1 rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Logo variant="light" width={90} />
            </Link>
            <button
              onClick={toggleSidebar}
              aria-label="Otwórz menu"
              className="shrink-0 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-[#3E67BF]"></span>
            </button>

            <div className="h-8 w-px bg-[#eef0f3]/40 mx-1 md:mx-2"></div>

            <button
              type="button"
              onClick={() => setIsAvatarPickerOpen(true)}
              aria-label={`Zmień awatar (aktualnie: ${avatar.name})`}
              className="shrink-0 p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <div className="w-9 h-9 rounded-full bg-white border border-[#eef0f3]/40 overflow-hidden ring-2 ring-transparent group-hover:ring-white/40 transition-all">
                <Image
                  src={avatar.src}
                  alt=""
                  width={72}
                  height={72}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((current) => !current)}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                aria-label={`Menu konta: ${displayName}`}
                className="hidden sm:flex items-center gap-1.5 pl-2 pr-2 py-1.5 rounded-full hover:bg-white/10 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span className="text-sm font-bold text-white">
                  {displayName}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-white/70 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    role="menu"
                    aria-label="Menu konta"
                    className="absolute right-0 top-full mt-2 z-50 min-w-[200px] bg-white rounded-2xl shadow-xl border border-[#eef0f3] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <Link
                      href="/settings"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[#0a0b0d] hover:bg-[#f8f9fa] transition-colors text-sm font-medium focus-visible:outline-none focus-visible:bg-[#f8f9fa]"
                    >
                      <Settings size={18} className="text-[#5b616e]" />
                      Ustawienia konta
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium border-t border-[#eef0f3] focus-visible:outline-none focus-visible:bg-red-50"
                    >
                      <LogOut size={18} />
                      Wyloguj się
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#ffffff]">
          {children}
        </main>
      </div>

      <AvatarPicker
        open={isAvatarPickerOpen}
        selectedId={avatar.id}
        onSelect={setAvatarId}
        onClose={() => setIsAvatarPickerOpen(false)}
      />
    </div>
  );
}
