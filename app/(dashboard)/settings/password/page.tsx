"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  Save, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  
  // Stany dla widoczności haseł
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Stany dla wartości z formularza
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Stan dla błędu
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePassword = () => {
    setError(null);

    // 1. Sprawdzamy czy wszystkie pola są wypełnione
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Proszę wypełnić wszystkie pola formularza.");
      return;
    }

    // 2. Sprawdzamy czy nowe hasła są identyczne
    if (newPassword !== confirmPassword) {
      setError("Nowe hasła nie są identyczne.");
      return;
    }

    // 3. Sprawdzamy minimalną długość (dobra praktyka)
    if (newPassword.length < 8) {
      setError("Nowe hasło musi mieć co najmniej 8 znaków.");
      return;
    }

    // --- JEŚLI WSZYSTKO JEST ZGODNE ---
    
    // Wyświetlamy popup przeglądarkowy
    window.alert("Hasło zostało pomyślnie zmienione!");
    
    // Dopiero po kliknięciu "OK" w popuupie wracamy do ustawień
    router.back();
  };

  return (
    <div className="pt-10 md:pt-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto pb-20 px-4">
      
      {/* PRZYCISK POWROTU */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#5b616e] hover:text-[#0a2351] font-bold transition-colors group cursor-pointer"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Powrót do ustawień
      </button>

      {/* NAGŁÓWEK */}
      <div>
        <h2 className="text-3xl font-bold text-[#0a0b0d] tracking-tight mb-2">Bezpieczeństwo hasła</h2>
        <p className="text-[#5b616e]">Ustaw unikalne hasło, aby chronić swoje konto.</p>
      </div>

      {/* KARTA FORMULARZA */}
      <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/10 shadow-sm p-8 md:p-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-[#f8f9fa] rounded-2xl text-[#0a2351]">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight">Zmień hasło</h3>
        </div>

        <div className="space-y-8">
          {/* OBECNE HASŁO */}
          <div className="space-y-2 relative">
            <label className="text-[11px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Obecne hasło</label>
            <div className="relative">
              <input 
                type={showCurrent ? "text" : "password"} 
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#5b616e]/10 rounded-[56px] px-6 py-4 text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors pr-14"
              />
              <button 
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5b616e] hover:text-[#0a2351] transition-colors cursor-pointer"
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="h-px bg-[#5b616e]/10 w-full" />

          {/* NOWE HASŁO */}
          <div className="space-y-2 relative">
            <label className="text-[11px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Nowe hasło</label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"} 
                placeholder="Minimum 8 znaków"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#5b616e]/10 rounded-[56px] px-6 py-4 text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors pr-14"
              />
              <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5b616e] hover:text-[#0a2351] transition-colors cursor-pointer"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* POTWIERDŹ NOWE HASŁO */}
          <div className="space-y-2 relative">
            <label className="text-[11px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Powtórz nowe hasło</label>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"} 
                placeholder="Powtórz nowe hasło"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#f8f9fa] border border-[#5b616e]/10 rounded-[56px] px-6 py-4 text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors pr-14"
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#5b616e] hover:text-[#0a2351] transition-colors cursor-pointer"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* BŁĄD WALIDACJI */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-2xl text-sm font-bold animate-in fade-in zoom-in duration-300">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* PRZYCISKI AKCJI */}
          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <button 
              type="button"
              onClick={() => router.back()}
              className="w-full px-8 py-4 bg-[#f8f9fa] hover:bg-[#eef0f3] text-[#0a2351] font-bold rounded-[56px] transition-colors cursor-pointer"
            >
              Anuluj
            </button>
            <button 
              type="button"
              onClick={handleUpdatePassword}
              className="w-full px-8 py-4 bg-[#0a2351] hover:bg-[#578bfa] text-white font-bold rounded-[56px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0a2351]/10 cursor-pointer"
            >
              <Save size={20} />
              Zapisz zmiany
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}