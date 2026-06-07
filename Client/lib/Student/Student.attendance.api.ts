import { api } from "@/api/axios";

// API Functions
export const fetchAttendanceBySingleDate = (date: string) => {
  return api.get(`/api/v1/student/attendance/${date}`);
};

export const fetchAttendanceByRangeDate = (
  startDate: string,
  endDate: string,
) => {
  return api.get(
    `/api/v1/student/attendance?startDate=${startDate}&endDate=${endDate}`,
  );
};
