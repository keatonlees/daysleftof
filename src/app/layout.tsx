import NavBar from "@/components/NavBar/NavBar";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "DaysLeftOf",
  description: "Super Simple Countdowns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pastel" className={`antialiased`}>
      <body>
        <AuthProvider>
          <NavBar />
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
