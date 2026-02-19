"use client";

import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { BackendAuthStudentApi } from "@/lib/api/axios";
import { setStudent, logoutStudent } from "@/app/redux/Slice/student.authslice";
import { useEffect, useState } from "react";
import ReduxProvider from "@/app/redux/provider";
import StudentSidebar from "@/components/Student/StudentSidebar";
import ProtectedStudentRoute from "@/components/Student/ProtectedStudentRoute";
import AdminHeader from "@/components/Admin/AdminHeader";

const fetchStudent = async () => {
  try {
    const res = await BackendAuthStudentApi.get(
      "/api/v1/student/auth/user"
    );

    if (res.data?.success) {
      return res.data.student;
    }

    return null;
  } catch {
    return null;
  }
};

function StudentLayoutInner({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["student-auth"],
    queryFn: fetchStudent,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(setStudent(data));
    } else {
      dispatch(logoutStudent());
    }
  }, [data, dispatch]);

  // 🚨 VERY IMPORTANT
  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <ProtectedStudentRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AdminHeader setOpen={setSidebarOpen} isOpen={sidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          <StudentSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

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
      <StudentLayoutInner>{children}</StudentLayoutInner>
    </ReduxProvider>
  );
}
