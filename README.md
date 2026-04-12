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
GOOGLE_VISION_API_KEY=twoj_klucz_google_vision
```

**4. Uruchom serwer deweloperski:**

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000).

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


## 📄 Licencja

Projekt akademicki. Wszelkie prawa zastrzeżone.
