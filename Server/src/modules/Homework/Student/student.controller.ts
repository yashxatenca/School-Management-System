import { Request, Response, NextFunction } from "express";
import { StudentHomeworkService } from "./student.service";
import { ApiError } from "../../../core/errors/ApiErrors";

export class StudentHomeworkController {
  static async fetchassignment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { classId } = req.params;
      if (!classId) throw new ApiError(400, "All field Required");
      const assignment = await StudentHomeworkService.fetchassignment(
        classId as string,
      );

      res.status(200).json({
        message: "Assignment Fetch Successfull",
        success: true,
        result: assignment,
      });
    } catch (err) {
      next(err);
    }
  }
}
