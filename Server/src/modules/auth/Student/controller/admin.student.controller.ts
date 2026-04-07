import { Request, Response } from "express";
import { AdminStudentService } from "../service/admin.student.service";


export class AdminStudentController {
    static async GetByStudentId(req: Request, res: Response) {
        try {
            const studentId = req.params.studentId as string;
            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    message: "Student ID is required",
                });
            }

            const student = await AdminStudentService.FindByStudentId(studentId);
            return res.status(200).json({
                success: true,
                data: student,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal server error",
            });
        }
    }

}