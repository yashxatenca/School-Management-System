import { useQuery } from "@tanstack/react-query";
import {
  fetchAttendanceBySingleDate,
  fetchAttendanceByRangeDate,
} from "@/lib/Student/Student.attendance.api";

// 1. Hook for Single Date Attendance
export const useFetchAttendanceBySingleDate = (date?: string) => {
  return useQuery({
    // Query key ensures caching is handled properly based on the date
    queryKey: ["attendance", "single", date],
    queryFn: async () => {
      if (!date) throw new Error("Date is required");
      const res = await fetchAttendanceBySingleDate(date);
      return res.data;
    },
    // Query tabhi run hogi jab date available hogi
    enabled: !!date,
  });
};

// 2. Hook for Range Date Attendance
export const useFetchAttendanceByRangeDate = (
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    // Cache key includes both dates
    queryKey: ["attendance", "range", startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate) {
        throw new Error("Start date and End date are required");
      }
      const res = await fetchAttendanceByRangeDate(startDate, endDate);
      return res.data;
    },
    // Query tabhi run hogi jab dono dates available hongi
    enabled: !!startDate && !!endDate,
  });
};
