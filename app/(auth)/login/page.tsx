"use client";

import React, { useState } from "react";
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
        speed: 1.8,
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
        grab: { distance: 170, line_linked: { opacity: 0.45 } },
        push: { particles_nb: 7 },
      },
    },
    retina_detect: true,
  });
}

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Wystąpił błąd połączenia");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-slate-900 text-white font-sans overflow-hidden">
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="afterInteractive"
        onLoad={initParticles}
      />

      <div id="particles-js" className="absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-slate-900/60 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 text-center border-2 border-sky-400/80 bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Logowanie</h1>
        <p className="text-slate-300 mb-6">Zaloguj się do EuroPlanner.</p>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Imię"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
            required
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-sky-400 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <div className="mt-4 text-slate-300">
          Nie masz konta?{" "}
          <a href="/register" className="text-sky-400 hover:underline">
            Zarejestruj się
          </a>
        </div>
      </div>
    </div>
  );
}
