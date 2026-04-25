# Baza Danych – Europlanner

Dokument opisuje strukturę bazy danych aplikacji **Europlanner**. Źródło prawdy dla diagramu: [`ERD.dbml`](./ERD.dbml) (DBML) oraz [`ERD.png`](./ERD.png) (podgląd wizualny).

- **Silnik:** PostgreSQL (hostowany w [Supabase](https://supabase.com/))
- **Autoryzacja:** ręczna — własna tabela `Users` z hasłem (kolumna `password`). Supabase Auth **nie jest** używane.
- **Edytor diagramu:** [dbdiagram.io](https://dbdiagram.io/d) — wklej zawartość `ERD.dbml`

> ⚠️ **Konwencja nazw:** wszystkie nazwy tabel w bazie są w **PascalCase** (np. `Users`, `Trips`, `Trip_participants`, `Expense_categories`). Nazwy kolumn — w `snake_case`, z jednym wyjątkiem: `Users.Admin_access` (z dużą `A`).

---

## Diagram ERD

![Diagram ERD](./ERD.png)

---

## Tabele

### `Users` — użytkownicy aplikacji
Konta zarejestrowanych użytkowników. Hasło przechowywane w kolumnie `password` (logowanie obsługiwane w `app/api/auth/login/route.ts`).

| Kolumna | Typ | Uwagi |
|---|---|---|
| `user_id` | `uuid` | **PK** |
| `name` | `text` | Imię |
| `surname` | `text` | Nazwisko |
| `password` | `text` | NOT NULL |
| `Admin_access` | `boolean` | DEFAULT `false`. **Uwaga:** nazwa z dużej `A`. |
| `avatar_id` | `text` | FK logiczny → `lib/avatars.ts` (np. `yellow-smile`, `fox`). DEFAULT `'yellow-smile'`. |
| `email` | `text` | UNIQUE. Opcjonalne przy rejestracji. |

> 💡 W kodzie patrz: [`lib/auth/getCurrentUser.ts`](../lib/auth/getCurrentUser.ts), [`app/api/auth/register/route.ts`](../app/api/auth/register/route.ts).

---

### `Trips` — podróże
Centralny obiekt aplikacji — każda wyprawa ma swój budżet i ramy czasowe.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `trip_id` | `uuid` | **PK** |
| `title` | `varchar` | NOT NULL — nazwa podróży |
| `description` | `varchar` | Opcjonalny opis |
| `start_date` | `date` | Data rozpoczęcia |
| `end_date` | `date` | Data zakończenia |
| `budget_limit` | `numeric` | Limit budżetu w EUR |
| `created_at` | `timestamp` | DEFAULT `now()` |
| `slug` | `text` | UNIQUE — używany w URL-ach (np. `/trips/wakacje-w-pradze-a3f9`). Generowany przez [`lib/slug.ts`](../lib/slug.ts). |

---

### `Trip_participants` — uczestnicy podróży (relacja M:N)
Łączy użytkowników z podróżami i przypisuje im role.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `trip_id` | `uuid` | **PK**, FK → `Trips.trip_id` |
| `user_id` | `uuid` | **PK**, FK → `Users.user_id` |
| `role` | `varchar` | NOT NULL — dozwolone wartości: `owner`, `member` |
| `joined_at` | `timestamp` | DEFAULT `now()` |

> **Uwaga:** klucz główny to para `(trip_id, user_id)` — jeden użytkownik może być tylko raz uczestnikiem danej podróży.

---

### `Destinations` — miejsca docelowe w ramach podróży
Przystanki / miasta, które składają się na trasę podróży.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `destination_id` | `bigint` (`int8`) | **PK**, auto-increment |
| `trip_id` | `uuid` | NOT NULL, FK → `Trips.trip_id` |
| `name` | `text` | NOT NULL — nazwa miasta / miejsca |
| `lat` | `real` (`float4`) | Szerokość geograficzna |
| `lng` | `real` (`float4`) | Długość geograficzna |
| `arrival_date` | `date` | Data przyjazdu |
| `departure_date` | `date` | Data wyjazdu |
| `visit_order` | `smallint` (`int2`) | Kolejność zwiedzania na trasie |

---

### `Activities` — aktywności w danym miejscu
Konkretne atrakcje / punkty programu przypisane do `Destinations`.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `activity_id` | `bigint` (`int8`) | **PK**, auto-increment |
| `destination_id` | `bigint` (`int8`) | NOT NULL, FK → `Destinations.destination_id` |
| `title` | `varchar` | Nazwa aktywności |
| `start_time` | `timestamp` | Godzina rozpoczęcia |
| `cost` | `real` (`float4`) | Orientacyjny koszt |
| `is_completed` | `boolean` | DEFAULT `false` — czy aktywność została zrealizowana |

---

### `Expense_categories` — słownik kategorii wydatków
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

### `Expenses` — wydatki
Pojedyncze wydatki poniesione w ramach podróży, przypisane do kategorii.

| Kolumna | Typ | Uwagi |
|---|---|---|
| `expense_id` | `uuid` | **PK** |
| `trip_id` | `uuid` | NOT NULL, FK → `Trips.trip_id` |
| `category_id` | `uuid` | NOT NULL, FK → `Expense_categories.category_id` |
| `amount` | `real` (`float4`) | NOT NULL — kwota |
| `date` | `date` | NOT NULL — data wydatku |
| `note` | `text` | Opcjonalna notatka / opis paragonu |

---

## Relacje

| Od | Kardynalność | Do | Znaczenie |
|---|---|---|---|
| `Users` | 1 : N | `Trip_participants` | użytkownik uczestniczy w wielu podróżach |
| `Trips` | 1 : N | `Trip_participants` | podróż ma wielu uczestników |
| `Trips` | 1 : N | `Destinations` | podróż składa się z wielu miejsc |
| `Destinations` | 1 : N | `Activities` | w miejscu dzieje się wiele aktywności |
| `Trips` | 1 : N | `Expenses` | podróż ma wiele wydatków |
| `Expense_categories` | 1 : N | `Expenses` | kategoria grupuje wiele wydatków |

---

## Konwencje

- **Nazwy tabel:** `PascalCase` (np. `Users`, `Trip_participants`). Cały kod w `app/api/**` i `lib/**` używa właśnie tej formy — nie zmieniać na lowercase, bo zapytania przestaną działać.
- **Klucze główne:** `uuid` dla obiektów biznesowych (`Users`, `Trips`, `Expenses`, `Expense_categories`), `bigint` auto-increment dla zasobów technicznych (`Destinations`, `Activities`).
- **Znaczniki czasu:** `timestamp` z `DEFAULT now()` dla `created_at` / `joined_at`.
- **Waluta:** kwoty w `Expenses.amount` przechowywane w EUR (przeliczenie z waluty oryginalnej paragonu odbywa się w aplikacji na podstawie kursów EBC — patrz [README.md](../README.md)).
- **Kaskady:** zaleca się `ON DELETE CASCADE` dla FK z `trip_id` (usunięcie podróży kasuje uczestników, destynacje i wydatki).

---

## 🛠️ Migracje — jak wprowadzać zmiany w schemacie

> Projekt **nie korzysta z formalnego narzędzia migracyjnego** (Prisma / Drizzle / `supabase migration`). Wszystkie zmiany są wprowadzane ręcznie przez SQL Editor w Supabase Studio. Przy każdej zmianie należy:
> 1. Zmodyfikować [`ERD.dbml`](./ERD.dbml).
> 2. Wkleić go na [dbdiagram.io](https://dbdiagram.io/d), wyeksportować nowy PNG i nadpisać [`ERD.png`](./ERD.png).
> 3. Zaktualizować ten dokument (`DATABASE.md`).
> 4. Dodać snippet SQL do sekcji „Historia zmian" poniżej, żeby reszta zespołu mogła odpalić ten sam SQL u siebie po pull-u.

### Jak uruchomić migrację SQL u siebie

1. Otwórz Supabase Studio: `http://<adres-serwera>:54323` (lokalnie) lub dashboard Supabase Cloud.
2. Lewe menu → **SQL Editor** → **New query**.
3. Wklej snippet z sekcji „Historia zmian" poniżej.
4. Kliknij **Run**.

### Historia zmian

#### 2025‑11 — `Users.email` (logowanie i edycja konta)
> Commit: `b27a03a feat(account): kolumna email + edycja danych konta w ustawieniach`

```sql
ALTER TABLE "Users"
  ADD COLUMN IF NOT EXISTS email text;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
  ON "Users" (lower(email))
  WHERE email IS NOT NULL;
```

#### 2025‑11 — `Users.avatar_id` (wybór awatara)
> Commit: `9f382c3 feat(avatars): wybór awatara per użytkownik z zapisem do bazy`

```sql
ALTER TABLE "Users"
  ADD COLUMN IF NOT EXISTS avatar_id text DEFAULT 'yellow-smile';

UPDATE "Users" SET avatar_id = 'yellow-smile' WHERE avatar_id IS NULL;
```

#### 2025‑11 — `Trips.slug` (przyjazne URL-e)
> Commit: `532cd80 feat(trips): URL-e ze slug-iem zamiast UUID`

```sql
ALTER TABLE "Trips"
  ADD COLUMN IF NOT EXISTS slug text;

CREATE UNIQUE INDEX IF NOT EXISTS trips_slug_unique
  ON "Trips" (slug)
  WHERE slug IS NOT NULL;

-- Wypełnij slugi dla istniejących wierszy (jeden raz, ręcznie):
-- UPDATE "Trips" SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(trip_id::text, 1, 4) WHERE slug IS NULL;

ALTER TABLE "Trips" ALTER COLUMN slug SET NOT NULL;
```

### Jak sprawdzić, czy moja baza jest aktualna

```sql
-- Powinno zwrócić wszystkie 7 tabel:
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Powinno zwrócić email, avatar_id w Users:
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'Users';

-- Powinno zwrócić slug w Trips:
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'Trips';
```

Jeśli czegoś brakuje — odpal odpowiednią sekcję z „Historia zmian" w SQL Editorze.

> 🛟 **Fallback w kodzie:** [`lib/auth/getCurrentUser.ts`](../lib/auth/getCurrentUser.ts) ma defensywny `try/catch` na wypadek braku kolumn `email` / `avatar_id` — w logach pojawi się ostrzeżenie `[getCurrentUser] Brak kolumny email/avatar_id — uruchom migracje SQL`. To dosłownie znaczy: odpal migracje powyżej.
