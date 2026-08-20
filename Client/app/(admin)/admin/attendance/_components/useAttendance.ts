import { useQuery } from "@tanstack/react-query";
import {
  attendanceApi,
  DateCardsResponse,
  ClassAttendanceResponse,
  StudentAttendanceResponse,
} from "./attendance.api";

// 1. Hook: Fetch Date Cards
export function useAdminDateCards(
  classId: string,
  year: number,
  month: number,
) {
  return useQuery<DateCardsResponse>({
    queryKey: ["admin-date-cards", classId, year, month],
    queryFn: () => attendanceApi.getDateCards(classId, year, month),
    enabled: Boolean(classId && year && month),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

// 2. Hook: Fetch Class Logs by Date
export function useAdminClassAttendance(classId: string, date: string) {
  return useQuery<ClassAttendanceResponse>({
    queryKey: ["admin-class-attendance", classId, date],
    queryFn: () => attendanceApi.getClassAttendance(classId, date),
    enabled: Boolean(classId && date),
  });
}

// 3. Hook: Fetch Student Attendance Logs
export function useAdminStudentAttendance(studentId: string, date?: string) {
  return useQuery<StudentAttendanceResponse>({
    queryKey: ["admin-student-attendance", studentId, date],
    queryFn: () => attendanceApi.getStudentAttendance(studentId, date),
    enabled: Boolean(studentId && studentId.trim().length === 24), // Prevents invalid ObjectID queries
  });
}
