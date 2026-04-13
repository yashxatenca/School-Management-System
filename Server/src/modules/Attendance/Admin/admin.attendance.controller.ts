import { Request, Response, NextFunction } from "express";
import { AttendanceService } from "./admin.attendance.service";

export class AttendanceController {

    // 1. Get Single Student History
    static async getStudentAttendance(req: Request, res: Response, next: NextFunction) {
        try {
            const studentId = req.params.studentId as string; // 6-digit ID aayegi URL se
            const { startDate, endDate } = req.query;

            const data = await AttendanceService.getStudentHistory(
                studentId,
                startDate as string,
                endDate as string
            );

            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error); // Express error handler ko bhej do
        }
    }

    // 2. Get Class Attendance
    static async getClassAttendance(req: Request, res: Response, next: NextFunction) {
        try {
            const classId = req.params.classId as string;
            const date = req.query.date as string;
            const startDate = req.query.startDate as string;
            const endDate = req.query.endDate as string;

            const data = await AttendanceService.getClassHistory(
                classId,
                date,
                startDate,
                endDate
            );

            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    // 3. Mark/Update Single Student
    static async updateSingleStudent(req: Request, res: Response, next: NextFunction) {
        try {
            const { classId, date, studentId, status, remarks } = req.body;
            const adminId = (req as any).user._id; // Auth middleware se aayega

            const result = await AttendanceService.markSingleStudentAttendance({
                classId, date, studentId, status, remarks, adminId
            });

            res.status(200).json({
                success: true,
                message: "Student attendance updated successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    // 4. Bulk Mark/Update Class
    static async updateClassAttendance(req: Request, res: Response, next: NextFunction) {
        try {
            const { classId, date, attendanceArray, shouldLock } = req.body;
            const adminId = (req as any).user._id; // Auth middleware se aayega

            const result = await AttendanceService.bulkMarkClassAttendance({
                classId, date, attendanceArray, adminId, shouldLock
            });

            res.status(200).json({
                success: true,
                message: "Class attendance updated successfully",
                data: result
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
}