import { Request, Response } from "express";
import { MarksService } from "./teacher.marks.service";

export class MarksController {
  static async createMark(req: Request, res: Response): Promise<void> {
    try {
      const mark = await MarksService.createMark(req.body);
      res.status(201).json({ success: true, data: mark });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getMarkById(req: Request, res: Response): Promise<void> {
    try {
      const mark = await MarksService.getMarkById(req.params.id);
      res.status(200).json({ success: true, data: mark });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async getMarks(req: Request, res: Response): Promise<void> {
    try {
      // Extract filters from query params
      const { examId, classId, studentId } = req.query;
      const marks = await MarksService.getMarks({
        examId: examId as string,
        classId: classId as string,
        studentId: studentId as string,
      });
      res.status(200).json({ success: true, data: marks });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateMark(req: Request, res: Response): Promise<void> {
    try {
      const updatedMark = await MarksService.updateMark(
        req.params.id,
        req.body,
      );
      res.status(200).json({ success: true, data: updatedMark });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteMark(req: Request, res: Response): Promise<void> {
    try {
      await MarksService.deleteMark(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "Mark record deleted successfully" });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}
