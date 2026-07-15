import mongoose, { Schema } from "mongoose";
import { ILeave } from "./leave.interface";

const LeaveSchema = new Schema<ILeave>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "TeacherAuth",
      required: true,
    },
    principalId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    leaveType: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

// ==========================================
// PERFORMANCE INDEXES
// ==========================================

// Optimizes: Fetching a specific teacher's leaves sorted by newest first
LeaveSchema.index({ teacherId: 1, createdAt: -1 });

// Optimizes: Principal fetching all "Pending" requests to review
LeaveSchema.index({ status: 1 });

export const LeaveModel = mongoose.model<ILeave>("Leave", LeaveSchema);
