"use client";

import { useState } from "react";
import ReduxProvider from "@/app/redux/provider";
import TeacherSidebar from "@/components/Teacher/TeacherSidebar";
import TeacherAuthBootstrap from "@/components/Teacher/TeacherAuthBootstrap";
import TeacherProtectedRoute from "@/components/Teacher/ProtectedTeacherRoute"; // ✅ fixed
import AdminHeader from "@/components/AdminHeader"; // generic header

function TeacherLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <TeacherProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ===== Header ===== */}
        <AdminHeader setOpen={setSidebarOpen} isOpen={sidebarOpen} />

        <div className="flex flex-1 overflow-hidden">

          {/* ===== Sidebar ===== */}
          <TeacherSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          {/* ===== Main Content ===== */}
          <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
            <div className="max-w-7xl mx-auto px-4 py-6">
              {children}
            </div>
          </main>

        </div>
      </div>
    </TeacherProtectedRoute>
  );
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      {/* Init teacher auth */}
      <TeacherAuthBootstrap />

      {/* Layout */}
      <TeacherLayoutInner>{children}</TeacherLayoutInner>
    </ReduxProvider>
  );
}
