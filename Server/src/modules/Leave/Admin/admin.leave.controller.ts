import { Request, Response } from "express";
import { AdminLeaveService } from "./admin.leave.service";
import { ApiError } from "../../../core/errors/ApiErrors";

export class AdminLeaveController {
  static async ApprovedLeave(req: Request, res: Response) {
    try {
      const { leaveId, status } = req.body;
      if (!leaveId || !status) throw new ApiError(400, "all field required");
      const leave = await AdminLeaveService.ApprovalByLeaveId(
        leaveId as string,
        status as string,
      );
      return res
        .status(200)
        .json({ success: true, message: "Leave deleted successfully" });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  static async findPendingLeave(req: Request, res: Response) {
    try {
      const id = req.user?.id;

      if (!id) throw new ApiError(401, "Unauthorized");
      const leave = await AdminLeaveService.findPendingByPrincipalId(
        id as string,
      );

      return res
        .status(200)
        .json({ success: true, message: "Leave deleted successfully", leave });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}
