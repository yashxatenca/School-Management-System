import { Schema, model } from "mongoose";
import { IAttendance } from "./attendance.interface";

const attendanceSchema = new Schema<IAttendance>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "StudentAuth",
      required: true,
    },
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LATE", "EXCUSED"],
      default: "PRESENT",
      required: true,
    },
    remarks: { type: String, trim: true, maxlength: 255 },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "TeacherAuth",
      required: true,
    },
  },
  { timestamps: true },
);

// Unique Compound Index: Ensures 1 record per student per date
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

// Index for fast query by class and date
attendanceSchema.index({ class: 1, date: 1 });

export const AttendanceModel = model<IAttendance>(
  "Attendance",
  attendanceSchema,
);
