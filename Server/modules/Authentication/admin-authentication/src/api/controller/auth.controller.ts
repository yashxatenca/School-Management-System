import type { Request, Response } from "express";
import { AdminAuthService } from "../services/admin.auth.service";
import { ApiError } from "../../core/errors/ApiErrors";
export class AdminController{
    static async adminlogin(req:Request,res:Response):Promise<void>{
        const googletoken  = req.body.token;
        const { user, token } = await AdminAuthService.createAndLoginUser(googletoken);
         res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    user,
  });
    }

  static async AdminUser(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id } = req.user as { id: string };

  if (!id) {
    throw new ApiError(401, 'User ID not found in token');
  }

  const user = await AdminAuthService.GetUser(id);

  res.status(200).json({
    success: true,
    message: 'User found',
    user,
  });
}

  static async LogoutUser(req:Request, res:Response ){

  const { id } = req.user as { id: string };

  if (!id) {
    throw new ApiError(401, 'User ID not found in token');
  }
  const isuservalid = await AdminAuthService.LogoutUser(id);
  if(!isuservalid){
    return res.status(400).json({
      success:false,
      message:"Unable to Logout"
    })
  }
  return res.clearCookie("token").status(200).json({
    message:"Logout successfull",
    success:true
  })
  }


}