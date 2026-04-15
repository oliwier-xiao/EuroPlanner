//panel rejestracji
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, password }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Konto zostało utworzone. Możesz się zalogować.");
        setName("");
        setSurname("");
        setPassword("");
        // opcjonalnie od razu przekieruj na login
        // router.push("/login");
      } else {
        setError(data.message || "Nie udało się utworzyć konta");
      }
    } catch {
      setError("Wystąpił błąd połączenia");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900 text-white font-sans">
      <div className="text-center border-2 border-sky-400 p-8 rounded-2xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Rejestracja</h1>
        <p className="text-slate-300 mb-6">Stwórz nowe konto, aby korzystać z EuroPlanner.</p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

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
            type="text"
            placeholder="Nazwisko"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
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
            {loading ? "Rejestrowanie..." : "Zarejestruj się"}
          </button>
        </form>
        <div className="mt-4 text-slate-300">
          Masz już konto?{" "}
          <a href="/login" className="text-sky-400 hover:underline">
            Zaloguj się
          </a>
        </div>
      </div>
    </div>
  );
}
