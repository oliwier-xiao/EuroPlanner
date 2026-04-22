"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard, 
  Lock, 
  Trash2,
  Save,
  Camera,
  ChevronRight,
  AlertCircle
} from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Michał");
  const [email, setEmail] = useState("michal@example.com");
  const [currency, setCurrency] = useState("EUR");
  const [notifications, setNotifications] = useState(true);

 
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDeleteModalOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [isDeleteModalOpen, countdown]);

  const openDeleteModal = () => {
    setCountdown(5);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="pt-10 md:pt-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20 px-4">
      
      
      <div>
        <h2 className="text-3xl font-bold text-[#0a0b0d] tracking-tight mb-2">Ustawienia konta</h2>
        <p className="text-[#5b616e]">Zarządzaj swoim profilem i preferencjami.</p>
      </div>

      <div className="space-y-6">
        
        
        <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/40 shadow-sm p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#f8f9fa] rounded-xl text-[#0a2351]">
              <User size={24} />
            </div>
            <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight">Twój Profil</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div 
              className="relative group cursor-pointer shrink-0" 
              onClick={handleAvatarClick}
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full object-cover shadow-inner"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#3E67BF] text-white flex items-center justify-center text-3xl font-bold shadow-inner">
                  {name.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-[#0a0b0d]/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white" size={24} />
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="flex-1 w-full space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Imię i nazwisko</label>
                  
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#5b616e]/40 rounded-[56px] px-6 py-4 text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Adres E-mail</label>
                  
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f8f9fa] border border-[#5b616e]/40 rounded-[56px] px-6 py-4 text-[#0a0b0d] focus:outline-none focus:border-[#0a2351] transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="px-8 py-3 bg-[#f8f9fa] hover:bg-[#eef0f3] text-[#0a2351] font-bold rounded-[56px] transition-colors flex items-center gap-2 text-sm border border-[#5b616e]/10">
                  <Save size={18} />
                  Zapisz zmiany
                </button>
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/40 shadow-sm p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#f8f9fa] rounded-xl text-[#0a2351]">
              <Globe size={24} />
            </div>
            <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight">Preferencje</h3>
          </div>

          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[32px] hover:bg-[#f8f9fa] transition-colors border border-transparent hover:border-[#5b616e]/40">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#ffffff] shadow-sm rounded-full text-[#3E67BF] border border-[#5b616e]/10">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a0b0d]">Domyślna waluta</h4>
                  <p className="text-sm text-[#5b616e]">Waluta dla nowych podróży</p>
                </div>
              </div>
              
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-[#ffffff] border border-[#5b616e]/40 rounded-full px-6 py-3 text-[#0a0b0d] font-bold focus:outline-none focus:border-[#0a2351] transition-colors appearance-none cursor-pointer text-center min-w-[120px]"
              >
                <option value="EUR">EUR (€)</option>
                <option value="PLN">PLN (zł)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[32px] hover:bg-[#f8f9fa] transition-colors border border-transparent hover:border-[#5b616e]/40">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#ffffff] shadow-sm rounded-full text-[#3E67BF] border border-[#5b616e]/10">
                  <Bell size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a0b0d]">Powiadomienia E-mail</h4>
                  <p className="text-sm text-[#5b616e]">Otrzymuj raporty i podsumowania</p>
                </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${notifications ? 'bg-[#0a2351]' : 'bg-[#eef0f3] border border-[#5b616e]/20'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-sm ${notifications ? 'translate-x-6' : 'translate-x-0 border border-[#5b616e]/10'}`} />
              </button>
            </div>
          </div>
        </div>

        
        <div className="bg-[#ffffff] rounded-[40px] border border-[#5b616e]/40 shadow-sm p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#f8f9fa] rounded-xl text-[#0a2351]">
              <Shield size={24} />
            </div>
            <h3 className="text-2xl font-bold text-[#0a0b0d] tracking-tight">Bezpieczeństwo</h3>
          </div>

          
          <Link 
            href="/settings/password"
            className="flex items-center justify-between p-6 rounded-[32px] bg-[#f8f9fa] hover:bg-[#eef0f3] transition-colors group border border-[#5b616e]/10 hover:border-[#0a2351]/30"
          >
            <div className="flex items-center gap-4">
              <Lock size={20} className="text-[#3E67BF]" />
              <div>
                <h4 className="font-bold text-[#0a0b0d]">Zmień hasło</h4>
                <p className="text-sm text-[#5b616e]">Zaktualizuj swoje hasło dostępowe</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#5b616e] group-hover:text-[#0a2351] group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        
        <div className="bg-[#ffffff] rounded-[40px] border border-red-200 shadow-sm p-8 md:p-10 mt-12">
          <h3 className="text-xl font-bold text-red-600 tracking-tight mb-6">Strefa niebezpieczna</h3>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h4 className="font-bold text-[#0a0b0d]">Usuń konto</h4>
              <p className="text-sm text-[#5b616e] mt-1">Trwale usuń swoje konto i wszystkie dane podróży.</p>
            </div>
            <button 
              onClick={openDeleteModal}
              className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-[56px] transition-colors flex items-center gap-2 shrink-0 text-sm border border-red-200"
            >
              <Trash2 size={18} />
              Usuń konto
            </button>
          </div>
        </div>
      </div>

      
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#0a0b0d]/40 backdrop-blur-md flex justify-center items-center p-4">
          
          <div className="bg-[#ffffff] border border-[#5b616e]/40 w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-3xl font-bold text-[#0a0b0d] tracking-tight mb-4">Czy na pewno?</h2>
              <p className="text-[#5b616e] mb-8">
                Tej operacji nie można cofnąć. Wszystkie Twoje podróże i rozliczenia zostaną trwale usunięte.
              </p>
              <div className="flex flex-col w-full gap-3">
                <button 
                  disabled={countdown > 0}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className={`w-full py-4 font-bold rounded-[56px] transition-all flex items-center justify-center gap-2
                    ${countdown > 0 
                      ? 'bg-[#eef0f3] text-[#5b616e] cursor-not-allowed opacity-70' 
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200'
                    }`}
                >
                  <Trash2 size={20} />
                  Usuń konto {countdown > 0 && `(${countdown}s)`}
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-4 text-[#0a2351] font-bold hover:bg-[#f8f9fa] rounded-[56px] transition-colors border border-transparent hover:border-[#5b616e]/20"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}