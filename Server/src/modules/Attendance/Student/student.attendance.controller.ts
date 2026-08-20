import { Request, Response } from "express";
import { StudentAttendanceService } from "./student.attendance.service";

export class StudentAttendanceController {
  private service: StudentAttendanceService;

  constructor() {
    this.service = new StudentAttendanceService();
  }

  getMyAttendance = async (req: Request, res: Response) => {
    try {
      // Force studentId to be the logged-in user's ID
      const studentId = req.user?.id;
      if (!studentId)
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized student" });

      const { date } = req.query;

      const data = await this.service.getMyLogs(studentId, date as string);

      res.status(200).json({ success: true, count: data.length, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
