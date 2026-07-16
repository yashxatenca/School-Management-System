import { Request, Response } from "express";
import { StudentTimetableService } from "./student.timetable.service";
import { ApiError } from "../../../../core/errors/ApiErrors";
export class StudentTimetableController {
  static async getTimetable(req: Request, res: Response) {
    try {
      const { classId } = req.params;
      if (!classId) throw new ApiError(402, "all field required");
      const timetable = await StudentTimetableService.getTimetable(
        classId as string,
      );
      if (!timetable) res.status(400).json({ message: "timetable not found" });
      res.json({
        message: "timetable found",
        success: true,
        timetable,
      });
    } catch (error) {
      res.status(500).json({
        message: "something went wrong",
      });
    }
  }
}
