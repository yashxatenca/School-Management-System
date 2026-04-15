import { Types } from "mongoose";
import { Attendance } from "../attendance.model";
import { StudentAuth } from "../../auth/Student/models/student.auth.model";
import { ApiError } from "../../../core/errors/ApiErrors";

const formatDate = (date: string | Date) => {
    if (!date) throw new ApiError(400, "Date is required");
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new ApiError(400, "Invalid date format");
    return d.toISOString().split("T")[0];
};

export class AttendanceRepo {

    static async #getStudent(studentId: string) {
        if (!studentId) throw new ApiError(400, "Student ID is required");

        const student = await StudentAuth.findOne({
            studentId_custom: studentId
        });

        if (!student) throw new ApiError(404, "Student not found");

        return student;
    }

    static async getAttendanceByStudentIDRepo(
        studentId: string,
        startDate?: string,
        endDate?: string
    ) {
        const student = await this.#getStudent(studentId);

        let query: any = {
            "attendance.studentId": student._id
        };

        if (startDate && endDate) {
            query.date = {
                $gte: formatDate(startDate),
                $lte: formatDate(endDate)
            };
        } else if (startDate) {
            query.date = formatDate(startDate);
        }

        const history = await Attendance.find(query)
            .select("date classId attendance isLocked")
            .populate({ path: "classId", select: "className section" })
            .sort({ date: -1 })
            .lean();

        return history.map((doc: any) => {
            const entry = doc.attendance?.find(
                (a: any) => a.studentId.toString() === student._id.toString()
            );

            return {
                date: doc.date,
                classInfo: doc.classId,
                status: entry?.status || null,
                remarks: entry?.remarks || "",
                markedByModel: entry?.markedByModel || null,
                isLocked: doc.isLocked
            };
        });
    }

    static async getClassAttendanceRepo(
        classId: string,
        date?: string,
        startDate?: string,
        endDate?: string
    ) {
        if (!classId) throw new ApiError(400, "Class ID is required");

        let query: any = {
            classId: new Types.ObjectId(classId)
        };

        if (startDate && endDate) {
            query.date = {
                $gte: formatDate(startDate),
                $lte: formatDate(endDate)
            };
        } else if (date) {
            query.date = formatDate(date);
        }

        return await Attendance.find(query)
            .populate({
                path: "attendance.studentId",
                select: "name studentId"
            })
            .populate({
                path: "lastUpdatedBy",
                select: "name"
            })
            .sort({ date: -1 })
            .lean();
    }

    // =========================================================
    // 4. ADMIN UPSERT: Mark/Update Single Student
    // =========================================================
    static async adminMarkSingleStudentRepo(data: {
        classId: string,
        date: string,
        studentId: string,
        status: "P" | "A" | "L",
        remarks?: string,
        adminId: string
    }) {
        const { classId, date, studentId, status, remarks, adminId } = data;

        if (!studentId) throw new ApiError(400, "studentId is required");

        const formattedDate = formatDate(date);

        const record = await Attendance.findOne({
            classId: new Types.ObjectId(classId),
            date: formattedDate
        });

        if (record?.isLocked) throw new ApiError(403, "Attendance is locked");

        if (record) {
            // BUG FIX: Find the specific subdocument inside the array
            const existingStudent = record.attendance.find(
                (e: any) => e.studentId.toString() === studentId.toString()
            );

            if (existingStudent) {
                // Update properties directly (Mongoose correctly tracks this as an UPDATE)
                existingStudent.status = status;
                existingStudent.remarks = remarks || "";
                existingStudent.markedBy = new Types.ObjectId(adminId);
                existingStudent.markedByModel = "Admin";
            } else {
                // Not found in existing list? Push as new.
                record.attendance.push({
                    studentId: new Types.ObjectId(studentId),
                    status,
                    remarks: remarks || "",
                    markedBy: new Types.ObjectId(adminId),
                    markedByModel: "Admin",
                    role: "admin"
                } as any);
            }

            record.lastUpdatedBy = new Types.ObjectId(adminId);
            record.lastUpdatedByModel = "Admin";
            record.lastUpdatedRole = "admin";

            return await record.save();
        }

        // Create completely new sheet if it doesn't exist
        return await Attendance.create({
            classId: new Types.ObjectId(classId),
            date: formattedDate,
            attendance: [{
                studentId: new Types.ObjectId(studentId),
                status,
                remarks: remarks || "",
                markedBy: new Types.ObjectId(adminId),
                markedByModel: "Admin",
                role: "admin"
            }],
            lastUpdatedBy: new Types.ObjectId(adminId),
            lastUpdatedByModel: "Admin",
            lastUpdatedRole: "admin",
            isLocked: false
        });
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

        if (!Array.isArray(attendanceArray)) {
            throw new ApiError(400, "attendanceArray must be an array");
        }

        attendanceArray.forEach((item, i) => {
            if (!item.studentId) throw new ApiError(400, `studentId missing at index ${i}`);
            if (!["P", "A", "L"].includes(item.status)) {
                throw new ApiError(400, `Invalid status at index ${i}`);
            }
        });

        const formattedDate = formatDate(date);

        const existingRecord = await Attendance.findOne({
            classId: new Types.ObjectId(classId),
            date: formattedDate
        });

        if (existingRecord?.isLocked) {
            throw new ApiError(403, "Attendance is locked");
        }

        if (existingRecord) {
            // BUG FIX: Iterate incoming data and update existing subdocuments directly
            attendanceArray.forEach(incomingItem => {
                const existingStudent = existingRecord.attendance.find(
                    (e: any) => e.studentId.toString() === incomingItem.studentId.toString()
                );

                if (existingStudent) {
                    // Modifying directly updates the record properly
                    existingStudent.status = incomingItem.status;
                    existingStudent.remarks = incomingItem.remarks || "";
                    existingStudent.markedBy = new Types.ObjectId(adminId);
                    existingStudent.markedByModel = "Admin";
                } else {
                    // Only add if student is genuinely not in the array
                    existingRecord.attendance.push({
                        studentId: new Types.ObjectId(incomingItem.studentId),
                        status: incomingItem.status,
                        remarks: incomingItem.remarks || "",
                        markedBy: new Types.ObjectId(adminId),
                        markedByModel: "Admin",
                        role: "admin"
                    } as any);
                }
            });

            existingRecord.lastUpdatedBy = new Types.ObjectId(adminId);
            existingRecord.lastUpdatedByModel = "Admin";
            existingRecord.lastUpdatedRole = "admin";

            if (shouldLock !== undefined) {
                existingRecord.isLocked = shouldLock;
            }

            return await existingRecord.save();
        }

        // If no sheet exists for the day, create a new one
        const formattedAttendance = attendanceArray.map(item => ({
            studentId: new Types.ObjectId(item.studentId),
            status: item.status,
            remarks: item.remarks || "",
            markedBy: new Types.ObjectId(adminId),
            markedByModel: "Admin" as const,
            role: "admin" as const
        }));

        return await Attendance.create({
            classId: new Types.ObjectId(classId),
            date: formattedDate,
            attendance: formattedAttendance,
            lastUpdatedBy: new Types.ObjectId(adminId),
            lastUpdatedByModel: "Admin",
            lastUpdatedRole: "admin",
            isLocked: shouldLock || false
        });
    }
}