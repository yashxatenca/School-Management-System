import { Request, Response } from "express";
import { TeacherAttendanceService } from "./teacher.attendance.service";

export class TeacherAttendanceController {
  private service: TeacherAttendanceService;

  constructor() {
    this.service = new TeacherAttendanceService();
  }

  markOrUpdate = async (req: Request, res: Response) => {
    try {
      const teacherId = req.user?.id || "";
      if (!teacherId)
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized teacher" });

      const result = await this.service.markOrUpdateAttendance(
        req.body,
        teacherId,
      );
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ success: false, error: error.message });
    }
  };

  getByClassAndDate = async (req: Request, res: Response) => {
    try {
      const { classId } = req.params;
      const { date } = req.query;
      if (!date)
        return res
          .status(400)
          .json({ success: false, error: "Date is required" });

      const data = await this.service.getClassAttendanceByDate(
        classId as string,
        date as string,
      );
      res.status(200).json({ success: true, count: data.length, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  deleteRecord = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.service.deleteAttendance(id as string);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
