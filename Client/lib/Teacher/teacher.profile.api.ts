import { api } from "@/api/axios";

export const getTeacherProfile = async () => {
  const { data } = await api.get("/api/v1/teacher/profile");
  return data.data;
};

export const createTeacherProfile = async (payload: any) => {
  const { data } = await api.post("/api/v1/teacher/profile", payload);
  return data.data;
};

export const updateTeacherProfile = async (payload: any) => {
  const { data } = await api.put("/api/v1/teacher/profile", payload);
  return data.data;
};
