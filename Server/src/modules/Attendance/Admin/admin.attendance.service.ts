import { AttendanceRepo } from "./admin.attendance.repo";

export class AttendanceService {

    static async getStudentHistory(studentId: string, startDate?: string, endDate?: string) {
        // Yahan aap future mein aur bhi business logic add kar sakte hain (e.g. calculating % attendance)
        const history = await AttendanceRepo.getAttendanceByStudentIDRepo(studentId, startDate, endDate);
        return history;
    }

    static async getClassHistory(classId: string, date?: string, startDate?: string, endDate?: string) {
        const classData = await AttendanceRepo.getClassAttendanceRepo(classId, date, startDate, endDate);
        return classData;
    }

    static async markSingleStudentAttendance(data: {
        classId: string, date: string, studentId: string, status: "P" | "A" | "L", remarks?: string, adminId: string
    }) {
        return await AttendanceRepo.adminMarkSingleStudentRepo(data);
    }

    static async bulkMarkClassAttendance(data: {
        classId: string, date: string, attendanceArray: any[], adminId: string, shouldLock?: boolean
    }) {
        // Validation: Ensure array is not empty
        if (!data.attendanceArray || data.attendanceArray.length === 0) {
            throw new Error("Attendance array cannot be empty");
        }
        return await AttendanceRepo.adminMarkClassAttendanceRepo(data);
    }
}