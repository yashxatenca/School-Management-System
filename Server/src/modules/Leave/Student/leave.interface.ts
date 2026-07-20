import { Document, Types } from "mongoose";

export interface ILeave extends Document {
  studentId: Types.ObjectId | string;
  teacherId?: Types.ObjectId | string; 
  startDate: Date;
  endDate: Date;
  leaveType: string; // e.g., 'Sick', 'Casual'
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}
