import { Request, Response } from 'express';
import { teacherhomeworkService } from './teacher.homework.service';

export class HomeworkController {

    // POST /api/homework
    async create(req: Request, res: Response): Promise<void> {
        try {
            // req.user.id auth middleware se aayega (Admin/Teacher ID)
            const assignedById = req.user?.id;
            const data = { ...req.body, assignedById };

            const newHomework = await teacherhomeworkService.createHomework(data, req.user?.role as string);
            res.status(201).json({ success: true, data: newHomework });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // GET /api/homework?classId=123&subjectId=456
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const filters = {
                classId: req.query.classId as string,
                subjectId: req.query.subjectId as string,
            };
            const homeworkList = await teacherhomeworkService.fetchAllHomework(filters);
            res.status(200).json({ success: true, data: homeworkList });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // GET /api/homework/:id
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const homework = await teacherhomeworkService.fetchHomeworkById(req.params.id as string);
            res.status(200).json({ success: true, data: homework });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    // PUT /api/homework/:id
    async update(req: Request, res: Response): Promise<void> {
        try {
            const updatedHomework = await teacherhomeworkService.updateHomework(req.params.id as string, req.body);
            res.status(200).json({ success: true, data: updatedHomework });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // DELETE /api/homework/:id
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const result = await teacherhomeworkService.deleteHomework(req.params.id as string);
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getHomeworkbyIdsControllers(req: Request, res: Response): Promise<void> {
        try {
            const homework = await teacherhomeworkService.getHomeworkbyIdsServices(req.params.id as string);
            res.status(200).json({ success: true, data: homework });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
}

export const homeworkController = new HomeworkController();