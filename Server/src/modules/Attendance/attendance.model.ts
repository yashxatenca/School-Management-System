import mongoose, { Schema, Document } from "mongoose";
import { IAttendance } from "./attendance.interface";

export interface IAttendanceDocument extends Omit<IAttendance, '_id'>, Document { }

const attendanceSchema = new Schema<IAttendanceDocument>(
    {
        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: [true, "Class ID is required"],
            index: true,
        },

        date: {
            type: String,
            required: [true, "Date is required"],
            match: [/^\d{4}-\d{2}-\d{2}$/, "Please use valid YYYY-MM-DD format"],
            index: true,
        },

        attendance: [
            {
                studentId: {
                    type: Schema.Types.ObjectId,
                    ref: "StudentAuth",
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["P", "A", "L"],
                    required: true,
                },
                remarks: {
                    type: String,
                    trim: true,
                    maxlength: [100, "Remarks cannot exceed 100 characters"],
                    default: "",
                },
                markedBy: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    // 🔥 Fixed: Use refPath for dynamic reference inside an array
                    refPath: "attendance.markedByModel",
                },
                markedByModel: {
                    type: String,
                    required: true,
                    enum: ["TeacherAuth", "Admin"],
                },
                role: {
                    type: String,
                    enum: ["teacher", "admin"],
                    required: true,
                },
            },
        ],

        lastUpdatedBy: {
            type: Schema.Types.ObjectId,
            required: true,
            // 🔥 Fixed: Also made this dynamic
            refPath: "lastUpdatedByModel",
        },

        lastUpdatedByModel: {
            type: String,
            required: true,
            enum: ["TeacherAuth", "Admin"],
        },

        lastUpdatedRole: {
            type: String,
            enum: ["teacher", "admin"],
            required: true,
        },

        isLocked: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// 🔥 Unique constraint: Ek class, ek din = Sirf ek document (Removed section)
attendanceSchema.index({ classId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendanceDocument>(
    "Attendance",
    attendanceSchema
);