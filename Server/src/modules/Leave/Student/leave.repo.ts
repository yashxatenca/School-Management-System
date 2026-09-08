import { LeaveModel } from "./leave.model";
import { ILeave } from "./leave.interface";

export class LeaveRepository {
  // 1. Create a new leave request
  async createLeave(leaveData: Partial<ILeave>) {
    return await LeaveModel.create(leaveData);
  }
  async findLeaveById(leaveId: string) {
    return await LeaveModel.findById(leaveId);
  }

  // Delete the leave
  async deleteLeave(leaveId: string) {
    return await LeaveModel.findByIdAndDelete(leaveId);
  }

  
  async findLeavesByStudentId(studentId: string) {
    return await LeaveModel.find({ studentId }).sort({ createdAt: -1 });
  }
  async findLeavesByStudentTeacherId(teacherId: string) {
    return await LeaveModel.find({ teacherId }).sort({ createdAt: -1 });
  }
}
