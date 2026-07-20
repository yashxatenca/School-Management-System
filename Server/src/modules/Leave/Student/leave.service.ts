import { ILeave } from "./leave.interface";
import { LeaveRepository } from "./leave.repo";

export class LeaveService {
  private leaveRepo = new LeaveRepository();

  async applyForLeave(data: Partial<ILeave>) {
    const { startDate, endDate, teacherId, studentId, leaveType, reason } =
      data;

    // Fix 1: Date undefined check
    if (!startDate || !endDate) {
      throw new Error("Start date and End date are required");
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new Error("End date cannot be before start date");
    }

    // Fix 2: Status type casting
    const payload = {
      studentId,
      teacherId,
      startDate,
      endDate,
      leaveType,
      reason,
      status: "Pending" as "Pending" | "Approved" | "Rejected",
    };

    return await this.leaveRepo.createLeave(payload);
  }

  async getStudentLeaves(studentId: string) {
    return await this.leaveRepo.findLeavesByStudentId(studentId);
  }

  async deleteLeaveRequest(leaveId: string, studentId: string) {
    const leave = await this.leaveRepo.findLeaveById(leaveId);

    if (!leave) throw new Error("Leave request not found");

    // Fix 3: Optional chaining/null check agar leave.studentId undefined ho sakta hai
    if (leave.studentId?.toString() !== studentId.toString())
      throw new Error("Unauthorized");

    if (leave.status !== "Pending")
      throw new Error("Only pending leaves can be deleted");

    return await this.leaveRepo.deleteLeave(leaveId);
  }
}
