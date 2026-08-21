import { Request, Response } from "express";
import { AdminAttendanceService } from "./admin.attendance.service";

export class AdminAttendanceController {
  private service: AdminAttendanceService;

  constructor() {
    this.service = new AdminAttendanceService();
  }

  getByStudent = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params;
      const { date } = req.query;
      console.log(req.params, req.query);

      const data = await this.service.getAttendanceByStudent(
        studentId as string,
        date as string,
      );
      res.status(200).json({ success: true, count: data.length, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getByClass = async (req: Request, res: Response) => {
    try {
      const { classId } = req.params;
      const { date } = req.query;
      if (!date)
        return res
          .status(400)
          .json({ success: false, error: "Date is required" });

      const data = await this.service.getAttendanceByClass(
        classId as string,
        date as string,
      );
      res.status(200).json({ success: true, count: data.length, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  getCards = async (req: Request, res: Response) => {
    try {
      const { classId } = req.params;
      const year =
        parseInt(req.query.year as string) || new Date().getFullYear();
      const month =
        parseInt(req.query.month as string) || new Date().getMonth() + 1;

      const cards = await this.service.getDateCards(
        classId as string,
        year,
        month,
      );

      res.status(200).json({ success: true, year, month, cards });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
