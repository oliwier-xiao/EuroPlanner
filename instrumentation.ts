export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { validateAllEnv } = await import("./lib/env");
  const { server, client } = validateAllEnv();

  if (server.length === 0 && client.length === 0) return;

  const yellow = "\x1b[33m";
  const reset = "\x1b[0m";
  const bold = "\x1b[1m";

  const lines: string[] = [
    "",
    `${bold}⚠  Brakuje wymaganych zmiennych środowiskowych w .env.local${reset}${yellow}`,
    "",
  ];

  if (server.length > 0) {
    lines.push("  Server-side (potrzebne dla API routes):");
    server.forEach((key) => lines.push(`    ✗ ${key}`));
    lines.push("");
  }

  if (client.length > 0) {
    lines.push("  Client-side (potrzebne dla browsera/SSR):");
    client.forEach((key) => lines.push(`    ✗ ${key}`));
    lines.push("");
  }

  lines.push("  → Skopiuj .env.example do .env.local i uzupełnij wartości");
  lines.push("  → Service role key: https://supabase.com/dashboard/project/_/settings/api");
  lines.push("");

  console.warn(yellow + lines.join("\n") + reset);
}
