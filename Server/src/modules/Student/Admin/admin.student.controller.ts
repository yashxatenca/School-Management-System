import { Request, Response } from "express";
import { AdminStudentService } from "./admin.student.service";

export class AdminStudentController {
  static async createstudentcontroller(req: Request, res: Response) {
    try {
      const data = req.body;
      data.principalId = req.user?.id;
      const user = await AdminStudentService.createstudentservice(data);
      if (user) {
        return res.status(200).json({
          message: "created successfull",
          success: true,
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
  static async getStudentByStudentIdController(req: Request, res: Response) {
    try {
      const id = req.params.studentId as string;
      const user = await AdminStudentService.getStudentByStudentIdService(id);
      if (user) {
        return res.status(200).json({
          message: "found successfull",
          success: true,
          data: user,
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
  static async getStudentByClassIdController(req: Request, res: Response) {
    try {
      const id = req.params.classId as string;
      const user = await AdminStudentService.getStudentByClassIdService(id);
      if (user) {
        return res.status(200).json({
          message: "found successfull",
          success: true,
          data: user,
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
  static async deleteStudentController(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user = await AdminStudentService.deleteStudentService(id);
      if (user) {
        return res.status(200).json({
          message: "deleted successfull",
          success: true,
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
  static async updateStudentByStudentIdController(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const data = req.body;
      const user = await AdminStudentService.updateStudentByStudentIdService(
        id,
        data,
      );
      if (user) {
        return res.status(200).json({
          message: "updated successfull",
          success: true,
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}
