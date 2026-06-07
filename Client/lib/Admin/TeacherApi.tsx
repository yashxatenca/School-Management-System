import { api } from "../../api/axios";
import { Teacher } from "@/interface/teacher/Teacher.interface";
export type { Teacher };

/* ---------------- CREATE ---------------- */

export const createTeacher = async (payload: Teacher) => {
  const { data } = await api.post("/api/v1/auth/teacher/create", payload);
  return data;
};

/* ---------------- READ ALL ---------------- */

export const fetchTeachers = async () => {
  const { data } = await api.get("/api/v1/auth/teacher/read");

  return data;
};

/* ---------------- READ BY ID ---------------- */

export const fetchTeacherById = async (id: string) => {
  const { data } = await api.get(`/api/v1/auth/teacher/read/${id}`);
  return data;
};

/* ---------------- UPDATE ---------------- */

export const updateTeacher = async (id: string, payload: Partial<Teacher>) => {
  const { data } = await api.put(`/api/v1/auth/teacher/update/${id}`, payload);
  return data;
};

/* ---------------- DELETE ---------------- */

export const deleteTeacher = async (id: string) => {
  const { data } = await api.delete(`/api/v1/auth/teacher/delete/${id}`);
  return data;
};

/* ---------------- LOGIN ---------------- */

export const loginTeacher = async (
  email: string | null,
  password: string | null,
) => {
  const { data } = await api.post("/api/v1/auth/teacher/login", {
    email,
    password,
  });
  return data;
};

/* ---------------- LOGOUT ---------------- */

export const LogoutUser = async () => {
  const { data } = await api.post("/api/v1/auth/teacher/logout");
  return data;
};
