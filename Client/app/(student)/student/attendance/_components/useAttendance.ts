import { useQuery } from "@tanstack/react-query";
import { studentGetMyAttendanceAPI } from "./attendance.api";
export const useStudentMyAttendance = (date?: string) => {
  return useQuery({
    queryKey: ["studentMyAttendance", date],
    queryFn: () => studentGetMyAttendanceAPI(date),
  });
};
