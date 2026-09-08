import { Request, Response } from "express";
import { homeworkService } from "./admin.homework.service";

export class HomeworkController {

  async create(req: Request, res: Response): Promise<void> {
    try {
     
      const assignedById = req.user?.id;
      const data = { ...req.body, assignedById };

      const newHomework = await homeworkService.createHomework(
        data,
        req.user?.role as string,
      );
      res.status(201).json({ success: true, data: newHomework });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const homework = await homeworkService.fetchHomeworkById(req.params.id as string);
      res.status(200).json({ success: true, data: homework });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  // PUT /api/homework/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const updatedHomework = await homeworkService.updateHomework(
        req.params.id as string,
        req.body,
      );
      res.status(200).json({ success: true, data: updatedHomework });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/homework/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await homeworkService.deleteHomework(
        req.params.id as string,
      );
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getHomeworkbyIdsControllers(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const homework = await homeworkService.getHomeworkbyIdsServices(
        req.params.id as string,
      );
      res.status(200).json({ success: true, data: homework });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

export const homeworkController = new HomeworkController();
