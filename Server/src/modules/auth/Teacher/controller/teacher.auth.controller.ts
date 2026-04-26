import { Request, Response } from "express";
import { TeacherService } from "../service/teacher.auth.service";

export class TeacherController {

  private service = new TeacherService();

  create = async (req: Request, res: Response) => {
    try {
      const teacher = await this.service.createTeacher({ ...req.body, principalId: req.user?.id });
      res.status(201).json({ success: true, data: teacher });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const teachers = await this.service.getAllTeachers(req.user?.id);
      res.status(200).json({ success: true, teachers });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const teacher = await this.service.getTeacherById(req.params.id);
      res.status(200).json({ success: true, data: teacher });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const teacher = await this.service.updateTeacher(
        req.params.id,
        req.body
      );
      res.status(200).json({ success: true, data: teacher });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.service.deleteTeacher(req.params.id as string);
      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  };

  profile = async (req: Request, res: Response) => {
    try {
      const teacher = await this.service.getProfilebyId(req.user?.id as string);

      res.status(200).json({ success: true, teacher: teacher });
    } catch (err: any) {

      res.status(404).json({ success: false, message: err.message });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { token, teacher } = await this.service.login(email, password);

      res.status(200).cookie("token", token).json({
        success: true,
        teacher
      });

    } catch (err: any) {
      res.status(401).json({ success: false, message: err.message });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {

      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully"
      });

    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Logout failed"
      });
    }
  };
}