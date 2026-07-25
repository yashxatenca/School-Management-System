import { api } from "../../api/axios";
export async function LogoutUser() {
  const res = await api.post("/api/v1/admin/auth/adminlogout");
  return res.data;
}
