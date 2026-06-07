"use client";

import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux"; // ✅ useSelector import kiya
import { api } from "@/api/axios";
import { setStudent, logoutStudent } from "@/app/redux/Slice/student.authslice";
import { useEffect, useState } from "react";
import ReduxProvider from "@/app/redux/provider";
import StudentSidebar from "@/components/Student/StudentSidebar";
import ProtectedStudentRoute from "@/components/Student/ProtectedStudentRoute";
import AdminHeader from "@/components/Admin/AdminHeader";

const fetchStudent = async () => {
  try {
    const res = await api.get("/api/v1/auth/student/user");

    if (res.data?.success) {
      return res.data.data; // Yahan se direct student object return ho raha hai
    }

    return null;
  } catch {
    return null;
  }
};

function StudentLayoutInner({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Redux se authChecked state nikal li
  const { authChecked } = useSelector((state: any) => state.studentauthstate);

  const { data, isLoading } = useQuery({
    queryKey: ["student-auth"],
    queryFn: fetchStudent,
    retry: false,
    refetchOnWindowFocus: false,
    // ✅ Agar login se aaye ho (authChecked true hai), toh API call rok do
    enabled: !authChecked,
  });

  useEffect(() => {
    if (data) {
      // ✅ data.data ko theek karke sirf data kar diya
      dispatch(setStudent(data));
    } else if (data === null && !isLoading && !authChecked) {
      // ✅ Agar user null hai aur loading khatam ho chuki hai, tabhi logout karo
      dispatch(logoutStudent());
    }
  }, [data, isLoading, authChecked, dispatch]);

  // 🚨 Layout loader tabhi dikhega jab pehli baar check ho raha ho
  if (isLoading && !authChecked) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <ProtectedStudentRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AdminHeader setOpen={setSidebarOpen} isOpen={sidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          <StudentSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
            <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
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
