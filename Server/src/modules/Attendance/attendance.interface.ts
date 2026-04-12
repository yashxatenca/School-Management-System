import { Types } from "mongoose";

export type Role = "teacher" | "admin";
export type AttendanceStatus = "P" | "A" | "L";
export type AuthModelType = "TeacherAuth" | "Admin"; // Common type for models

export interface IAttendanceEntry {
    studentId: Types.ObjectId;
    status: AttendanceStatus;
    remarks?: string;
    markedBy: Types.ObjectId;
    markedByModel: AuthModelType; // 🔥 Added this
    role: Role;
}

export interface IAttendance {
    _id?: Types.ObjectId;
    classId: Types.ObjectId;
    date: string;

    attendance: IAttendanceEntry[];

    lastUpdatedBy: Types.ObjectId;
    lastUpdatedByModel: AuthModelType; // 🔥 Added this for tracking updates properly
    lastUpdatedRole: Role;

    isLocked: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}