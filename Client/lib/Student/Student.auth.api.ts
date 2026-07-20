import { api } from "../../api/axios";

export const login = async (email: string, password: string) => {
  const response = await api.post("/api/v1/auth/student/login", {
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await api.get("/api/v1/auth/student/logout");
  return response.data;
};
