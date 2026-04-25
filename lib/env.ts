/**
 * Centralna walidacja zmiennych środowiskowych.
 *
 * Używaj `getServerEnv()` w kodzie server-only (API routes, server components)
 * oraz `getClientEnv()` tam, gdzie potrzebny jest `NEXT_PUBLIC_*`.
 *
 * Wszystkie błędy mają wspólny typ `MissingEnvError`, dzięki czemu
 * można je wyłapać w API routes i zwrócić sensowny komunikat.
 */

const REQUIRED_SERVER_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const REQUIRED_CLIENT_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

type ServerEnvKey = (typeof REQUIRED_SERVER_ENV)[number];
type ClientEnvKey = (typeof REQUIRED_CLIENT_ENV)[number];

export type ServerEnv = Record<ServerEnvKey, string>;
export type ClientEnv = Record<ClientEnvKey, string>;

export class MissingEnvError extends Error {
  readonly missing: readonly string[];
  readonly scope: "server" | "client";

  constructor(missing: readonly string[], scope: "server" | "client") {
    super(`Brak wymaganych zmiennych środowiskowych (${scope}): ${missing.join(", ")}`);
    this.name = "MissingEnvError";
    this.missing = missing;
    this.scope = scope;
  }
}

function findMissing(keys: readonly string[]): string[] {
  return keys.filter((key) => {
    const value = process.env[key];
    return !value || value.trim() === "";
  });
}

export function getServerEnv(): ServerEnv {
  const missing = findMissing(REQUIRED_SERVER_ENV);
  if (missing.length > 0) {
    throw new MissingEnvError(missing, "server");
  }
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  };
}

export function getClientEnv(): ClientEnv {
  const missing = findMissing(REQUIRED_CLIENT_ENV);
  if (missing.length > 0) {
    throw new MissingEnvError(missing, "client");
  }
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}

export function validateAllEnv(): { server: string[]; client: string[] } {
  return {
    server: findMissing(REQUIRED_SERVER_ENV),
    client: findMissing(REQUIRED_CLIENT_ENV),
  };
}

export function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

/**
 * Buduje komunikat błędu dla odpowiedzi API.
 *
 * - W produkcji: zwraca generyczne `"Brak konfiguracji serwera"`
 *   (żeby nie wyciekać szczegółów infrastruktury).
 * - W dev: dokleja listę brakujących zmiennych dla szybszego debugowania.
 */
export function configErrorMessage(error: unknown): string {
  const generic = "Brak konfiguracji serwera";

  if (!isDev()) return generic;

  if (error instanceof MissingEnvError) {
    return `${generic}: brakuje ${error.missing.join(", ")} (scope: ${error.scope})`;
  }

  if (error instanceof Error && error.message) {
    return `${generic}: ${error.message}`;
  }

  return generic;
}
