"use client";

import { useState } from "react";
import ReduxProvider from "@/app/redux/provider";
import StudentSidebar from "@/components/Student/StudentSidebar";
import StudentAuthBootstrap from "@/components/Student/StudentAuthBootstrap";
import ProtectedStudentRoute from "@/components/Student/ProtectedStudentRoute";
import AdminHeader from "@/components/AdminHeader";

function StudentLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedStudentRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* ===== Header ===== */}
        <AdminHeader setOpen={setSidebarOpen} isOpen={sidebarOpen} />

        <div className="flex flex-1 overflow-hidden">

          {/* ===== Sidebar ===== */}
          <StudentSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          {/* ===== Main Content ===== */}
          <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
            <div className="max-w-7xl mx-auto px-4 py-6">
              {children}
            </div>
          </main>

        </div>
      </div>
    </ProtectedStudentRoute>
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      {/* Initialize student auth on refresh */}
      <StudentAuthBootstrap />

      {/* Layout */}
      <StudentLayoutInner>{children}</StudentLayoutInner>
    </ReduxProvider>
  );
}
