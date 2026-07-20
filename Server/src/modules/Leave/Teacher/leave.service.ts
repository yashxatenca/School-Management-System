import { ApiError } from "../../../core/errors/ApiErrors";
import { ILeave } from "./leave.interface";
import { LeaveRepository } from "./leave.repo";

export class LeaveService {
  private leaveRepo = new LeaveRepository();

  async applyForLeave(data: Partial<ILeave>) {
    const { startDate, endDate, teacherId, leaveType, reason } = data;
    if (new Date(startDate) > new Date(endDate)) {
      throw new Error("End date cannot be before start date");
    }

    const payload = {
      teacherId,
      startDate,
      endDate,
      leaveType,
      reason,
      status: "Pending",
    };

    return await this.leaveRepo.createLeave(payload);
  }

  async getTeacherLeaves(teacherId: string) {
    return await this.leaveRepo.findLeavesByTeacher(teacherId);
  }

  async deleteLeaveRequest(leaveId: string, teacherId: string) {
    const leave = await this.leaveRepo.findLeaveById(leaveId);

    if (!leave) throw new Error("Leave request not found");
    if (leave.teacherId.toString() !== teacherId.toString())
      throw new Error("Unauthorized");
    if (leave.status !== "Pending")
      throw new Error("Only pending leaves can be deleted");

    return await this.leaveRepo.deleteLeave(leaveId);
  }

  async GetPendingByTeacherID(teacherId: string) {
    if (!teacherId) throw new ApiError(400, "All field Required");
    return await this.leaveRepo.findPendingLeaveByTeacherId(teacherId);
  }
  async ApproveLeaveByLeaveID(leaveId: string, status: string) {
    if (!leaveId || !status) throw new ApiError(400, "All field Required");
    return await this.leaveRepo.ApproveLeaveID(leaveId, status);
  }
}
