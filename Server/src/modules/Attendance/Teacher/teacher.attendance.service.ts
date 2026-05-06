import { ApiError } from "../../../core/errors/ApiErrors";
import { TeacherHelperRepo } from "../../Helper/Teacher/teacher.helper.repo";
import { AttendanceTeacherRepo as AttendanceRepository } from "./teacher.attendance.repo";

export class AttendanceTeacherService {
    static async getStudents(teacherId: string) {
        if (!teacherId) {
            throw new ApiError(402, "Details are required");
        }
        try {
            const classId = await TeacherHelperRepo.getClassIdwithTeacherId(teacherId);
            if (!classId) {
                throw new ApiError(404, "Class not found");
            }
            const students = await TeacherHelperRepo.getStudentByClassId(classId._id.toString());
            if (!students) {
                throw new ApiError(404, "Students not found");
            }
            return students;
        } catch (error) {
            throw error;
        }
    }

    static async processAttendance(payload: any, user: any) {
        const { classId, date, attendance } = payload;

        // Handle both _id (MongoDB standard) and id (JWT payload standard)
        const teacherId = user._id || user.id;
        const role = user.role || "teacher";
        const modelName = role === "admin" ? "Admin" : "TeacherAuth";

        // Format the incoming attendance array to match the schema requirements
        const formattedAttendance = attendance.map((student: any) => ({
            studentId: student.studentId,
            status: student.status,
            remarks: student.remarks || "",
            markedBy: teacherId,
            markedByModel: modelName,
            role: role
        }));

        // Prepare the metadata for the updater
        const updaterInfo = {
            lastUpdatedBy: teacherId,
            lastUpdatedByModel: modelName,
            lastUpdatedRole: role
        };

        // Delegate the complex creation/updating logic directly to the repository's Upsert method
        return await AttendanceRepository.addOrUpdateAttendance(
            classId,
            date,
            formattedAttendance,
            updaterInfo
        );
    }

    static async getAttendanceByDate(classId: string, date: string) {
        if (!classId || !date) {
            throw new ApiError(400, "Class ID and Date are required");
        }
        const record = await AttendanceRepository.getAttendanceByDate(classId, date);
        if (!record) {
            throw new ApiError(404, "No attendance record found for this date");
        }
        return record;
    }

    static async getAttendanceByRange(classId: string, startDate: string, endDate: string) {
        if (!classId || !startDate || !endDate) {
            throw new ApiError(400, "Class ID, Start Date, and End Date are required");
        }
        return await AttendanceRepository.getAttendanceByDateRange(classId, startDate, endDate);
    }
}