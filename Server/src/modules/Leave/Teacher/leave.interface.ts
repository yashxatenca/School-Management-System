import { Document, Types } from "mongoose";

export interface ILeave extends Document {
  teacherId: Types.ObjectId;
  principalId?: Types.ObjectId; // Optional until the principal approves/rejects
  startDate: Date;
  endDate: Date;
  leaveType: string; // e.g., 'Sick', 'Casual'
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}
