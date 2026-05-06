import mongoose from "mongoose";
import { Attendance, IAttendanceDocument } from "../attendance.model"; // Adjust path as needed
import { IAttendance } from "../attendance.interface"; // Adjust path as needed

// Interface for the array items being passed during an update/add
export interface IStudentAttendanceInput {
    studentId: string | mongoose.Types.ObjectId;
    status: "P" | "A" | "L";
    remarks?: string;
    markedBy: string | mongoose.Types.ObjectId;
    markedByModel: "TeacherAuth" | "Admin";
    role: "teacher" | "admin";
}

// Interface for the updater metadata
export interface IUpdaterInfo {
    lastUpdatedBy: string | mongoose.Types.ObjectId;
    lastUpdatedByModel: "TeacherAuth" | "Admin";
    lastUpdatedRole: "teacher" | "admin";
}

export class AttendanceTeacherRepo {

    // ==========================================
    // 1. ADD OR UPDATE ATTENDANCE (UPSERT)
    // ==========================================
    /**
     * Adds new attendance or updates existing attendance for a specific class and date.
     * Uses `upsert: true` so it creates a new document if one doesn't exist.
     */
    static async addOrUpdateAttendance(
        classId: string | mongoose.Types.ObjectId,
        date: string,
        attendanceList: IStudentAttendanceInput[],
        updaterInfo: IUpdaterInfo
    ): Promise<IAttendanceDocument> {

        // 1. Check if an existing record is locked before attempting an update
        const existingRecord = await Attendance.findOne({ classId, date });
        if (existingRecord && existingRecord.isLocked) {
            throw new Error("Attendance for this date is locked and cannot be modified.");
        }

        // 2. Define the payload
        const updatePayload = {
            $set: {
                attendance: attendanceList,
                lastUpdatedBy: updaterInfo.lastUpdatedBy,
                lastUpdatedByModel: updaterInfo.lastUpdatedByModel,
                lastUpdatedRole: updaterInfo.lastUpdatedRole,
            }
        };

        // 3. Execute the FindOneAndUpdate with upsert
        const result = await Attendance.findOneAndUpdate(
            { classId, date },
            updatePayload,
            {
                new: true,          // Return the modified document
                upsert: true,       // Create if it doesn't exist
                runValidators: true // Enforce schema validations (e.g., YYYY-MM-DD format)
            }
        );

        return result;
    }

    // ==========================================
    // 2. FETCH ATTENDANCE BY SPECIFIC DATE
    // ==========================================
    /**
     * Retrieves the attendance record for a single, specific date.
     */
    static async getAttendanceByDate(
        classId: string | mongoose.Types.ObjectId,
        date: string
    ): Promise<IAttendanceDocument | null> {
        return await Attendance.findOne({ classId, date })
            .populate("attendance.studentId", "name rollNumber") // Optional: populate student details
            .populate("lastUpdatedBy", "name email");            // Optional: populate updater details
    }

    // ==========================================
    // 3. FETCH ATTENDANCE IN A DATE RANGE
    // ==========================================
    /**
     * Retrieves all attendance records for a class between a start and end date.
     * Because your dates are formatted strictly as YYYY-MM-DD, MongoDB string comparison works perfectly.
     */
    static async getAttendanceByDateRange(
        classId: string | mongoose.Types.ObjectId,
        startDate: string,
        endDate: string
    ): Promise<IAttendanceDocument[]> {
        return await Attendance.find({
            classId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: 1 }); // Sort by date ascending (oldest first)
    }

    // ==========================================
    // 4. UTILITY METHODS
    // ==========================================

    /**
     * Legacy strictly "Create" method (if needed bypassing upsert)
     */
    static async create(attendanceData: Partial<IAttendance>): Promise<IAttendanceDocument> {
        const newRecord = new Attendance(attendanceData);
        return await newRecord.save();
    }

    /**
     * Save an already fetched/modified Mongoose document instance
     */
    static async saveDocument(document: IAttendanceDocument): Promise<IAttendanceDocument> {
        return await document.save();
    }
}