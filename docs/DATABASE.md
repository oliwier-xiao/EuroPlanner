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
| `name` | `text` | NOT NULL, imię |
| `surname` | `text` | Nazwisko |
| `email` | `text` | Opcjonalny e-mail |
| `password` | `text` | NOT NULL — docelowo obsługiwane przez Supabase Auth |
| `admin_access` | `boolean` | NOT NULL |
| `avatar_id` | `text` | Opcjonalne ID avatara |

---

### `trips` — podróże
Centralny obiekt aplikacji — każda wyprawa ma swój budżet i ramy czasowe.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `trip_id` | `uuid` | **PK** |
| `slug` | `text` | NOT NULL — unikalny identyfikator URL (technicznie) |
| `title` | `varchar` | NOT NULL — nazwa podróży |
| `description` | `varchar` | Opcjonalny opis |
| `start_date` | `date` | Data rozpoczęcia |
| `end_date` | `date` | Data zakończenia |
| `budget_limit` | `numeric` | Limit budżetu w EUR |
| `created_at` | `timestamp` | NOT NULL |

---

### `trip_participants` — uczestnicy podróży (relacja M:N)
Łączy użytkowników z podróżami i przypisuje im role.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `trip_id` | `uuid` | NOT NULL, FK → `trips.trip_id` |
| `user_id` | `uuid` | FK → `users.user_id` (opcjonalne) |
| `role` | `varchar` | NOT NULL — dozwolone wartości: `owner`, `member` |
| `joined_at` | `timestamp` | NOT NULL |

> **Uwaga:** para `(trip_id, user_id)` jest oznaczona jako unikalna — zapobiega duplikatom przypisania tego samego użytkownika do tej samej podróży.

---

### `destinations` — miejsca docelowe w ramach podróży
Przystanki/miasta, które składają się na trasę podróży.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `destination_id` | `bigint` | **PK** |
| `trip_id` | `uuid` | NOT NULL, FK → `trips.trip_id` |
| `name` | `text` | NOT NULL — nazwa miasta/miejsca |
| `lat` | `real` | Szerokość geograficzna |
| `lng` | `real` | Długość geograficzna |
| `arrival_date` | `date` | Data przyjazdu |
| `departure_date` | `date` | Data wyjazdu |
| `visit_order` | `smallint` | Kolejność zwiedzania na trasie |

---

### `expense_categories` — słownik kategorii wydatków
Lista predefiniowanych kategorii (np. transport, jedzenie, noclegi).

| Kolumna | Typ | Uwagi |
|---|---|---|
| `category_id` | `uuid` | **PK** |
| `name` | `varchar` | NOT NULL, nazwa kategorii |

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
| `category_id` | `uuid` | FK → `expense_categories.category_id` (opcjonalne) |
| `amount` | `real` | NOT NULL — kwota |
| `date` | `date` | NOT NULL — data wydatku |
| `note` | `text` | Opcjonalna notatka / opis paragonu |

---

## Relacje

| Od | Kardynalność | Do | Znaczenie |
|---|---|---|---|
| `users` | 1 : 0..N | `trip_participants` | uczestnik może, ale nie musi mieć powiązanego użytkownika |
| `trips` | 1 : N | `trip_participants` | podróż ma wielu uczestników |
| `trips` | 1 : N | `destinations` | podróż składa się z wielu miejsc |
| `trips` | 1 : N | `expenses` | podróż ma wiele wydatków |
| `expense_categories` | 1 : N | `expenses` | kategoria grupuje wiele wydatków |

---

## Konwencje

- **Klucze główne:** `uuid` dla obiektów biznesowych (`users`, `trips`, `expenses`, `expense_categories`), `bigint` dla tabeli `destinations`.
- **Znaczniki czasu:** `created_at` i `joined_at` są wymagane (`NOT NULL`) i ustawiane po stronie aplikacji/migracji.
- **Waluta:** kwoty w `expenses.amount` przechowywane w EUR (przeliczenie z waluty oryginalnej paragonu odbywa się w aplikacji na podstawie kursów EBC — patrz [README.md](../README.md)).
- **Kaskady:** zaleca się `ON DELETE CASCADE` dla FK z `trip_id` (usunięcie podróży kasuje uczestników, destynacje i wydatki). Do doprecyzowania przy tworzeniu migracji Supabase.

---

## Edycja schematu

1. Zmodyfikuj plik [`ERD.dbml`](./ERD.dbml).
2. Wklej zawartość na [dbdiagram.io](https://dbdiagram.io/d), aby zobaczyć podgląd.
3. Wyeksportuj nowy PNG i nadpisz [`ERD.png`](./ERD.png).
4. Zaktualizuj ten dokument, jeśli zmieniły się kolumny lub relacje.
