# 🌍 Europlanner
> **Inteligentna aplikacja webowa (PWA) do planowania podróży grupowych i automatycznego rozliczania wydatków w Unii Europejskiej.**

---

## 📖 O projekcie

Europlanner rozwiązuje problem uciążliwego planowania tras oraz skomplikowanych rozliczeń grupowych podczas podróży po krajach Unii Europejskiej. System pozwala przejść pełny proces: od założenia podróży, przez skanowanie paragonów aparatem (OCR), po wygenerowanie końcowego raportu z podziałem „kto komu ile".

**Główni użytkownicy:** Grupy znajomych oraz turyści zorganizowani potrzebujący jednego, zintegrowanego narzędzia do zarządzania wspólnym portfelem i logistyką.

**Zarzadzanie:** Justyna Maj, Wiktoria Babiarz

---

## 🛠️ Stack Technologiczny

Zdecydowałyśmy się na nowoczesną architekturę webową, która umożliwi sprawną współpracę w dużym zespole:

- **Frontend:** [Next.js](https://nextjs.org/) (App Router) – zapewnia wysoką wydajność i responsywność.
- **Backend & Baza Danych:** [Supabase](https://supabase.com/) – obsługa bazy danych PostgreSQL, autoryzacji oraz przechowywania zdjęć.
- **Język:** TypeScript – dla pełnego bezpieczeństwa typów przy obliczeniach finansowych.
- **Integracje zewnętrzne:**
  - **OCR:** Google Cloud Vision AI – automatyczny odczyt danych z paragonów.
  - **Waluty:** European Central Bank API – pobieranie aktualnych kursów walut.
- **Infrastruktura:** Aplikacja zostanie wdrożona na dedykowanym serwerze członka zespołu na potrzeby prezentacji końcowej.

---

## 👥 Struktura Zespołu (6 osób)

Zwiększenie zespołu pozwoliło na specjalizację w ramach następujących obszarów:

| Obszar | Osoby | Zakres |
|---|---|---|
| **Core Logic & Finance** | 2 os. | Algorytmy podziału kosztów, logika minimalizacji liczby przelewów |
| **Integrations & Backend** | 2 os. | Konfiguracja Supabase, wdrożenie na serwer, obsługa API OCR i walut |
| **Frontend & UX/UI** | 2 os. | Responsywny interfejs w Next.js, generowanie raportów PDF |

---

## ✨ Funkcjonalności MVP (Scope IN)

| Moduł | Funkcja |
|---|---|
| 🗺️ Trasa | Dodawanie miast/krajów, podgląd szacowanego czasu przejazdu i zmiana kolejności punktów |
| 👥 Grupa | Tworzenie nowej podróży oraz dodawanie uczestników do wspólnego budżetu |
| 🧾 OCR | Skanowanie paragonu aparatem i automatyczne odczytywanie kwoty oraz waluty |
| 💱 Waluty | Automatyczne przeliczanie wydatków na EUR na podstawie oficjalnych kursów EBC |
| ⚖️ Rozliczenia | System upraszczający rozliczenia między uczestnikami (minimalizacja liczby przelewów) |
| 📊 Budżet | Możliwość ustawienia limitu wydatków i podgląd struktury kosztów według kategorii |
| 📄 Raporty | Generowanie podsumowania wydatków i rozliczeń w formacie PDF lub CSV |

---

## 🚫 Poza zakresem (Scope OUT)

- Rzeczywista integracja z systemami płatności (np. Revolut, PayPal, banki).
- Obsługa wszystkich walut świata (tylko wybrane waluty krajów UE).
- Zaawansowana analityka finansowa obejmująca wiele podróży.
- Pełny tryb offline z synchronizacją między wieloma urządzeniami.

---

---

## ⚠️ Kluczowe Ryzyka i Mitygacja

| Ryzyko | Prawd. | Plan mitygacji |
|---|---|---|
| Błędy odczytu OCR | Wysokie | Implementacja funkcji ręcznej edycji pól po skanowaniu |
| Brak dostępu do API kursów | Niskie | Cache'owanie ostatnich znanych kursów w pamięci lokalnej |
| Błędy zaokrągleń walut | Średnie | Przechowywanie wartości pieniężnych jako liczb całkowitych (centy) |
| Niezrozumiały interfejs (UI) | Średnie | Przeprowadzenie szybkich testów korytarzowych na makietach |
| Błędy algorytmu minimalizacji długów | Niskie | Testy jednostkowe dla wielu scenariuszy zadłużenia |
| Problemy z API map | Średnie | Uproszczenie trasy do statycznej listy punktów w razie wysokich kosztów |

Pełny rejestr ryzyk (12 pozycji) znajduje się w `docs/Karta_projektu.pdf`.

---

## 📁 Struktura Projektu

```
EuroPlanner/
├── app/                              — Główny katalog aplikacji Next.js (App Router)
│   ├── api/                          — Endpointy backendowe (API routes)
│   ├── (auth)/                       — Strony autoryzacji (grupowane przez layout)
│   │   ├── login/                    — Strona logowania
│   │   └── register/                 — Strona rejestracji
│   ├── (dashboard)/                  — Panel użytkownika po zalogowaniu
│   │   ├── settings/                 — Ustawienia konta
│   │   └── trips/                    — Lista podróży
│   │       └── [tripId]/             — Widok konkretnej podróży (dynamiczny routing)
│   │           ├── budget/           — Zarządzanie budżetem i limitami
│   │           ├── expenses/         — Wydatki – dodawanie, lista, OCR paragonów
│   │           ├── report/           — Generowanie raportów PDF/CSV
│   │           ├── route/            — Planowanie trasy (miasta, kolejność)
│   │           └── settlements/      — Rozliczenia grupowe („kto komu ile")
│   ├── layout.tsx                    — Główny layout aplikacji (czcionki, providery)
│   └── page.tsx                      — Strona startowa (landing page)
├── components/                       — Komponenty React wielokrotnego użytku
│   ├── layout/                       — Elementy layoutu (navbar, sidebar, footer)
│   └── ui/                           — Elementy interfejsu (przyciski, modale, inputy)
├── docs/                             — Dokumentacja projektowa
│   ├── DATABASE.md                   — Opis schematu bazy danych (tabele, relacje, konwencje)
│   ├── ERD.dbml                      — Schemat bazy w formacie DBML (dbdiagram.io)
│   ├── ERD.png                       — Wizualizacja diagramu ERD
│   ├── inspo_plan.md                 — Plan inspiracji i założenia funkcjonalne
│   └── Karta_Projektu.pdf           — Oficjalna karta projektu (PDF)
├── hooks/                            — Custom React hooks (logika stanowa)
├── lib/                              — Biblioteki pomocnicze i konfiguracje
│   └── utils/                        — Funkcje narzędziowe (formatowanie, walidacja)
├── public/                           — Zasoby statyczne serwowane bez przetwarzania
│   ├── icons/                        — Ikony aplikacji (favicon, PWA)
│   └── images/                       — Obrazy i grafiki
├── tests/                            — Testy end-to-end (Playwright)
│   └── smoke.spec.ts                 — Podstawowy test dymny (czy apka wstaje)
├── types/                            — Globalne definicje typów TypeScript
├── .github/workflows/
│   └── e2e-tests.yml                 — CI pipeline – automatyczne testy na GitHub Actions
├── Dockerfile                        — Obraz Docker do wdrożenia na serwer
├── playwright.config.ts              — Konfiguracja testów Playwright
├── tsconfig.json                     — Konfiguracja kompilatora TypeScript
└── package.json                      — Zależności projektu i skrypty npm
```

---

## 🚀 Instalacja i Uruchomienie

### Wymagania wstępne

- Node.js 18+
- Konto [Supabase](https://supabase.com/) (bezpłatny plan wystarczy)
- Klucz API [Google Cloud Vision](https://cloud.google.com/vision)

### Kroki

**1. Sklonuj repozytorium:**

```bash
git clone https://github.com/[nazwa-uzytkownika]/europlanner.git
cd europlanner
```

**2. Zainstaluj zależności:**

```bash
npm install
```

**3. Skonfiguruj zmienne środowiskowe:**

Utwórz plik `.env.local` i dodaj:

```env
NEXT_PUBLIC_SUPABASE_URL=twoj_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_klucz_anon
SUPABASE_SERVICE_ROLE_KEY=twoj_klucz_service_role
GOOGLE_VISION_API_KEY=twoj_klucz_google_vision
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` jest **tajny** — używany TYLKO server-side w `lib/supabaseServer.ts`. Nigdy nie dodawaj prefiksu `NEXT_PUBLIC_`, bo wyciekłby do klienta.

**4. Zaktualizuj schemat bazy danych:**

Po każdym `git pull` z `main` sprawdź [`docs/DATABASE.md`](./docs/DATABASE.md) — sekcja **🛠️ Migracje** zawiera snippety SQL do uruchomienia w Supabase Studio (SQL Editor). Bez tego dostaniesz błędy typu „column `email` does not exist".

**5. Uruchom serwer deweloperski:**

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Architektura: Server vs Client Components

Projekt używa **Next.js 15 App Router** z React Server Components. To jest najczęstsze źródło błędów w zespole, więc ⚠️ przeczytaj uważnie ⚠️.

### Reguły kciuka

| Co chcesz zrobić? | Server Component | Client Component |
|---|---|---|
| Pobrać dane z bazy / Supabase | ✅ TAK | ❌ NIE |
| Odczytać ciasteczko / nagłówek HTTP | ✅ TAK (`await cookies()`) | ❌ NIE |
| Użyć `useState` / `useEffect` | ❌ NIE | ✅ TAK |
| Obsłużyć `onClick` / `onChange` | ❌ NIE | ✅ TAK |
| Użyć biblioteki przeglądarkowej (`window`, `localStorage`) | ❌ NIE | ✅ TAK |
| `import "server-only"` | ✅ TAK (zaleca się) | ❌ NIE (rzuci błąd) |
| Funkcja może być `async` | ✅ TAK | ❌ **NIE — to powoduje opisywany błąd!** |
| Dyrektywa `"use client"` | ❌ NIE | ✅ TAK (pierwsza linia pliku) |

### Wzorzec: layout pobierający dane usera

Tak to wygląda w naszym projekcie (i tak masz robić w nowych modułach):

**1. Server Component robi `await` i pobiera dane** — `app/(dashboard)/layout.tsx`:

```tsx
import "server-only";
import { cookies } from "next/headers";
import DashboardChrome from "./DashboardChrome";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;
  const user = userId ? await getCurrentUser(userId) : null;

  return (
    <DashboardChrome initialUser={user}>
      {children}
    </DashboardChrome>
  );
}
```

**2. Client Component dostaje gotowe dane jako propsy** — `app/(dashboard)/DashboardChrome.tsx`:

```tsx
"use client";
import { useState } from "react";

export default function DashboardChrome({ children, initialUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // ... cała interaktywność tutaj
  return <div>{children}</div>;
}
```

### ❌ Czego NIE robić

```tsx
// ❌ ŹLE: async + "use client" → błąd Next.js 15
"use client";
export default async function MyLayout({ children }) {
  const data = await fetch(...);  // 💥 "is an async Client Component"
  return <div>{children}</div>;
}
```

```tsx
// ❌ ŹLE: import server-only z client component
"use client";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";  // 💥 build error
```

### Konwencja w naszym repo

Pliki czysto serwerowe MAJĄ na górze `import "server-only"`:
- `app/(dashboard)/layout.tsx`
- `lib/supabaseServer.ts`
- `lib/auth/getCurrentUser.ts`

Dzięki temu jeśli ktoś przypadkiem zaimportuje je z client componentu (lub doda do nich `"use client"`), dostanie czytelny błąd przy buildzie zamiast hydration error w runtime.

**Gdy tworzysz nowy plik:**
- Plik woła `cookies()`, `await supabase...`, używa `SUPABASE_SERVICE_ROLE_KEY`? → dodaj `import "server-only";` na górze
- Plik używa `useState`, `onClick`, `window`? → dodaj `"use client";` na górze (i NIE rób go `async`)

---

## 🧪 Testy E2E w Playwright

Aplikacja ma skonfigurowane testy end‑to‑end w [Playwright](https://playwright.dev/) z plikami testów w katalogu `tests/` (np. `tests/smoke.spec.ts`).

### 1. Jednorazowa instalacja przeglądarek Playwright

Po zainstalowaniu zależności (`npm install`) uruchom lokalnie:

```bash
npx playwright install
```

### 2. Uruchomienie testów lokalnie

Playwright ma skonfigurowany `webServer` w `playwright.config.ts`, więc **nie musisz** samodzielnie uruchamiać `npm run dev` – testy same startują serwer deweloperski.

- Wszystkie testy i wszystkie przeglądarki z configu:

```bash
npx playwright test
```

- Tylko szybki test smoke:

```bash
npx playwright test tests/smoke.spec.ts
```

- Tylko wybrana przeglądarka (np. Chromium / Firefox / WebKit):

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

Po każdym uruchomieniu generowany jest raport HTML w katalogu `playwright-report/` (plik `index.html`), który możesz otworzyć w przeglądarce lub komendą:

```bash
npx playwright show-report
```

### 3. Testy na serwerze (CI)

Repozytorium zawiera workflow GitHub Actions [`e2e-tests.yml`](.github/workflows/e2e-tests.yml), który na self‑hosted runnerze:

- buduje obraz Dockera i uruchamia aplikację w kontenerze,
- instaluje przeglądarki Playwright,
- odpala `npx playwright test` przy każdym commicie / pull requeście na gałąź `main`.

---

## 🛠️ Troubleshooting

### Błąd: `<DashboardLayout> is an async Client Component`

Pełny komunikat:
> An unknown Component is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding 'use client' to a module that was originally written for the server.

**Przyczyna:** stary cache `.next` po pull‑u z `main` (kod został zrefaktorowany na server‑side fetch usera w commicie [`0816b8e`](../../commit/0816b8e)).

**Rozwiązanie — wyczyść cache i odpal od nowa:**

```bash
git pull origin main
npm install
npm run dev:fresh
```

Albo „twardy reset" (jeśli to nie pomogło):

```bash
npm run reset      # usuwa .next, node_modules, tsbuildinfo + reinstaluje
npm run dev
```

**❌ NIE rób tego, co podpowiada chat (czasem):** usunięcie `async` z `DashboardLayout` zepsuje `await cookies()` i `await getCurrentUser()` — przestanie się pobierać dane usera w SSR.

**Architektura (dlaczego tak jest):**

| Plik | Typ | `async`? | `"use client"`? |
|---|---|---|---|
| `app/(dashboard)/layout.tsx` | Server Component | ✅ TAK | ❌ NIE |
| `app/(dashboard)/DashboardChrome.tsx` | Client Component | ❌ NIE | ✅ TAK |

Server Component pobiera ciasteczko + dane usera z bazy, a Client Component obsługuje całą interaktywność (sidebar, menu, awatar). Dane lecą jako propsy.

Kluczowe pliki serwerowe mają `import "server-only"` u góry — jeśli ktoś przypadkiem doda do nich `"use client"`, dostanie czytelny błąd kompilacji zamiast hydration error.

### Inne komendy debugowania

```bash
npm run clean         # tylko .next + tsbuildinfo
npm run type-check    # sprawdź typy bez buildowania
npm ls next react     # sprawdź wersje (powinny się zgadzać u wszystkich)
```


## 📄 Licencja

Projekt akademicki. Wszelkie prawa zastrzeżone.
