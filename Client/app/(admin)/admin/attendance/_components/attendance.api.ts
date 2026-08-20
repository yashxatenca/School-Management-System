import { api } from "@/api/axios";

// TypeScript Interfaces
export interface DateCard {
  date: string;
  isMarked: boolean;
  totalMarked: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount?: number;
}

export interface DateCardsResponse {
  success: boolean;
  year: number;
  month: number;
  cards: DateCard[];
}

export interface ClassAttendanceLog {
  _id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  remarks?: string;
  student: {
    _id: string;
    name: string;
    rollNumber?: string;
    email?: string;
  };
  markedBy?: {
    _id: string;
    name: string;
  };
}

export interface ClassAttendanceResponse {
  success: boolean;
  count: number;
  data: ClassAttendanceLog[];
}

export interface StudentAttendanceLog {
  _id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  remarks?: string;
}

export interface StudentAttendanceResponse {
  success: boolean;
  count: number;
  data: StudentAttendanceLog[];
}

// Modular API Functions
export const attendanceApi = {
  // 1. Fetch Class Monthly Date Cards
  getDateCards: async (
    classId: string,
    year: number,
    month: number,
  ): Promise<DateCardsResponse> => {
    const { data } = await api.get<DateCardsResponse>(
      `/api/v1/admin/attendance/class/${classId}/cards`,
      { params: { year, month } },
    );
    return data;
  },

  // 2. Fetch Attendance Log for Class on specific Date
  getClassAttendance: async (
    classId: string,
    date: string,
  ): Promise<ClassAttendanceResponse> => {
    const { data } = await api.get<ClassAttendanceResponse>(
      `/api/v1/admin/attendance/class/${classId}`,
      { params: { date } },
    );
    return data;
  },

  // 3. Fetch Attendance History for Specific Student
  getStudentAttendance: async (
    studentId: string,
    date?: string,
  ): Promise<StudentAttendanceResponse> => {
    const { data } = await api.get<StudentAttendanceResponse>(
      `/api/v1/admin/attendance/student/${studentId}`,
      { params: date ? { date } : undefined },
    );
    return data;
  },
};
