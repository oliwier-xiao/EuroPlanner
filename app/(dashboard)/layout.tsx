"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  Settings, 
  LogOut, 
  Bell,
  User,
  Menu,
  X
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
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    router.push("/login");
  };

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
        <div className="p-8 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-3 group" onClick={closeSidebar}>
            <div className="w-8 h-8 bg-[#0a2351] rounded-lg flex items-center justify-center">
              <span className="text-[#ffffff] font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter leading-none text-[#ffffff]">
              EuroPlanner
            </span>
          </Link>
          
          <button 
            onClick={closeSidebar}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
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
        
        
        <header className="h-20 border-b border-[#eef0f3]/40 bg-[#3E67BF] flex items-center justify-between px-6 md:px-8 z-30">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar} 
              className="p-2 -ml-2 text-white/70 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
            >
              <Menu size={28} />
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-[#3E67BF]"></span>
            </button>
            
            
            <div className="h-8 w-px bg-[#eef0f3]/40 mx-1 md:mx-2"></div>
            
            
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-white/10 transition-all cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-[#eef0f3]/40 flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <span className="hidden sm:block text-sm font-bold text-white pr-2">Michał</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#ffffff]">
          {children}
        </main>
      </div>
    </div>
  );
}