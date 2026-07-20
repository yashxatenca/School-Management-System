"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { setStudent, logoutStudent } from "@/app/redux/Slice/student.authslice";
import { RootState } from "@/app/redux/store";

// 1. Interface add kiya props ke liye
interface StudentAuthBootstrapProps {
  children: React.ReactNode;
}

const fetchStudent = async () => {
  try {
    const res = await api.get("/api/v1/student/auth/user");
    if (res.data?.success) {
      return res.data.student;
    }
    return null;
  } catch (error) {
    throw new Error("Failed to fetch student");
  }
};

// 2. Destructuring mein ab proper interface ka use ho raha hai
export default function StudentAuthBootstrap({
  children,
}: StudentAuthBootstrapProps) {
  const dispatch = useDispatch();

  const { authChecked } = useSelector(
    (state: RootState) => state.studentauthstate,
  );

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["student-auth"],
    queryFn: fetchStudent,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !authChecked,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setStudent(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(logoutStudent());
    }
  }, [isError, dispatch]);

  return <>{children}</>;
}
