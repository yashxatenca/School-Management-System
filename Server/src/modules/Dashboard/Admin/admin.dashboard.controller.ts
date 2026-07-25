import { AdminDashboardService } from "./admin.dashboard.service";
import { Request, Response, NextFunction } from "express";

export class AdminDashboardController {
  static async getTotalDashboard(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.user?.id;
      
      const TotalDashboard = await AdminDashboardService.getDashboard(
        id as string,
      );
      if (!TotalDashboard) {
        res.json({
          message: "not found",
          success: false,
        });
      }
      res.status(200).json({
        success: true,
        message: "Total teachers fetched successfully",
        TotalDashboard,
      });
    } catch (error) {
      next(error);
    }
  }
}
