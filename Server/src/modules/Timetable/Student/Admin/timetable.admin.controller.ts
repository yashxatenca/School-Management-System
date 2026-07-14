import { Request, Response, NextFunction } from "express";
import { StudentTimetableService } from "./timetable.admin.service";

export class StudentTimetableController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      data.principalId = req.user?.id;
      const timetable = await StudentTimetableService.create(data);
      res.status(201).json({
        success: true,
        message: "Timetable created successfully",
        data: timetable,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const timetable = await StudentTimetableService.getById(id);
      res.status(200).json({
        success: true,
        data: timetable,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByClassId(req: Request, res: Response, next: NextFunction) {
    try {
      const { classId } = req.params;
      const timetables = await StudentTimetableService.getByClassId(
        classId as string,
      );
      res.status(200).json({
        success: true,
        data: timetables,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
    
      const { id } = req.params;
      const data = req.body;
      const updatedTimetable = await StudentTimetableService.update(id, data);
      res.status(200).json({
        success: true,
        message: "Timetable updated successfully",
        data: updatedTimetable,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await StudentTimetableService.delete(id as string);
      res.status(200).json({
        success: true,
        message: "Timetable deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
