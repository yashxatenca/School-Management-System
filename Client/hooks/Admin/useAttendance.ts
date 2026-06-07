import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/api/axios";
import { toast } from "react-toastify";
const markClassAttendanceAPI = async (payload: any) => {
  const res = await api.post(`/api/v1/admin/attendance/bulk`, payload);
  return res.data;
};
const getClassAttendanceAPI = async (classId: string, date: string) => {
  const res = await api.get(
    `/api/v1/admin/attendance/class/${classId}?date=${date}`,
  );
  return res.data;
};
export const useGetClassAttendance = (classId: string, date: string) => {
  return useQuery({
    queryKey: ["attendance", classId, date],
    queryFn: () => getClassAttendanceAPI(classId, date),
    enabled: !!classId && !!date,
  });
};

export const useMarkClassAttendance = () => {
  return useMutation({
    mutationFn: markClassAttendanceAPI,
    onSuccess: () => toast.success("Attendance saved successfully!"),
    onError: () => toast.error("Error saving attendance."),
  });
};
