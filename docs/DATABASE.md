# Baza Danych – Europlanner

Dokument opisuje strukturę bazy danych aplikacji **Europlanner**. Źródło prawdy dla diagramu: [`ERD.dbml`](./ERD.dbml) (DBML) oraz [`ERD.png`](./ERD.png) (podgląd wizualny).

- **Silnik:** PostgreSQL (hostowany w [Supabase](https://supabase.com/))
- **Autoryzacja:** Supabase Auth (tabela `users` trzyma dane aplikacyjne, hasła obsługuje Supabase)
- **Edytor diagramu:** [dbdiagram.io](https://dbdiagram.io/d) — wklej zawartość `ERD.dbml`

---

## Diagram ERD

![Diagram ERD](./ERD.png)

---

## Tabele

### `users` — użytkownicy aplikacji
Dane kont zarejestrowanych użytkowników.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `user_id` | `uuid` | **PK** |
| `name` | `text` | Imię |
| `surname` | `text` | Nazwisko |
| `email` | `varchar` | NOT NULL, UNIQUE |
| `password` | `text` | NOT NULL — docelowo obsługiwane przez Supabase Auth |
| `admin_access` | `boolean` | NOT NULL, `DEFAULT false` |
| `created_at` | `timestamp` | NOT NULL, `DEFAULT now()` |

---

### `trips` — podróże
Centralny obiekt aplikacji — każda wyprawa ma swój budżet i ramy czasowe.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `trip_id` | `uuid` | **PK** |
| `title` | `varchar` | NOT NULL — nazwa podróży |
| `description` | `varchar` | Opcjonalny opis |
| `start_date` | `date` | Data rozpoczęcia |
| `end_date` | `date` | Data zakończenia |
| `budget_limit` | `decimal` | Limit budżetu w EUR |
| `created_at` | `timestamp` | NOT NULL, `DEFAULT now()` |

---

### `trip_participants` — uczestnicy podróży (relacja M:N)
Łączy użytkowników z podróżami i przypisuje im role.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `trip_id` | `uuid` | **PK**, FK → `trips.trip_id` |
| `user_id` | `uuid` | **PK**, FK → `users.user_id` |
| `role` | `varchar` | NOT NULL — dozwolone wartości: `owner`, `member` |
| `joined_at` | `timestamp` | NOT NULL, `DEFAULT now()` |

> **Uwaga:** klucz główny to para `(trip_id, user_id)` — jeden użytkownik może być tylko raz uczestnikiem danej podróży.

---

### `destinations` — miejsca docelowe w ramach podróży
Przystanki/miasta, które składają się na trasę podróży.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `destination_id` | `bigint` | **PK**, auto-increment |
| `trip_id` | `uuid` | NOT NULL, FK → `trips.trip_id` |
| `name` | `text` | NOT NULL — nazwa miasta/miejsca |
| `lat` | `real` | Szerokość geograficzna |
| `lng` | `real` | Długość geograficzna |
| `arrival_date` | `date` | Data przyjazdu |
| `departure_date` | `date` | Data wyjazdu |
| `visit_order` | `smallint` | Kolejność zwiedzania na trasie |

---

### `activities` — aktywności w danym miejscu
Konkretne atrakcje/punkty programu przypisane do `destination`.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `activity_id` | `bigint` | **PK**, auto-increment |
| `destination_id` | `bigint` | NOT NULL, FK → `destinations.destination_id` |
| `title` | `varchar` | Nazwa aktywności |
| `start_time` | `timestamp` | Godzina rozpoczęcia |
| `cost` | `real` | Orientacyjny koszt |
| `is_completed` | `boolean` | NOT NULL, `DEFAULT false` — czy aktywność została zrealizowana |

---

### `expense_categories` — słownik kategorii wydatków
Lista predefiniowanych kategorii (np. transport, jedzenie, noclegi).

| Kolumna | Typ | Uwagi |
|---|---|---|
| `category_id` | `uuid` | **PK** |
| `name` | `varchar` | Nazwa kategorii |

**Proponowane wartości seed:**
- `Transport`
- `Jedzenie`
- `Noclegi`
- `Atrakcje`
- `Zakupy`
- `Inne`

---

### `expenses` — wydatki
Pojedyncze wydatki poniesione w ramach podróży, przypisane do kategorii.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `expense_id` | `uuid` | **PK** |
| `trip_id` | `uuid` | NOT NULL, FK → `trips.trip_id` |
| `category_id` | `uuid` | NOT NULL, FK → `expense_categories.category_id` |
| `amount` | `real` | NOT NULL — kwota |
| `date` | `date` | NOT NULL — data wydatku |
| `note` | `text` | Opcjonalna notatka / opis paragonu |

---

## Relacje

| Od | Kardynalność | Do | Znaczenie |
|---|---|---|---|
| `users` | 1 : N | `trip_participants` | użytkownik uczestniczy w wielu podróżach |
| `trips` | 1 : N | `trip_participants` | podróż ma wielu uczestników |
| `trips` | 1 : N | `destinations` | podróż składa się z wielu miejsc |
| `destinations` | 1 : N | `activities` | w miejscu dzieje się wiele aktywności |
| `trips` | 1 : N | `expenses` | podróż ma wiele wydatków |
| `expense_categories` | 1 : N | `expenses` | kategoria grupuje wiele wydatków |

---

## Konwencje

- **Klucze główne:** `uuid` dla obiektów biznesowych (`users`, `trips`, `expenses`, `expense_categories`), `bigint` auto-increment dla zasobów technicznych pod trip (`destinations`, `activities`).
- **Znaczniki czasu:** `timestamp` z `DEFAULT now()` dla `created_at` / `joined_at`.
- **Waluta:** kwoty w `expenses.amount` przechowywane w EUR (przeliczenie z waluty oryginalnej paragonu odbywa się w aplikacji na podstawie kursów EBC — patrz [README.md](../README.md)).
- **Kaskady:** zaleca się `ON DELETE CASCADE` dla FK z `trip_id` (usunięcie podróży kasuje uczestników, destynacje i wydatki). Do doprecyzowania przy tworzeniu migracji Supabase.

---

## Edycja schematu

1. Zmodyfikuj plik [`ERD.dbml`](./ERD.dbml).
2. Wklej zawartość na [dbdiagram.io](https://dbdiagram.io/d), aby zobaczyć podgląd.
3. Wyeksportuj nowy PNG i nadpisz [`ERD.png`](./ERD.png).
4. Zaktualizuj ten dokument, jeśli zmieniły się kolumny lub relacje.
