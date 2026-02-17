"use client";

import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { BackendStudentApi } from "@/lib/axios";
import { setStudent, logoutStudent } from "@/app/redux/Slice/student.auth.slice";
import { useEffect } from "react";

const fetchStudent = async () => {
  const res = await BackendStudentApi.get("/api/student/auth/user");
  return res.data.user;
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
      dispatch(setStudent(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(logoutStudent());
    }
  }, [isError, dispatch]);

  return null;
}
