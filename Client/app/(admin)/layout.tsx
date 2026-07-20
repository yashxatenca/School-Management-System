"use client";

import { useState } from "react";
import AdminHeader from "@/components/Admin/AdminHeader";
import Sidebar from "@/components/Admin/Sidebar";
import ReduxProvider from "../redux/provider";
import AdminAuthBootstrap from "@/components/Admin/AdminAuthBootstrap"; 

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // min-h-screen ki jagah h-screen aur overflow-hidden use kiya
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      
      {/* Header static rahega top par */}
      <AdminHeader setOpen={setSidebarOpen} isOpen={sidebarOpen} />

      {/* Main container jo header ke baad bachi hui space lega */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar Component */}
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area - Sirf ye hissa scroll hoga */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
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
      <AdminAuthBootstrap />
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </ReduxProvider>
  );
}