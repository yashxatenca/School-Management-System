"use client";

import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { BackendAuthStudentApi } from "@/lib/api/axios";
import { setStudent, logoutStudent } from "@/app/redux/Slice/student.authslice";
import { useEffect } from "react";

const fetchStudent = async () => {
  try {
    const res = await BackendAuthStudentApi.get(
      "/api/v1/student/auth/user"
    );

    if (res.data?.success) {
      return res.data.student;
    }

    return null;
  } catch (error) {
    return null;
  }
};


export default function StudentAuthBootstrap() {
  const dispatch = useDispatch();

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["student-auth"],
    queryFn: fetchStudent,
    retry: false,
    refetchOnWindowFocus: false,
  });
useEffect(() => {
  if (isSuccess && data) {
    dispatch(setStudent(data)); // because now data = student
  }
}, [isSuccess, data, dispatch]);


  useEffect(() => {
    if (isError) {
      dispatch(logoutStudent());
    }
  }, [isError, dispatch]);

  return null;
}
