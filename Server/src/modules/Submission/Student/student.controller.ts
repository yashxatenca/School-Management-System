import { Request, Response, NextFunction } from "express";
import { SubmissionService } from "./student.service";
import { ApiError } from "../../../core/errors/ApiErrors";

export class SubmissionController {
  static async submitAssignment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { homeworkId, submissionLink, remark } = req.body;
      const studentId = req.user?.id;

      if (!studentId) throw new ApiError(401, "Unauthorized access");
      if (!homeworkId || !submissionLink) {
        throw new ApiError(400, "Homework ID and Submission Link are required");
      }

      const result = await SubmissionService.submitHomework(
        studentId,
        homeworkId,
        submissionLink,
        remark || "",
      );

      res.status(201).json({
        success: true,
        message: "Assignment submitted successfully!",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  // NAYA: Edit ke liye controller
  static async editAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { homeworkId } = req.params; // URL se homework ID lenge
      const { submissionLink, remark } = req.body;
      const studentId = (req as any).user?._id;

      if (!studentId) throw new ApiError(401, "Unauthorized access");
      if (!homeworkId || !submissionLink) {
        throw new ApiError(400, "Homework ID and Submission Link are required");
      }

      const result = await SubmissionService.editSubmission(
        studentId,
        homeworkId as string,
        submissionLink,
        remark || "",
      );

      res.status(200).json({
        success: true,
        message: "Assignment updated successfully!",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
