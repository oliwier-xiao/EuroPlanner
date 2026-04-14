"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Tutaj Działaj</h1>
      <p className="text-slate-400 mb-8">Dashboard — miejsce na frontend</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
      >
        Wyloguj się
      </button>
    </div>
  );
}
