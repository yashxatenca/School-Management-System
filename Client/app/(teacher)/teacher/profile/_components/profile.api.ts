import { api } from "@/api/axios";

// GET Profile API
export const fetchTeacherProfileAPI = async () => {
  const res = await api.get("/api/v1/teacher/profile/get-profile");
  return res.data;
};

// PUT/Update Profile API
export const updateTeacherProfileAPI = async (payload: any) => {
  const res = await api.put(`/api/v1/teacher/profile/`, payload);
  return res.data;
};
