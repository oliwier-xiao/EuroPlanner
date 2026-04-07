# 🌍 Europlanner

> Aplikacja mobilna do planowania podróży grupowych po Unii Europejskiej  
> z automatycznym rozliczaniem wydatków i skanowaniem paragonów.

---

## 📖 O projekcie

Europlanner rozwiązuje dwa główne bóle głowy każdej podróży grupowej:

- **Logistykę** — planowanie trasy przez wiele krajów i miast UE
- **Finanse** — rozliczenia w różnych walutach, podział kosztów, minimalizacja liczby przelewów

System w wersji MVP pozwala przejść pełny flow: od założenia podróży, przez skanowanie paragonów aparatem (OCR), po wygenerowanie końcowego raportu PDF z podziałem „kto komu ile".

**Autorki:** Justyna Maj, Wiktoria Babiarz

---

## ✨ Funkcjonalności MVP

| Moduł | Funkcja |
|---|---|
| 🗺️ Trasa | Dodawanie miast/krajów, szacowany czas przejazdu, zmiana kolejności |
| 👥 Grupa | Tworzenie podróży, zapraszanie uczestników po imieniu/pseudonimie |
| 🧾 OCR | Skanowanie paragonu aparatem → automatyczne odczytanie kwoty i waluty |
| 💱 Waluty | Przeliczanie na EUR wg kursów ECB, cache offline ostatnich kursów |
| 📊 Budżet | Limit wydatków, pasek postępu, ostrzeżenie przy 90% wykorzystania |
| ⚖️ Podział | Automatyczne równe dzielenie kosztów, możliwość udziałów procentowych |
| 🔁 Minimalizacja | Algorytm redukujący liczbę przelewów do minimum — lista „kto komu ile" |
| 📄 Raport | Generowanie PDF/CSV z pełnym podsumowaniem po zakończeniu podróży |

---

## 🚫 Poza zakresem MVP

- Integracja z systemami płatności (Revolut, PayPal, banki)
- Obsługa wszystkich walut świata (tylko wybrane waluty krajów UE)
- Logowanie przez social media
- Pełny tryb offline z synchronizacją między urządzeniami
- Długoterminowa analityka finansowa

---

## 🛠️ Stack technologiczny

> *(do uzupełnienia po wyborze technologii — patrz WBS 2.2.1)*

- **Frontend/Mobile:** TBD (np. React Native / Flutter)
- **OCR:** Google Vision AI
- **Kursy walut:** European Central Bank API
- **Mapy/Trasy:** TBD (np. Google Maps API)
- **Baza danych:** TBD
- **Raporty PDF:** TBD

---


## 📋 WBS — główne etapy

1. **Analiza i wymagania** — Karta projektu, User Stories (25+), priorytety MoSCoW
2. **Projektowanie** — Makiety UX/UI, architektura bazy danych, wybór API
3. **Budowa MVP** — Moduł podróży, moduł finansowy + OCR, raportowanie
4. **Testy i jakość** — Scenariusze testowe, testy OCR, naprawa błędów
5. **Zamykanie** — Prezentacja końcowa, dokumentacja, analiza realizacji celów

---

## ⚠️ Kluczowe ryzyka

| Ryzyko | Prawdopodobieństwo | Mitygacja |
|---|---|---|
| Błędy odczytu OCR | Wysokie | Ręczna edycja po skanowaniu + testy na wielu paragonach |
| Awaria API kursów ECB | Niskie | Cache ostatnich kursów lokalnie |
| Błędy zaokrągleń w walutach | Średnie | Przechowywanie centów jako liczby całkowite |
| Błędy algorytmu minimalizacji długów | Niskie | Testy jednostkowe dla wielu scenariuszy |

Pełny rejestr ryzyk (12 pozycji) znajduje się w `docs/Karta_projektu.pdf`.

---

## 📌 Status projektu

🟡 **W trakcie realizacji** — faza analizy i wymagań

---

## 📄 Licencja

Projekt akademicki — wszelkie prawa zastrzeżone.
