"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { User, Mail, Lock, ArrowRight, Type, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", username: "", email: "", password: "", confirmPassword: ""
  });

  function initParticles() {
    const windowAny = window as any;
    const particlesJS = windowAny.particlesJS;
    if (!particlesJS) return;

    // --- KLUCZOWY BEZPIECZNIK (ten sam co w login) ---
    const currentDom = windowAny.pJSDom;
    if (Array.isArray(currentDom)) {
      currentDom.forEach((instance) => {
        if (instance?.pJS?.fn?.vendors?.destroypJS) {
          try {
            instance.pJS.fn.vendors.destroypJS();
          } catch (e) {}
        }
      });
      windowAny.pJSDom = [];
    }

    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#3E67BF" },
        shape: { type: "circle" },
        opacity: { value: 0.4, random: false },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#3E67BF",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.4 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
  }

  // TO NAPRAWIA PRZEJŚCIE Z LOGIN -> REGISTER
  useEffect(() => {
    // Dajemy skryptowi chwilę na upewnienie się, że kontener div#particles-js istnieje w DOM
    const timer = setTimeout(() => {
      initParticles();
    }, 200); 
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#f0f9ff] overflow-hidden">
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="afterInteractive"
        onLoad={initParticles} // To zadziała tylko przy twardym odświeżeniu
      />

      <div id="particles-js" className="absolute inset-0 z-0" aria-hidden="true" />

      <div className="relative z-10 min-h-screen w-full flex flex-col items-center p-4 animate-in fade-in duration-700 pointer-events-none">
        <div className="mb-5 mt-2 flex flex-col items-center gap-2 pointer-events-auto">
          <div className="w-12 h-12 bg-[#3E67BF] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-[#3E67BF]/20">
            E
          </div>
          <h1 className="text-xl font-bold text-[#0a2351] tracking-tighter uppercase">EuroPlanner</h1>
        </div>

        <div className="w-full max-w-[500px] bg-white/80 backdrop-blur-md rounded-[40px] border border-[#5b616e]/10 p-7 md:p-9 shadow-xl shadow-blue-900/5 pointer-events-auto">
          <div className="mb-5 text-center">
            <h2 className="text-2xl font-bold text-[#0a0b0d] tracking-tight">Załóż konto</h2>
            <p className="text-[#5b616e] text-sm font-medium">Dołącz do nas i planuj podróże.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); router.push("/dashboard"); }} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Imię</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5b616e]" size={15} />
                  <input type="text" placeholder="Jan" required className="w-full bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#0a2351] rounded-full pl-11 pr-4 py-[11.6px] text-sm outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Nazwisko</label>
                <input type="text" placeholder="Kowalski" required className="w-full bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#0a2351] rounded-full px-6 py-[11.6px] text-sm outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Nazwa użytkownika</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5b616e]" size={16} />
                <input type="text" placeholder="jan_kowal" required className="w-full bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#0a2351] rounded-full pl-13 pr-4 py-[11.6px] text-sm outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5b616e]" size={16} />
                <input type="email" placeholder="jan@przyklad.pl" required className="w-full bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#0a2351] rounded-full pl-13 pr-4 py-[11.6px] text-sm outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Hasło</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5b616e]" size={15} />
                  <input type={showPassword ? "text" : "password"} placeholder="••••" required className="w-full bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#0a2351] rounded-full pl-10 pr-10 py-[11.6px] text-sm outline-none transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b616e] hover:text-[#0a2351]">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Powtórz</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="••••" required className="w-full bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#0a2351] rounded-full pl-5 pr-10 py-[11.6px] text-sm outline-none transition-all" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b616e] hover:text-[#0a2351]">
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#0a2351] hover:bg-[#3E67BF] text-white font-bold py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 mt-2 text-sm">
              Stwórz konto <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center border-t border-[#5b616e]/10 pt-5">
            <p className="text-[#5b616e] text-sm font-medium">
              Masz już konto? <Link href="/login" className="text-[#3E67BF] font-bold hover:underline">Zaloguj się</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}