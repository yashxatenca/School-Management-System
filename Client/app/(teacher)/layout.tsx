"use client";
import { useState } from "react";
import ReduxProvider from "@/app/redux/provider";
import TeacherSidebar from "@/components/Teacher/TeacherSidebar";
import TeacherHeader from "@/components/Teacher/TeacherHeader";
import TeacherAuthBootstrap from "@/components/Teacher/TeacherAuthBootstrap";
import TeacherProtectedRoute from "@/components/Teacher/ProtectedTeacherRoute";
import { ToastContainer } from "react-toastify";
function TeacherLayoutInner({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <TeacherProtectedRoute>
      <div className="min-h-screen bg-gray-50/40 flex flex-col">
        <TeacherHeader setOpen={setSidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          <TeacherSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-50/0 to-gray-100/30">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
    </TeacherProtectedRoute>
  );
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <TeacherAuthBootstrap />
      <TeacherLayoutInner>{children}
        <ToastContainer position="top-right" autoClose={2000} draggable closeOnClick />
      </TeacherLayoutInner>
    </ReduxProvider>
  );
}