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
