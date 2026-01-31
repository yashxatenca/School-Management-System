// app/(app)/layout.tsx
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </>
  );
}
