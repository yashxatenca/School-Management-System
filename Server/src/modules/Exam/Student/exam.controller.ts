import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../core/errors/ApiErrors";
import { ExamStudentService } from "./exam.service";

export class ExamStudentController {
  static async GetExam(req: Request, res: Response, next: NextFunction) {
    try {
      const exam = await ExamStudentService.GetExam();
      if (!exam) {
        throw new ApiError(400, "no data found");
      }
      res.status(200).json({
        success: true,
        message: "exam fetched",
        exam: exam,
      });
    } catch (err) {
      next(err);
    }
  }
}
