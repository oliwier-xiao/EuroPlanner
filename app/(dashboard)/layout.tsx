// ⚠️ UWAGA: Ten plik MUSI być Server Component (BEZ "use client").
// Pobiera ciasteczko `auth-token` i woła Supabase po stronie serwera —
// dzięki temu w pierwszym renderze widać poprawnego użytkownika i awatar
// (brak "flash" stanu niezalogowanego).
//
// ❌ NIE dodawaj tutaj "use client" — Next.js 15 nie pozwala na
//    `async` w Client Components, dostaniesz błąd:
//    "<DashboardLayout> is an async Client Component".
//
// ✅ Cała interaktywność (sidebar, menu, przyciski) siedzi w
//    `./DashboardChrome.tsx` — tam jest "use client".
//
// `import "server-only"` poniżej powoduje, że jeśli ktoś przypadkiem
// zaimportuje ten plik z Client Component, dostanie czytelny błąd
// przy buildzie zamiast hydration error.
import "server-only";
import { cookies } from "next/headers";
import DashboardChrome from "./DashboardChrome";
import { getCurrentUser, formatUserDisplayName } from "@/lib/auth/getCurrentUser";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("auth-token")?.value;

  const user =
    userId && UUID_RE.test(userId) ? await getCurrentUser(userId) : null;

  return (
    <DashboardChrome
      initialDisplayName={user ? formatUserDisplayName(user) : "Użytkownik"}
      initialAvatarId={user?.avatar_id ?? null}
    >
      {children}
    </DashboardChrome>
  );
}
