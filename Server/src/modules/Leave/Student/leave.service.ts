import { ILeave } from "./leave.interface";
import { LeaveRepository } from "./leave.repo";

export class LeaveService {
  private leaveRepo = new LeaveRepository();

  async applyForLeave(data: Partial<ILeave>) {
    const { startDate, endDate, teacherId, studentId, leaveType, reason } =
      data;

    if (new Date(startDate) > new Date(endDate)) {
      throw new Error("End date cannot be before start date");
    }

    const payload = {
      studentId,
      teacherId,
      startDate,
      endDate,
      leaveType,
      reason,
      status: "Pending",
    };

    return await this.leaveRepo.createLeave(payload);
  }

  async getStudentLeaves(studentId: string) {
    return await this.leaveRepo.findLeavesByStudentId(studentId);
  }

  async deleteLeaveRequest(leaveId: string, studentId: string) {
    const leave = await this.leaveRepo.findLeaveById(leaveId);

    if (!leave) throw new Error("Leave request not found");
    if (leave.studentId.toString() !== studentId.toString())
      throw new Error("Unauthorized");
    if (leave.status !== "Pending")
      throw new Error("Only pending leaves can be deleted");

    return await this.leaveRepo.deleteLeave(leaveId);
  }
}
