import { Document, Types } from "mongoose";

export interface ILeave extends Document {
  teacherId: Types.ObjectId | string;
  principalId?: Types.ObjectId | string; // Optional until the principal approves/rejects
  startDate: Date | string;
  endDate: Date | string;
  leaveType: string; // e.g., 'Sick', 'Casual'
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}
