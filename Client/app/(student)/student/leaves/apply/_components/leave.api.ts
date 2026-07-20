import { api } from "@/api/axios";
import { LeavePayload } from "./leave.interface";
export const createLeave = async (Payload: LeavePayload) => {
  return await api.post("/api/v1/student/leave/apply", Payload);
};

export const deleteLeave = async (LeaveId: string) => {
  return await api.delete(`/api/v1/student/leave/${LeaveId}`);
};

export const fetchLeave = async () => {
  return await api.get("/api/v1/student/leave/get-leave");
};
