"use client";

import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { api } from "@/api/axios";
import { setStudent, logoutStudent } from "@/app/redux/Slice/student.authslice";
import { setStudentClassDetail } from "../redux/Slice/StudentClass.slice";
import { useEffect, useState } from "react";
import ReduxProvider from "@/app/redux/provider";
import StudentSidebar from "@/components/Student/StudentSidebar";
import ProtectedStudentRoute from "@/components/Student/ProtectedStudentRoute";
import StudentHeader from "@/components/Student/StudentHeader";
import GlobalChat from "@/components/Student/ChatBot/Chatbot";
import { RootState } from "../redux/store";

const fetchStudent = async () => {
  try {
    const res = await api.get("/api/v1/auth/student/user");
    if (res.data?.success) {
      return res.data.data;
    }
    return null;
  } catch {
    return null;
  }
};

function StudentLayoutInner({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { authChecked } = useSelector(
    (state: RootState) => state.studentauthstate,
  );

  const { data, isLoading } = useQuery({
    queryKey: ["student-auth"],
    queryFn: fetchStudent,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !authChecked,
  });

  useEffect(() => {
    if (data) {
      dispatch(setStudent(data));
      dispatch(setStudentClassDetail(data.classId));
    } else if (data === null && !isLoading && !authChecked) {
      dispatch(logoutStudent());
    }
  }, [data, isLoading, authChecked, dispatch]);

  if (isLoading && !authChecked) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <ProtectedStudentRoute>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden relative">
        <StudentHeader setOpen={setSidebarOpen} isOpen={sidebarOpen} />

        <div className="flex flex-1 overflow-hidden relative">
          <StudentSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      <GlobalChat />
    </ReduxProvider>
  );
}
