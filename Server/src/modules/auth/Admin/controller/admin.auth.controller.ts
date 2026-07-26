import { Request, Response } from "express";
import { AdminAuthService } from "../service/admin.auth.service";

export class AdminAuthController {
  static async createAndLoginUser(req: Request, res: Response) {
   
    const { token } = req.body;

    const result = await AdminAuthService.createAndLoginUser(token);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
    });
  }

  static async GetUser(req: Request, res: Response) {


    const user = await AdminAuthService.GetUser(req.user?.id as string);

    return res.status(200).json({
      success: true,
      user,
    });
  }

  static async LogoutUser(req: Request, res: Response) {
    await AdminAuthService.LogoutUser(req.user?.id as string);

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }
}
