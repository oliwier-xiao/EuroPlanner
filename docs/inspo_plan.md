# 📋 Europlanner — Podział Zadań

> Dokument roboczy. Przypisania osób do uzupełnienia po ustaleniu ról w zespole.

---

## 👥 Role w Zespole

| Rola | Oznaczenie | Osoby |
|---|---|---|
| Core Logic & Finance | 🔢 | Osoba A, Osoba B |
| Integrations & Backend | ⚙️ | Osoba C, Osoba D |
| Frontend & UX/UI | 🎨 | Osoba E, Osoba F |

---

## 🔢 Core Logic & Finance — Instruktaż

### Czym się zajmujesz?
Jesteś odpowiedzialny za „mózg" aplikacji — wszystkie obliczenia finansowe. Twój kod
nie dotyka bazy danych ani interfejsu, ale bez niego aplikacja nie ma sensu.
Piszesz czyste funkcje TypeScript w folderze `lib/finance/`.

### Czego będziesz używać?
- **TypeScript** — główny język, pilnuje poprawności typów przy obliczeniach
- **Vitest lub Jest** — framework do testów jednostkowych (uruchamiasz `npm run test`)
- **VS Code** — edytor, z rozszerzeniem ESLint i Prettier
- **Git / GitHub** — kontrola wersji, pull requesty do review

### Czego się douczyć przed startem?

**Obowiązkowo:**
- Podstawy TypeScript (typy, interfejsy, funkcje) →
  [TypeScript w 1h — tutorial](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- Jak pisać testy jednostkowe z Vitest →
  [Vitest Getting Started](https://vitest.dev/guide/)

**Warto zrozumieć:**
- Problem „debt simplification" / minimalizacji przelewów — to klasyczny problem
  grafowy, poczytaj o algorytmie „Settle Debts" lub „Simplify Debts":
  wyszukaj `minimize cash flow among friends algorithm`
- Dlaczego pieniądze przechowuje się jako liczby całkowite (grosze/centy), a nie
  jako `float` → wyszukaj `floating point money problem javascript`

### Jak wygląda Twój typowy plik?

```typescript
// lib/finance/splitExpense.ts

export interface Split {
  participantId: string;
  amount: number; // w groszach/centach, zawsze integer
}

export function splitEqually(
  totalAmount: number,
  participantIds: string[]
): Split[] {
  const share = Math.floor(totalAmount / participantIds.length);
  const remainder = totalAmount % participantIds.length;

  return participantIds.map((id, index) => ({
    participantId: id,
    amount: index === 0 ? share + remainder : share, // resztę dodaj pierwszej osobie
  }));
}
```
---

## ⚙️ Integrations & Backend — Instruktaż

### Czym się zajmujesz?
Łączysz aplikację ze światem zewnętrznym — bazą danych, API kursów walut i Google
Vision (OCR). Konfigurujesz Supabase, piszesz funkcje do komunikacji z API i dbasz
o to, żeby dane bezpiecznie trafiały do bazy i z niej wracały. Na koniec wdrażasz
aplikację na serwer.

### Czego będziesz używać?
- **Supabase** — baza danych PostgreSQL + auth + storage (przechowywanie zdjęć)
- **Next.js Route Handlers** — (`app/api/`) endpointy po stronie serwera
- **Google Cloud Vision API** — wysyłasz zdjęcie paragonu, dostajesz tekst z kwotą
- **European Central Bank API** — pobierasz kursy walut w formacie XML
- **TypeScript** — wszystko typujesz, żeby frontend wiedział czego się spodziewać
- **Postman lub Thunder Client** — testowanie endpointów API bez frontendu

### Czego się douczyć przed startem?

**Obowiązkowo:**
- Supabase Quick Start z Next.js →
  [docs.supabase.com/guides/getting-started/quickstarts/nextjs](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- Jak działają Route Handlers w Next.js App Router →
  [nextjs.org/docs/app/building-your-application/routing/route-handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- Podstawy SQL (CREATE TABLE, SELECT, INSERT, JOIN) →
  [sqlzoo.net](https://sqlzoo.net/) — interaktywny kurs, wystarczy pierwsze 5 lekcji

**Warto zrozumieć:**
- Czym jest REST API i jak działają requesty HTTP (GET, POST) →
  wyszukaj `REST API explained simply`
- Jak działa `.env.local` i dlaczego kluczy API nie wrzuca się na GitHub →
  wyszukaj `environment variables nextjs`

### Jak wygląda Twój typowy plik?

```typescript
// app/api/currency/route.ts
// Endpoint: GET /api/currency?base=PLN

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get('base') ?? 'EUR';

  try {
    const res = await fetch('https://data-api.ecb.europa.eu/service/data/EXR/...');
    const data = await res.json();
    return NextResponse.json({ rates: data });
  } catch {
    // fallback — zwróć ostatnie znane kursy z cache
    return NextResponse.json({ rates: FALLBACK_RATES, cached: true });
  }
}
```
### Schema bazy danych (Twoja odpowiedzialność):
```sql
trips        -- id, name, base_currency, budget_limit, created_by
participants -- id, trip_id, display_name
expenses     -- id, trip_id, amount_cents, currency, category, paid_by, created_at
splits       -- id, expense_id, participant_id, amount_cents, is_settled
```

---

## 🎨 Frontend & UX/UI — Instruktaż

### Czym się zajmujesz?
Budujesz wszystko co użytkownik widzi i z czym wchodzi w interakcję. Tworzysz makiety,
projektujesz przepływ użytkownika, a potem implementujesz go w Next.js. Dbasz o to,
żeby aplikacja była czytelna, responsywna i przyjemna w użyciu. Na koniec przygotowujesz
też pitch deck i nagranie demo.

### Czego będziesz używać?
- **Next.js App Router** — struktura stron i nawigacja
- **TypeScript + React** — komponenty, hooki (`useState`, `useEffect`)
- **Tailwind CSS** — stylowanie przez klasy bezpośrednio w JSX, bez pisania CSS
- **Figma** (lub draw.io) — makiety i User Flow przed kodowaniem
- **Recharts lub Chart.js** — wykresy wydatków według kategorii
- **jsPDF lub react-pdf** — generowanie PDF raportu końcowego

### Czego się douczyć przed startem?

**Obowiązkowo:**
- Podstawy React — komponenty, props, useState →
  [react.dev/learn](https://react.dev/learn) — oficjalny interaktywny tutorial
- Tailwind CSS w 20 minut →
  [tailwindcss.com/docs/utility-first](https://tailwindcss.com/docs/utility-first)
- Jak działają strony i layouty w Next.js App Router →
  [nextjs.org/docs/app/building-your-application/routing](https://nextjs.org/docs/app/building-your-application/routing)

**Warto zrozumieć:**
- Czym jest komponent i jak myśleć „po reactowemu" (dzielenie UI na małe kawałki) →
  wyszukaj `thinking in react`
- Podstawy Figma (tworzenie ramek, łączenie ekranów) →
  [youtube: Figma for beginners]

### Jak wygląda Twój typowy plik?

```tsx
// components/ExpenseCard.tsx

interface ExpenseCardProps {
  amount: number;        // w centach
  currency: string;
  category: string;
  paidBy: string;
}

export function ExpenseCard({ amount, currency, category, paidBy }: ExpenseCardProps) {
  const formatted = (amount / 100).toFixed(2);

  return (
    <div className="rounded-xl border p-4 shadow-sm flex justify-between items-center">
      <div>
        <p className="font-semibold">{category}</p>
        <p className="text-sm text-gray-500">Zapłacił: {paidBy}</p>
      </div>
      <p className="text-lg font-bold">{formatted} {currency}</p>
    </div>
  );
}
```


## 🗂️ Sprint 1 — Analiza i Projektowanie (do 3 kwi)

### 🔢 Core Logic & Finance

- [ ] Zaprojektowanie algorytmu podziału kosztów (równy podział, podział procentowy)
- [ ] Zaprojektowanie algorytmu minimalizacji liczby przelewów (debt simplification)
- [ ] Przygotowanie zestawu testów jednostkowych dla różnych scenariuszy zadłużenia
- [ ] Ustalenie standardu przechowywania wartości pieniężnych (centy jako liczby całkowite)

### ⚙️ Integrations & Backend

- [ ] Założenie i konfiguracja projektu Supabase (tabele: trips, users, expenses, participants)
- [ ] Zaprojektowanie schematu bazy danych PostgreSQL
- [ ] Pierwsze testy połączenia z European Central Bank API (pobieranie kursów walut)
- [ ] Pierwsze testy Google Cloud Vision AI na przykładowych paragonach

### 🎨 Frontend & UX/UI

- [ ] Przygotowanie makiet ekranów (Figma / draw.io): Główny ekran, Trasa, Dodawanie wydatku, Rozliczenia
- [ ] Zaprojektowanie User Flow — pełna ścieżka użytkownika od założenia podróży do raportu
- [ ] Inicjalizacja projektu Next.js z TypeScript i Tailwind CSS
- [ ] Konfiguracja struktury folderów zgodnie z App Router

---

## 🗂️ Sprint 2 — Budowa MVP (4 kwi – 1 maj)

### 🔢 Core Logic & Finance

- [ ] Implementacja logiki podziału kosztów między uczestnikami
- [ ] Implementacja algorytmu minimalizacji przelewów (kto komu ile)
- [ ] Obsługa edge case'ów: nierówne podziały, wielu płacących za jeden wydatek
- [ ] Mechanizm oznaczania długu jako spłaconego
- [ ] Testy jednostkowe — pokrycie min. 10 scenariuszy

### ⚙️ Integrations & Backend

- [ ] Integracja klienta Supabase z Next.js (auth, database, storage)
- [ ] Endpoint / funkcja do pobierania i cache'owania kursów walut EBC
- [ ] Mechanizm fallback — ostatnie znane kursy gdy brak internetu
- [ ] Integracja Google Cloud Vision AI — wysyłanie zdjęcia i parsowanie odpowiedzi (kwota, waluta)
- [ ] Przechowywanie zdjęć paragonów w Supabase Storage

### 🎨 Frontend & UX/UI

- [ ] Widok: Tworzenie nowej podróży + dodawanie uczestników
- [ ] Widok: Planowanie trasy (lista miast, zmiana kolejności)
- [ ] Widok: Ręczne dodawanie wydatku (formularz: kwota, waluta, kategoria, kto zapłacił)
- [ ] Widok: Skanowanie paragonu (obsługa aparatu + podgląd odczytanych danych z możliwością edycji)
- [ ] Widok: Dashboard budżetu (pasek postępu, ostrzeżenie przy 90%)

---

## 🗂️ Sprint 3 — Finalizacja i Prezentacja (2 maj – 5 cze)

### 🔢 Core Logic & Finance

- [ ] Finalna weryfikacja poprawności wszystkich obliczeń finansowych
- [ ] Przygotowanie scenariuszy testowych end-to-end (min. 3 pełne podróże testowe)
- [ ] Wsparcie przy przygotowaniu sekcji „Risk Analysis" do pitch decku
- [ ] Analiza konkurencji (Splitwise, Tricount, Trail Wallet) — porównanie funkcjonalności

### ⚙️ Integrations & Backend

- [ ] Wdrożenie aplikacji na serwer deweloperski (na potrzeby demo)
- [ ] Generowanie raportu końcowego PDF (biblioteka np. `jsPDF` lub `react-pdf`)
- [ ] Eksport danych do CSV
- [ ] Finalne testy integracyjne: OCR → przeliczenie waluty → podział kosztów → raport

### 🎨 Frontend & UX/UI

- [ ] Widok: Podsumowanie wydatków według kategorii (wykres)
- [ ] Widok: Lista rozliczeń końcowych „kto komu ile"
- [ ] Widok: Archiwum zakończonych podróży
- [ ] Poprawki UX na podstawie testów korytarzowych
- [ ] Przygotowanie pitch decku (szablon, layout, sekcje)
- [ ] Nagranie demo video jako backup na wypadek problemów z live demo

---



> **Legenda statusów:**
> - [ ] Do zrobienia
> - [x] Zrobione
> - [~] W trakcie
