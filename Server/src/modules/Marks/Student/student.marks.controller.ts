import { rmSync } from "node:fs";
import { ApiError } from "../../../core/errors/ApiErrors";
import { StudentMarksService } from "./student.marks.service";
import { NextFunction, Request, Response } from "express";
export class StudentMarksController {
  static async GetStudentMarks(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { examId } = req.params;
      if (!req.user?.id || !examId)
        throw new ApiError(400, "Required Credentails");
      const result = await StudentMarksService.GetMarksByStudentIdAndExamId(
        req.user?.id as string,
        examId as string,
      );
      if (!result) {
        res.status(402).json({
          message: "no data found",
          success: false,
        });
      }
      return res.status(200).json({
        result,
        message: "data found",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
