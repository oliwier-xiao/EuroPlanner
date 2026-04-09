export default function Home() {
  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      height: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' 
    }}>
      <div style={{ textAlign: 'center', border: '2px solid #38bdf8', padding: '2rem', borderRadius: '1rem' }}>
        <h1>🌍 EuroPlanner: Live!</h1>
        <p>Infrastruktura na serwerze DietPi działa poprawnie.</p>
        <div style={{ marginTop: '1rem', color: '#38bdf8', fontWeight: 'bold' }}>
          Status: Kontener wdrożony przez GitHub Actions
        </div>
      </div>
    </div>
  )
}