"use client";

import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { api } from "@/lib/api/axios";
import { setTeacher, logoutTeacher } from "@/app/redux/Slice/teacher.auth.slice";
import { setClassDetail } from "@/app/redux/Slice/TeacherClass.slice";
import { useEffect } from "react";

const fetchTeacher = async () => {
  const res = await api.get("/api/v1/auth/teacher/profile");
  return res.data.teacher;
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
      dispatch(setTeacher(data?.teacher));
      dispatch(setClassDetail({ classes: data?.classData.classes, studentCount: data?.classData.studentCount }))
    }
  }, [isSuccess, data, dispatch]);
  useEffect(() => {
    if (isError) {
      dispatch(logoutTeacher());
    }
  }, [isError, dispatch]);

  return null;
}
