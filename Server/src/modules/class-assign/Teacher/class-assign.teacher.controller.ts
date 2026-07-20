import { Request, Response, NextFunction } from "express";
import { ClassAssignTeacherService } from "./class-assign.teacher.service";

export class ClassAssignTeacherController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ClassAssignTeacherService.createAssignment(
        req.body,
        req.user?.principalId as string,
      );
      res.status(201).json({
        success: true,
        message: "Assignment created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async read(req: Request, res: Response, next: NextFunction) {
    try {
      // Passing req.query allows you to filter (e.g., ?classId=123)
      const result = await ClassAssignTeacherService.getAllAssignments(
        req.query,
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ClassAssignTeacherService.updateAssignment(
        id as string,
        req.body,
      );
      res.status(200).json({
        success: true,
        message: "Assignment updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await ClassAssignTeacherService.deleteAssignment(
        id as string,
      );
      res.status(200).json({
        success: true,
        message: "Assignment deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
