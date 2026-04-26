import type { Request, Response, NextFunction } from "express";
import { AdminAuthService } from "../service/admin.auth.service";
import { ApiError } from "../../../../core/errors/ApiErrors";

export class AdminController {

  static async adminlogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const googletoken = req.body.token;

      if (!googletoken) {
        throw new ApiError(400, "Google token is required");
      }

      const { user, token } =
        await AdminAuthService.createAndLoginUser(googletoken);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        user,
      });

    } catch (error) {
      next(error); // Global error handler handle karega
    }
  }

  static async AdminUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }

      const { id } = req.user as { id: string };

      if (!id) {
        throw new ApiError(401, "User ID not found in token");
      }

      const user = await AdminAuthService.GetUser(id);

      res.status(200).json({
        success: true,
        message: "User found",
        user,
      });

    } catch (error) {
      next(error);
    }
  }

  static async LogoutUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized");
      }

      const { id } = req.user as { id: string };

      if (!id) {
        throw new ApiError(401, "User ID not found in token");
      }

      const isuservalid = await AdminAuthService.LogoutUser(id);

      if (!isuservalid) {
        return res.status(400).json({
          success: false,
          message: "Unable to Logout",
        });
      }

      res.clearCookie("token");

      res.status(200).json({
        message: "Logout successful",
        success: true,
      });

    } catch (error) {
      next(error);
    }
  }
}