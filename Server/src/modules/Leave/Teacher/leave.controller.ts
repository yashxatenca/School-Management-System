import { Request, Response } from "express";
import { LeaveService } from "./leave.service";
import { ApiError } from "../../../core/errors/ApiErrors";

export class LeaveController {
  private leaveService = new LeaveService();

  // 1. Apply Leave
  applyLeave = async (req: Request, res: Response) => {
    try {
      const teacherId = req.user?.id; // Auth middleware से आ रहा है
      const { startDate, endDate, leaveType, reason } = req.body;

      const newLeave = await this.leaveService.applyForLeave({
        teacherId,
        startDate,
        endDate,
        leaveType,
        reason,
      });

      return res.status(201).json({ success: true, data: newLeave });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };

  // 2. Get My Leaves
  getMyLeaves = async (req: Request, res: Response) => {
    try {
      const teacherId = req.user?.id;
      const leaves = await this.leaveService.getTeacherLeaves(
        teacherId as string,
      );
      return res.status(200).json({ success: true, data: leaves });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // 3. Delete Leave
  deleteLeave = async (req: Request, res: Response) => {
    try {
      const leaveId = req.params.id;
      const teacherId = req.user?.id;

      await this.leaveService.deleteLeaveRequest(
        leaveId as string,
        teacherId as string,
      );
      return res
        .status(200)
        .json({ success: true, message: "Leave deleted successfully" });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };

  pendingLeaveByteacherId = async (req: Request, res: Response) => {
    try {
      const teacherId = req.user?.id;
      if (!teacherId) throw new ApiError(401, "unauthorized");
      const leave = await this.leaveService.GetPendingByTeacherID(
        teacherId as string,
      );
      return res
        .status(200)
        .json({ success: true, message: "Leave Fetched successfully", leave });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };
  statusApproval = async (req: Request, res: Response) => {
    try {
      const { leaveId, status } = req.body;
      if (!leaveId || !status) throw new ApiError(400, "All field Required");
      const leave = await this.leaveService.ApproveLeaveByLeaveID(
        leaveId as string,
        status as string,
      );
      return res
        .status(200)
        .json({ success: true, message: "Leave Updated successfully" });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  };
}
