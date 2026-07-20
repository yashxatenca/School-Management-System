import { api } from "@/api/axios";

export const getPendingLeaves = async () => {
  const { data } = await api.get("/api/v1/admin/leave/pending-leave");
  return data;
};

export const updateLeaveStatus = async (payload: {
  leaveId: string;
  status: "Approved" | "Rejected";
}) => {
  const { data } = await api.put("/api/v1/admin/leave/approval", payload);
  return data;
};
