//panel rejestracji
import React from 'react';

export default function RegisterPage() {
  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      height: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' 
    }}>
      <div style={{ textAlign: 'center', border: '2px solid #38bdf8', padding: '2rem', borderRadius: '1rem' }}>
        <h1>📝 Rejestracja</h1>
        <p>Stwórz nowe konto, aby korzystać z EuroPlanner.</p>
        <form style={{ marginTop: '1rem' }}>
          <input type="text" placeholder="Nazwa użytkownika" style={{ padding: '0.5rem', marginBottom: '0.5rem', width: '100%' }} />
          
          <input type="password" placeholder="Hasło" style={{ padding: '0.5rem', marginBottom: '0.5rem', width: '100%' }} />
          <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#38bdf8', color: 'white', border: 'none', borderRadius: '0.5rem' }}> Zarejestruj się</button>
        </form>
        <div style={{ marginTop: '1rem' }}>
          Masz już konto? <a href="/login" style={{ color: '#38bdf8' }}>Zaloguj się</a>
        </div>
      </div>
    </div>
  );
}