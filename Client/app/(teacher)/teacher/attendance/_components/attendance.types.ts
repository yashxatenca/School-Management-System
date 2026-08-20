// Shared Attendance Status Type
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

// 1. Single Student Record DTO (Matches Backend: AttendanceRecordDTO)
export interface AttendanceRecordDTO {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

// 2. Bulk Save/Update Payload (Matches Backend: BulkAttendanceDTO)
export interface BulkAttendancePayload {
  classId: string;
  date: string; // YYYY-MM-DD
  records: AttendanceRecordDTO[];
}

// 3. Date Card Summary (Matches Backend: DateCardSummary)
export interface DateCardSummary {
  date: string; // YYYY-MM-DD
  isMarked: boolean;
  totalMarked?: number;
  presentCount?: number;
  absentCount?: number;
  lateCount?: number;
}

// --- Populated Objects Types for API Response ---
export interface PopulatedStudent {
  _id: string;
  name?: string;
  studentId?: string; // Roll number / Student Code
  rollNumber?: string;
  email?: string;
}

export interface PopulatedClass {
  _id: string;
  name?: string;
  section?: string;
}

export interface PopulatedUser {
  _id: string;
  name?: string;
}

// 4. Attendance Log Response from Backend API
// Fix: Handle studentId as either Populated Object or Raw ID String
export interface AttendanceLog {
  _id: string;
  studentId: PopulatedStudent | string; // Backend schema uses 'studentId', not 'student'
  class: PopulatedClass | string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
  markedBy?: PopulatedUser | string;
  createdAt?: string;
  updatedAt?: string;
}

// 5. Helper Type for UI Component State Management
export interface LocalAttendanceRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: AttendanceStatus;
  remarks: string;
  attendanceId?: string;
}
