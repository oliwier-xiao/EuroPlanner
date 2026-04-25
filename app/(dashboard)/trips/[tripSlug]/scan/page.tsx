"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Camera, RefreshCw, Check, ScanLine, Loader2, ArrowRight } from "lucide-react";

export default function ScanReceiptPage() {
  const router = useRouter();
  const [step, setStep] = useState<"camera" | "scanning" | "result">("camera");

  const handleCapture = () => {
    setStep("scanning");
    setTimeout(() => {
      setStep("result");
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-[#f8f9fa] z-[200] flex flex-col overflow-hidden font-sans selection:bg-[#3E67BF] selection:text-white">
      
      {/* NAGŁÓWEK - Czysty, w naszym stylu */}
      <div className="p-6 flex justify-between items-center bg-white/80 backdrop-blur-md z-30 border-b border-[#5b616e]/10">
        <button 
          onClick={() => router.back()} 
          className="text-[#0a0b0d] p-2 hover:bg-[#f0f2f5] rounded-full transition-all active:scale-90 cursor-pointer"
        >
          <X size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[#0a0b0d] font-black text-sm tracking-tight">Skaner Paragonów</span>
          <span className="text-[#3E67BF] text-[10px] font-bold uppercase tracking-[2px]">Technologia OCR</span>
        </div>
        <div className="w-10" />
      </div>

      {/* WIDOK GŁÓWNY */}
      <div className="flex-1 relative flex items-center justify-center p-6">
        
        {step === "camera" && (
          <div className="w-full max-w-lg aspect-[3/4] bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-[#5b616e]/10 relative flex flex-col items-center justify-center overflow-hidden animate-in fade-in zoom-in duration-500">
            {/* Ramka pomocnicza */}
            <div className="absolute inset-8 border-2 border-dashed border-[#3E67BF]/30 rounded-[32px] pointer-events-none" />
            
            <Camera className="text-[#f0f2f5] w-32 h-32 mb-4" strokeWidth={1} />
            <p className="text-[#5b616e] text-xs font-bold text-center px-12 uppercase tracking-widest leading-relaxed">
              Umieść paragon wewnątrz ramki<br/>i naciśnij przycisk
            </p>
          </div>
        )}

        {step === "scanning" && (
          <div className="w-full max-w-lg aspect-[3/4] bg-white rounded-[40px] shadow-2xl border border-[#5b616e]/10 relative flex flex-col items-center justify-center overflow-hidden">
            {/* LASER - Teraz w kolorze Euro Blue */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3E67BF] to-transparent shadow-[0_8px_20px_rgba(62,103,191,0.4)] z-50 animate-[bounce_3s_infinite]" />
            
            <div className="space-y-6 flex flex-col items-center z-10">
              <div className="relative">
                <Loader2 className="text-[#3E67BF] animate-spin" size={48} />
                <ScanLine className="absolute inset-0 text-[#3E67BF]/20" size={48} />
              </div>
              <div className="text-center">
                <p className="text-[#0a0b0d] font-black tracking-tight text-xl mb-1">Analizujemy dane</p>
                <p className="text-[#5b616e] text-[10px] font-bold uppercase tracking-[2px] animate-pulse">Wyodrębnianie kwot i pozycji...</p>
              </div>
            </div>
          </div>
        )}

        {step === "result" && (
          <div className="w-full max-w-md bg-white rounded-[40px] border border-[#5b616e]/10 p-8 md:p-10 animate-in zoom-in slide-in-from-bottom-10 duration-500 shadow-2xl shadow-blue-900/10">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-[#3E67BF]/10 text-[#3E67BF] rounded-3xl flex items-center justify-center shadow-sm">
                <Check size={40} strokeWidth={3} />
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-[#0a0b0d] text-center mb-2 tracking-tighter">Skanowanie udane!</h2>
            <p className="text-[#5b616e] text-center mb-8 text-sm font-medium italic">Dane zostały poprawnie odczytane</p>
            
            <div className="space-y-4 mb-10">
              <div className="bg-[#f8f9fa] p-5 rounded-[24px] border border-[#5b616e]/5 hover:border-[#3E67BF]/20 transition-colors">
                <p className="text-[10px] text-[#5b616e] uppercase font-black tracking-[2px] mb-1">Kwota całkowita</p>
                <p className="text-4xl font-black text-[#0a0b0d] tracking-tighter">42.50 <span className="text-[#3E67BF]">EUR</span></p>
              </div>
              <div className="bg-[#f8f9fa] p-5 rounded-[24px] border border-[#5b616e]/5">
                <p className="text-[10px] text-[#5b616e] uppercase font-black tracking-[2px] mb-1">Miejsce zakupu</p>
                <p className="text-[#0a0b0d] font-bold text-lg tracking-tight">Lidl Roma Termini</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => router.back()} 
                className="w-full py-5 bg-[#0a2351] hover:bg-[#3E67BF] text-white font-black rounded-full transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Zatwierdź wydatek <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => setStep("camera")} 
                className="w-full py-2 text-[#5b616e] hover:text-[#0a0b0d] text-xs font-black uppercase tracking-[2px] transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} /> Ponów zdjęcie
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PANEL PRZYCISKU MIGAWKI */}
      {step === "camera" && (
        <div className="pb-16 pt-8 bg-white border-t border-[#5b616e]/10 flex flex-col items-center gap-6">
          <p className="text-[#5b616e] text-[10px] font-black uppercase tracking-[2px]">Naciśnij, aby zeskanować</p>
          <button 
            onClick={handleCapture}
            className="group relative w-24 h-24 flex items-center justify-center cursor-pointer"
          >
            {/* Zewnętrzny pierścień */}
            <div className="absolute inset-0 border-[6px] border-[#0a2351] rounded-full group-active:scale-90 transition-all duration-300 shadow-lg shadow-blue-900/10" />
            {/* Wypełnienie */}
            <div className="w-16 h-16 bg-[#0a2351] group-hover:bg-[#3E67BF] rounded-full group-active:scale-95 transition-all duration-300 flex items-center justify-center text-white">
               <Camera size={28} />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}