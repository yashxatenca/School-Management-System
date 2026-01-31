"use client";

import { useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import ReduxProvider from "../redux/provider";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header always full-width */}
      <AdminHeader setOpen={setSidebarOpen} isOpen={sidebarOpen} />

      {/* Main flex container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – fixed on mobile (drawer), static & full-height on desktop */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0 lg:z-auto lg:flex lg:flex-col lg:h-screen
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            bg-white border-r border-gray-200
            lg:border-r lg:shadow-none           /* ← no shadow on desktop */
          `}
        >
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area – takes remaining space, no extra gap */}
        <main className="
          flex-1 min-w-0 overflow-y-auto
          lg:ml-0                      /* ← we control offset via sidebar positioning */
          pt-16 lg:pt-0                /* header height compensation */
        ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ReduxProvider>
  );
}