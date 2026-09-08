import { Request, Response } from "express";
import { TeacherTimetableService } from "./teacher.timetable.service";
import { classSubjectAssignSchema } from "../../../class-assign/class-subject-assign.model";

export class TeacherTimetableController {
  static async getTimetable(req: Request, res: Response) {
    try {
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Teacher information not found.",
        });
      }

      
      const timetables = await TeacherTimetableService.getTimetable(teacherId);

      return res.status(200).json({
        success: true,
        data: timetables,
        message: "Timetable fetched successfully",
      });
    } catch (error: any) {
      console.error("Error in getTimetable controller:", error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Internal server error occurred while fetching timetable.",
      });
    }
  }

  static async getClassTimetable(req: Request, res: Response) {
    try {
      const { classId } = req.params;

      if (!classId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Class information not found.",
        });
      }

    
      const timetables = await TeacherTimetableService.getClassTimetable(
        classId as string,
      );

  
      return res.status(200).json({
        success: true,
        data: timetables,
        message: "Timetable fetched successfully",
      });
    } catch (error: any) {
      console.error("Error in getTimetable controller:", error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Internal server error occurred while fetching timetable.",
      });
    }
  }
}
