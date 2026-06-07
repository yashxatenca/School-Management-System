import { Request, Response } from "express";
import { AttendanceService } from "./attendance.service";

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor() {
    this.attendanceService = new AttendanceService();
  }

  // GET /api/v1/student/attendance/:date
  getSingleDate = async (req: Request, res: Response): Promise<void> => {
    try {
      const studentId = req.user?.id; // Apne auth middleware ke hisaab se adjust karein
      const { date } = req.params;

      if (!studentId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const data = await this.attendanceService.getSingleDayAttendance(
        studentId,
        date as string,
      );

      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Server Error" });
    }
  };

  // GET /api/v1/student/attendance?startDate=...&endDate=...
  getRangeDate = async (req: Request, res: Response): Promise<void> => {
    try {
      const studentId = req.user?.id; // Apne auth middleware ke hisaab se adjust karein
      const { startDate, endDate } = req.query;

      if (!studentId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (!startDate || !endDate) {
        res
          .status(400)
          .json({ message: "Start date and end date are required" });
        return;
      }

      const data = await this.attendanceService.getRangeAttendance(
        studentId,
        startDate as string,
        endDate as string,
      );

      res.status(200).json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Server Error" });
    }
  };
}
