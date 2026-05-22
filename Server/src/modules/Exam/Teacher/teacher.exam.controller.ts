import { NextFunction, Request, Response } from "express";
import { TeacherMarkService } from "./teacher.exam.service";
import { triggerAsyncId } from "node:async_hooks";
import { ApiError } from "../../../core/errors/ApiErrors";

export class TeacherMarkController {
  static async readmarks(req: Request, res: Response, next: NextFunction) {
    try {
      const role = req.user?.role;
      if (!role) throw new ApiError(409, "Invalid User");
      const result = await TeacherMarkService.readmarks(role);
      return res.json({
        message: "Marks Found",
        success: true,
        result,
      });
    } catch (err) {
      next(err);
    }
  }
}
