// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EuroPlanner - Zaplanuj swoją podróż",
  description: "Najlepszy planer podróży po Europie",
  icons: {
    icon: [{ url: "/icons/favicon.png", type: "image/png", sizes: "any" }],
    shortcut: "/icons/favicon.png",
    apple: "/icons/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
