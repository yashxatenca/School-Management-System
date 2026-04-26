import {
    Request, Response
} from "express";
import { AttendanceTeacherService } from "./teacher.attendance.service";
export class AttendanceTeacherController {
    static async GetStudents(req: Request, res: Response) {
        const id = req.user?.id;
        try {
            const students = await AttendanceTeacherService.getStudents(id as string);
            return res.status(200).json({ success: true, data: students });
        } catch (error) {
            return res.status(500).json({ success: false, message: error });
        }

    }
}