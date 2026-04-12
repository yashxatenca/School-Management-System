import { Types } from "mongoose";
import { Attendance } from "../attendance.model";
import { StudentAuth } from "../../auth/Student/models/student.auth.model";
import { ApiError } from "../../../core/errors/ApiErrors";

export class AttendanceRepo {

    // =========================================================
    // 1. HELPER METHOD: Find Student by 6-digit ID
    // =========================================================
    static async #getstudent(studentId: string) {
        if (!studentId) {
            throw new ApiError(400, "Student ID is required");
        }

        // 6-digit custom ID se find karna (Make sure field name matches your DB)
        const student = await StudentAuth.findOne({ studentId_custom: studentId });

        if (!student) {
            throw new ApiError(404, "Student not found");
        }
        return student;
    }

    // =========================================================
    // 2. GET: Single Student Attendance History (With Date/Range Filters)
    // =========================================================
    static async getAttendanceByStudentIDRepo(
        studentId: string,
        startDate?: string,
        endDate?: string
    ) {
        const student = await this.#getstudent(studentId);

        let query: any = {
            "attendance.studentId": student._id
        };

        // Apply Date Filters
        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        } else if (startDate) {
            query.date = startDate;
        }

        const history = await Attendance.find(query)
            .populate({
                path: "classId",
                select: "className section"
            })
            .sort({ date: -1 });

        // Clean response for frontend (Flattening)
        return history.map(doc => {
            const studentEntry = doc.attendance.find(
                (a: any) => a.studentId.toString() === student._id.toString()
            );
            return {
                date: doc.date,
                classInfo: doc.classId,
                status: studentEntry?.status,
                remarks: studentEntry?.remarks,
                markedByModel: studentEntry?.markedByModel,
                isLocked: doc.isLocked
            };
        });
    }

    // =========================================================
    // 3. GET: Full Class Attendance (With Date/Range Filters)
    // =========================================================
    static async getClassAttendanceRepo(
        classId: string,
        date?: string,
        startDate?: string,
        endDate?: string
    ) {
        if (!classId) {
            throw new ApiError(400, "Class ID is required");
        }

        let query: any = { classId: new Types.ObjectId(classId) };

        // Apply Date Filters
        if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        } else if (date) {
            query.date = date;
        }

        return await Attendance.find(query)
            .populate({
                path: "attendance.studentId",
                select: "name studentId_custom rollNumber",
            })
            .populate({
                path: "lastUpdatedBy",
                select: "name",
            })
            .sort({ date: -1 })
            .lean(); // Faster query execution for large data
    }

    // =========================================================
    // 4. ADMIN UPSERT: Mark/Update Single Student
    // =========================================================
    static async adminMarkSingleStudentRepo(data: {
        classId: string,
        date: string,
        studentId: string, // MongoDB _id of the student
        status: "P" | "A" | "L",
        remarks?: string,
        adminId: string
    }) {
        const { classId, date, studentId, status, remarks, adminId } = data;

        const record = await Attendance.findOne({ classId, date });

        if (record) {
            // Sheet exists -> Update the specific student in the array
            const studentIndex = record.attendance.findIndex(
                (entry) => entry.studentId.toString() === studentId
            );

            if (studentIndex > -1) {
                // Update existing student
                record.attendance[studentIndex].status = status;
                record.attendance[studentIndex].remarks = remarks || "";
                record.attendance[studentIndex].markedBy = new Types.ObjectId(adminId);
                record.attendance[studentIndex].markedByModel = "Admin";
            } else {
                // Add new student to the existing sheet
                record.attendance.push({
                    studentId: new Types.ObjectId(studentId),
                    status,
                    remarks: remarks || "",
                    markedBy: new Types.ObjectId(adminId),
                    markedByModel: "Admin",
                    role: "admin"
                });
            }

            // Update Metadata
            record.lastUpdatedBy = new Types.ObjectId(adminId);
            record.lastUpdatedByModel = "Admin";
            record.lastUpdatedRole = "admin";

            return await record.save();
        } else {
            // No sheet exists -> Create a new one with this student
            return await Attendance.create({
                classId,
                date,
                attendance: [{
                    studentId,
                    status,
                    remarks: remarks || "",
                    markedBy: adminId,
                    markedByModel: "Admin",
                    role: "admin"
                }],
                lastUpdatedBy: adminId,
                lastUpdatedByModel: "Admin",
                lastUpdatedRole: "admin",
                isLocked: false
            });
        }
    }

    // =========================================================
    // 5. ADMIN UPSERT: Bulk Mark/Update Entire Class
    // =========================================================
    static async adminMarkClassAttendanceRepo(data: {
        classId: string,
        date: string,
        attendanceArray: Array<{
            studentId: string,
            status: "P" | "A" | "L",
            remarks?: string
        }>,
        adminId: string,
        shouldLock?: boolean
    }) {
        const { classId, date, attendanceArray, adminId, shouldLock } = data;

        // Map array to add Admin audit details
        const formattedAttendance = attendanceArray.map(item => ({
            studentId: new Types.ObjectId(item.studentId),
            status: item.status,
            remarks: item.remarks || "",
            markedBy: new Types.ObjectId(adminId),
            markedByModel: "Admin" as const,
            role: "admin" as const
        }));

        // Upsert: Update if exists, Create if not
        return await Attendance.findOneAndUpdate(
            { classId: new Types.ObjectId(classId), date },
            {
                $set: {
                    attendance: formattedAttendance,
                    lastUpdatedBy: new Types.ObjectId(adminId),
                    lastUpdatedByModel: "Admin",
                    lastUpdatedRole: "admin",
                    isLocked: shouldLock || false
                }
            },
            { upsert: true, new: true, runValidators: true }
        );
    }
}