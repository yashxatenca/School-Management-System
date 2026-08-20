import {
  BulkAttendancePayload,
  DateCardSummary,
  AttendanceLog,
} from "./attendance.types";
import { api } from "@/api/axios";

const API = api;

// ================= TEACHER APIs =================
export const teacherMarkAttendanceAPI = async (
  payload: BulkAttendancePayload,
) => {
  const response = await API.post("/api/v1/teacher/attendance/mark", payload);
  return response.data;
};

export const teacherGetClassAttendanceAPI = async (
  classId: string,
  date: string,
) => {
  const response = await API.get<{
    success: boolean;
    count: number;
    data: AttendanceLog[];
  }>(`/api/v1/teacher/attendance/class/${classId}?date=${date}`);
  return response.data;
};

export const teacherDeleteAttendanceAPI = async (attendanceId: string) => {
  const response = await API.delete(
    `/api/v1/teacher/attendance/${attendanceId}`,
  );
  return response.data;
};

// ================= ADMIN APIs =================
export const adminGetClassCardsAPI = async (
  classId: string,
  year: number,
  month: number,
) => {
  const response = await API.get<{
    success: boolean;
    year: number;
    month: number;
    cards: DateCardSummary[];
  }>(`/admin/attendance/class/${classId}/cards?year=${year}&month=${month}`);
  return response.data;
};

export const adminGetAttendanceByStudentAPI = async (
  studentId: string,
  date?: string,
) => {
  const query = date ? `?date=${date}` : "";
  const response = await API.get<{
    success: boolean;
    count: number;
    data: AttendanceLog[];
  }>(`/admin/attendance/student/${studentId}${query}`);
  return response.data;
};

export const adminGetAttendanceByClassAPI = async (
  classId: string,
  date: string,
) => {
  const response = await API.get<{
    success: boolean;
    count: number;
    data: AttendanceLog[];
  }>(`/admin/attendance/class/${classId}?date=${date}`);
  return response.data;
};

// ================= STUDENT APIs =================
export const studentGetMyAttendanceAPI = async (date?: string) => {
  const query = date ? `?date=${date}` : "";
  const response = await API.get<{
    success: boolean;
    count: number;
    data: AttendanceLog[];
  }>(`/student/attendance/my-attendance${query}`);
  return response.data;
};
