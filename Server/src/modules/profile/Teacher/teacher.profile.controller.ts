import { Request, response, Response } from "express";
import service from "./teacher.profile.service";
import { ApiError } from "../../../core/errors/ApiErrors";

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
  async getStudentProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) throw new ApiError(400, "all field Required");
      const profile = await service.getStudentProfile(id as string);
      if (!profile) {
        res.status(404).json({
          message: "not found",
          success: false,
          profile: [],
        });
      }

      res.status(200).json({
        message: "Profile found",
        success: true,
        profile: profile,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
}

export default new TeacherProfileController();
