import { api } from "@/api/axios";

export const getTotalDashboard = async () => {
  return api.get("/api/v1/admin/dashboard/getdashboard");
};
