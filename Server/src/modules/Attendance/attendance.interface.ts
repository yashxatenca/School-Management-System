import { Document, Types } from "mongoose";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

// Mongoose Document Interface
export interface IAttendance extends Document {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  class: Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Single Record DTO for Bulk Payload
export interface AttendanceRecordDTO {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

// Bulk Upsert DTO (Works for 1 or many students)
export interface BulkAttendanceDTO {
  classId: string;
  date: string; // YYYY-MM-DD
  records: AttendanceRecordDTO[];
}

// Response structure for Date Cards Feature
export interface DateCardSummary {
  date: string; // YYYY-MM-DD
  isMarked: boolean;
  totalMarked?: number;
  presentCount?: number;
  absentCount?: number;
  lateCount?: number;
}
