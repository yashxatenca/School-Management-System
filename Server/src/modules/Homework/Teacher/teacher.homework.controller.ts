import { Request, Response } from "express";
import { TeacherHomeworkService } from "./teacher.homework.service";
import { IHomework } from "../homework.interface";
import { ApiError } from "../../../core/errors/ApiErrors";
export class TeacherHomeworkController {
    static async createHomework(req: Request, res: Response): Promise<void> {
        try {
            const data = { ...req.body, assignedById: req.user?.id, assignedUser: "TeacherAuth" }
            const homework = await TeacherHomeworkService.createHomework(data);
            res.status(201).json({ success: true, data: homework });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getHomeworkByClassId(req: Request, res: Response): Promise<void> {
        try {
            const { classId } = req.params as { classId: string };
            const userId = req.user?.id as string;
            const homework = await TeacherHomeworkService.getHomeworkByClassId(classId, userId);
            res.status(200).json({ success: true, data: homework });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}