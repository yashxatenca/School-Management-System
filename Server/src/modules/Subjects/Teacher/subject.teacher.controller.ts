import { Request, Response } from "express";
import { TeacherSubjectService } from "./subject.teacher.service";

export class TeacherSubjectController {
  static async getAllSubject(req: Request, res: Response) {
    try {
      
      const id = req.user?.principalId ?? "";

      const result = await TeacherSubjectService.getAllSubject(id);
      res.status(200).json({ result, success: true, message: "Subject Find" });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
