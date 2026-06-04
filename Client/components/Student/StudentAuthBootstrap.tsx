"use client";

import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { api } from "@/lib/api/axios";
import { setStudent, logoutStudent } from "@/app/redux/Slice/student.authslice";
import { useEffect } from "react";
// Agar TypeScript use kar rahe ho toh RootState import kar lena
import { RootState } from "@/app/redux/store";

const fetchStudent = async () => {
  try {
    const res = await api.get("/api/v1/student/auth/user");
    if (res.data?.success) {
      return res.data.student; // Make sure backend se ye 'student' object hi bhej raha hai
    }
    return null;
  } catch (error) {
    throw new Error("Failed to fetch student");
  }
};

export default function StudentAuthBootstrap({ children }) {
  const dispatch = useDispatch();

  // 🔥 YAHAN CHANGE KIYA HAI: Aapke naye slice structure ke hisaab se state update ki
  const { user: currentStudent, authChecked } = useSelector(
    (state: RootState) => state.studentauthstate,
  );
  console.log(currentStudent);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["student-auth"],
    queryFn: fetchStudent,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !authChecked,
  });

  useEffect(() => {
    if (isSuccess && data) {
      // API se data mil gaya, Redux mein set kar do
      dispatch(setStudent(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      // API fail ho gayi (token nahi hai ya expire ho gaya)
      dispatch(logoutStudent());
    }
  }, [isError, dispatch]);

  // Is component ko ab loading state khud handle karne ki zaroorat nahi hai,
  // kyunki wo aapka `ProtectedStudentRoute` handle kar raha hai `authChecked` ke through.

  return <>{children}</>;
}
