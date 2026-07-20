import { Request, Response } from "express";
import { StudentNoticeService } from "./notice.student.service";

export class StudentNoticeController {
  private noticeService: StudentNoticeService;

  constructor() {
    this.noticeService = new StudentNoticeService();
  }

  getNotices = async (req: Request, res: Response) => {
    try {
      const { classId } = req.params;

      if (!classId) {
        return res
          .status(400)
          .json({ success: false, message: "classId is required" });
      }

      const notices = await this.noticeService.fetchNotices(classId as string);
      res.status(200).json({ success: true, data: notices });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
}
