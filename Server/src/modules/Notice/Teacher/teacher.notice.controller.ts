import { Request, Response } from "express";
import { TeacherNoticeService } from "./notice.teacher.service";

export class TeacherNoticeController {
  private noticeService: TeacherNoticeService;

  constructor() {
    this.noticeService = new TeacherNoticeService();
  }

  createNotice = async (req: Request, res: Response) => {
    try {
      const notice = await this.noticeService.createNewNotice(req.body);
      res.status(201).json({ success: true, data: notice });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getNotices = async (req: Request, res: Response) => {
    try {
      const { classId } = req.query;

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

  deleteNotice = async (req: Request, res: Response) => {
    try {
      await this.noticeService.removeNotice(req.params.id as string);
      res.status(200).json({ success: true, message: "Notice deleted" });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  };
}
