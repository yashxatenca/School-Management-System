"use client";

import { useState } from "react";
import AdminHeader from "@/components/Admin/AdminHeader";
import Sidebar from "@/components/Admin/Sidebar";
import ReduxProvider from "../redux/provider";
import AdminAuthBootstrap from "@/components/Admin/AdminAuthBootstrap"; // 👈 ISE IMPORT KAREIN (path apne hisaab se adjust kar lena)

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header always full-width */}
      <AdminHeader setOpen={setSidebarOpen} isOpen={sidebarOpen} />

      {/* Main flex container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-72 transform transition-transform duration-300 ease-in-out
            lg:relative lg:translate-x-0 lg:z-auto lg:flex lg:flex-col lg:h-screen
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            bg-white border-r border-gray-200
            lg:border-r lg:shadow-none
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

        {/* Main content area */}
        <main className="flex-1 min-w-0 overflow-y-auto lg:ml-0 pt-16 lg:pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      {/* 👇 YAHAN ADD KAREIN taaki app load hote hi API call ho */}
      <AdminAuthBootstrap />
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ReduxProvider>
  );
}
