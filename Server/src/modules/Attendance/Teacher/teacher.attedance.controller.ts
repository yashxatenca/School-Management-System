import { Request, Response } from "express";
import { AttendanceTeacherService } from "./teacher.attendance.service";
import { ApiError } from "../../../core/errors/ApiErrors"; // Adjust path if needed

export class AttendanceTeacherController {

    static async GetStudents(req: Request, res: Response) {
        const id = req.user?.id;
        try {
            const students = await AttendanceTeacherService.getStudents(id as string);
            return res.status(200).json({
                success: true,
                data: students,
                message: "Students fetched successfully"
            });
        } catch (error: any) {
            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    static async ProcessAttendance(req: Request, res: Response) {
        try {
            const { classId, date, attendance } = req.body;
            const user = req.user;

            // Basic Validation
            if (!classId || !date || !Array.isArray(attendance)) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: classId, date, or attendance array"
                });
            }

            // Call the service logic
            const result = await AttendanceTeacherService.processAttendance(req.body, user);

            return res.status(200).json({
                success: true,
                message: "Attendance processed successfully",
                data: result
            });

        } catch (error: any) {
            console.error("Attendance Error: ", error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({ success: false, message: error.message });
            }
            // Mongoose validation error handling
            if (error.name === "ValidationError") {
                return res.status(400).json({ success: false, message: error.message });
            }
            // Handle custom locked error from Repo
            if (error.message && error.message.includes("locked")) {
                return res.status(403).json({ success: false, message: error.message });
            }

            return res.status(500).json({
                success: false,
                message: "Internal server error while saving attendance"
            });
        }
    }

    static async GetAttendance(req: Request, res: Response) {
        try {
            const { classId } = req.params;
            const { date, startDate, endDate } = req.query;

            let result;

            if (startDate && endDate) {
                // Fetch Range
                result = await AttendanceTeacherService.getAttendanceByRange(
                    classId,
                    startDate as string,
                    endDate as string
                );
            } else if (date) {
                // Fetch Single Date
                result = await AttendanceTeacherService.getAttendanceByDate(
                    classId,
                    date as string
                );
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Please provide either a 'date' or both 'startDate' and 'endDate' query parameters."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Attendance fetched successfully",
                data: result
            });

        } catch (error: any) {
            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Internal server error fetching attendance" });
        }
    }
}