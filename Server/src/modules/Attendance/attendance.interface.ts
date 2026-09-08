import { Document, Types } from "mongoose";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
ce
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


export interface AttendanceRecordDTO {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}


export interface BulkAttendanceDTO {
  classId: string;
  date: string; // YYYY-MM-DD
  records: AttendanceRecordDTO[];
}


export interface DateCardSummary {
  date: string; // YYYY-MM-DD
  isMarked: boolean;
  totalMarked?: number;
  presentCount?: number;
  absentCount?: number;
  lateCount?: number;
}
