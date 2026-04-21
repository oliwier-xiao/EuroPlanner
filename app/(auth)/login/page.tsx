"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";

function initParticles() {
  const particlesJS = (window as typeof window & {
    particlesJS?: (tagId: string, config: unknown) => void;
  }).particlesJS;

  if (!particlesJS) return;

  particlesJS("particles-js", {
    particles: {
      number: { value: 70, density: { enable: true, value_area: 900 } },
      color: { value: "#38bdf8" },
      shape: { type: "circle" },
      opacity: { value: 0.7, random: false },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 140,
        color: "#38bdf8",
        opacity: 0.25,
        width: 1,
      },
      move: {
        enable: true,
import { Eye, EyeOff, ArrowRight, User, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function initParticles() {
    const windowAny = window as any;
    const particlesJS = windowAny.particlesJS;
    if (!particlesJS) return;

    // --- NAJBARDZIEJ BEZPIECZNY RESET ---
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
    // ------------------------------------

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

  useEffect(() => {
    const timer = setTimeout(() => {
      initParticles();
    }, 150); // Zwiększony lekko timeout dla stabilności
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Błąd logowania");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f0f9ff] overflow-hidden">
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="afterInteractive"
        onLoad={initParticles}
      />
      <div id="particles-js" className="absolute inset-0 z-0" aria-hidden="true" />
      <div className="relative z-10 min-h-screen w-full flex flex-col items-center p-4 animate-in fade-in duration-700 pointer-events-none">
        <div className="mb-5 mt-2 flex flex-col items-center gap-2 pointer-events-auto">
          <div className="w-12 h-12 bg-[#3E67BF] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-[#3E67BF]/20">E</div>
          <h1 className="text-xl font-bold text-[#0a2351] tracking-tighter uppercase">EuroPlanner</h1>
        </div>
        <div className="w-full max-w-[400px] bg-white/80 backdrop-blur-md rounded-[40px] border border-[#5b616e]/10 p-7 md:p-9 shadow-xl shadow-blue-900/5 pointer-events-auto">
          <div className="mb-5 text-center">
            <h2 className="text-2xl font-bold text-[#0a0b0d] tracking-tight">Witaj ponownie</h2>
            <p className="text-[#5b616e] text-sm font-medium">Zaloguj się do swojego konta.</p>
          </div>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl text-center">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Imię / Login</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5b616e]" size={16} />
                <input type="text" placeholder="admin" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} className="w-full bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#0a2351] rounded-full pl-12 pr-4 py-[11.6px] text-sm outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[1px] text-[#5b616e] pl-4">Hasło</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5b616e]" size={16} />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} className="w-full bg-[#f8f9fa] border border-transparent focus:bg-white focus:border-[#0a2351] rounded-full pl-12 pr-12 py-[11.6px] text-sm outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5b616e] hover:text-[#0a2351]">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#0a2351] hover:bg-[#3E67BF] text-white font-bold py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 mt-2 text-sm disabled:opacity-70">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Zaloguj się <ArrowRight size={18} /></>}
            </button>
          </form>
          <div className="mt-6 text-center border-t border-[#5b616e]/10 pt-5">
            <p className="text-[#5b616e] text-sm font-medium">Nie masz konta? <Link href="/register" className="text-[#3E67BF] font-bold hover:underline">Zarejestruj się</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}