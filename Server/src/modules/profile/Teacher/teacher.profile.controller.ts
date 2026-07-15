import { Request, Response } from "express";
import service from "./teacher.profile.service";

class TeacherProfileController {
  async create(req: Request, res: Response) {
    try {
      const result = await service.createProfile(
        req.user?.id as string,
        req.body,
      );

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const result = await service.getProfile(req.user?.id!);

      // Pehli baar me result 'null' aayega, par status 200 hi rahega
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const result = await service.updateProfile(req.user?.id!, req.body);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new TeacherProfileController();
