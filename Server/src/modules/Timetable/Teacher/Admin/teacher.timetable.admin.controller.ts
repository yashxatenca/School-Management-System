import { Request, Response, NextFunction } from "express";
import { TeacherTimetableService } from "./teacher.timetable.admin.service";

export class StudentTimetableController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      data.principalId = req.user?.id;
      const timetable = await TeacherTimetableService.create(data);
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
      const timetable = await TeacherTimetableService.getById(id as string);
      res.status(200).json({
        success: true,
        data: timetable,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getByTeacherId(req: Request, res: Response, next: NextFunction) {
    try {
      const { teacherId } = req.params;
      const timetables = await TeacherTimetableService.getByClassId(
        teacherId as string,
      );
      res.status(200).json({
        success: true,
        data: timetables,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await TeacherTimetableService.delete(id as string);
      res.status(200).json({
        success: true,
        message: "Timetable deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
