import { supabase } from '@/lib/supabaseClient';

// Prosty widok danych z tabeli "Users" w Supabase.
// W razie potrzeby możesz zmienić nazwę tabeli lub wybierane kolumny.

export default async function TripsPage() {
  const { data, error } = await supabase
    .from('Users')
    .select('*')
    .order('user_id', { ascending: true });

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Lista użytkowników</h1>
        <p style={{ color: 'red' }}>Błąd pobierania danych z Supabase: {error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Lista użytkowników</h1>
        <p>Brak danych w tabeli "Users".</p>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista użytkowników (Supabase)</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  border: '1px solid #ccc',
                  padding: '0.5rem',
                  backgroundColor: '#0f172a',
                  color: 'white',
                  textAlign: 'left',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id ?? JSON.stringify(row)}>
              {columns.map((col) => (
                <td key={col} style={{ border: '1px solid #eee', padding: '0.5rem' }}>
                  {typeof row[col] === 'object' && row[col] !== null
                    ? JSON.stringify(row[col])
                    : String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
