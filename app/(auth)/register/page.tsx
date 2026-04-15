//panel rejestracji
import React from 'react';

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900 text-white font-sans">
      <div className="text-center border-2 border-sky-400 p-8 rounded-2xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Rejestracja</h1>
        <p className="text-slate-300 mb-6">Stwórz nowe konto, aby korzystać z EuroPlanner.</p>
        <form className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nazwa użytkownika"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
          />
          <input
            type="password"
            placeholder="Hasło"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-sky-400 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors cursor-pointer"
          >
            Zarejestruj się
          </button>
        </form>
        <div className="mt-4 text-slate-300">
          Masz już konto?{' '}
          <a href="/login" className="text-sky-400 hover:underline">
            Zaloguj się
          </a>
        </div>
      </div>
    </div>
  );
}
