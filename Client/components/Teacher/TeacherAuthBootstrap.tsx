"use client";

import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { BackendTeacherApi } from "@/lib/api/axios";
import { setTeacher, logoutTeacher } from "@/app/redux/Slice/teacher.auth.slice";
import { useEffect } from "react";

const fetchTeacher = async () => {
  const res = await BackendTeacherApi.get("/api/teacher/auth/user");
  return res.data.user;
};

export default function TeacherAuthBootstrap() {
  const dispatch = useDispatch();

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["teacher-auth"],
    queryFn: fetchTeacher,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setTeacher(data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(logoutTeacher());
    }
  }, [isError, dispatch]);

  return null;
}
