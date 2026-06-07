// hooks/useAttendance.ts (Ya jahan aapne baaki hooks rakhe hain)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";

// Bulk Attendance API Call
const markClassAttendanceAPI = async (payload: any) => {
  // Apne actual backend route ka URL dalein
  const res = await api.post(`/api/v1/admin/attendance/bulk`, payload);
  return res.data;
};

export const useMarkClassAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markClassAttendanceAPI,
    onSuccess: () => {
      // Success hone par attendance reports ka cache clear karein (agar dashboard par dikha rahe hain)
      // queryClient.invalidateQueries({ queryKey: ['attendanceReports'] });
      alert("Attendance saved successfully!");
    },
    onError: (error) => {
      console.error("Failed to save attendance:", error);
      alert("Error saving attendance. Please try again.");
    },
  });
};
