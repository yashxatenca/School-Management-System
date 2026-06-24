import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { AdminClassService } from "./class.admin.service"; // Adjust path if necessary

export class AdminClassController {
  static async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const authid = req.user?.id;
      const newClass = await AdminClassService.createClass(payload, authid);

      res.status(201).json({
        success: true,
        message: "Class created successfully",
        data: newClass,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getClassById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const classId = new Types.ObjectId(id);
      const classData = await AdminClassService.findClassById(classId);

      if (!classData) {
        return res
          .status(404)
          .json({ success: false, message: "Class not found" });
      }

      res.status(200).json({
        success: true,
        data: classData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateClass(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const classId = new Types.ObjectId(id);
      const payload = req.body;

      const updatedClass = await AdminClassService.updateClass(
        classId,
        payload,
      );

      if (!updatedClass) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Class not found or update failed",
          });
      }

      res.status(200).json({
        success: true,
        message: "Class updated successfully",
        data: updatedClass,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteClass(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const classId = new Types.ObjectId(id);
      const deletedClass = await AdminClassService.deleteClass(classId);

      res.status(200).json({
        success: true,
        message: "Class deleted successfully",
        data: deletedClass,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const classes = await AdminClassService.getAllClasses(
        req.user?.id as string,
      );

      res.status(200).json({
        success: true,
        data: classes,
      });
    } catch (error) {
      next(error);
    }
  }
}
