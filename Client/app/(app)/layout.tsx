// app/(app)/layout.tsx
"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/ui/Hero";

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
