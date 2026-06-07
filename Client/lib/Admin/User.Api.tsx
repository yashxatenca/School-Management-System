import { api } from "../../api/axios";
export async function LogoutUser() {
  const res = await api.post("/api/v1/auth/admin/adminlogout");
  return res.data;
}
