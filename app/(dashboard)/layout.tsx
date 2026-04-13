// app/(dashboard)/layout.tsx
import React from "react";

// Tymczasowo zakomentowane, dopóki nie zrobimy lib/session.ts
// import { redirect } from "next/navigation";
// import { getCurrentUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mockujemy użytkownika (udajemy, że jest zalogowany), aby build przeszedł
  const user = { id: "1", name: "Developer" }; 

  // Zakomentowana logika przekierowania
  /*
  if (!user) {
    redirect("/login");
  }
  */

  return (
    <div className="min-h-screen">
      {/* Tutaj możesz później dodać swój Sidebar */}
      {children}
    </div>
  );
}
