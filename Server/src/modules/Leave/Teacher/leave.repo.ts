import { LeaveModel } from "./leave.model";
import { ILeave } from "./leave.interface";
import { LeaveModel as StudentLeaveModel } from "../Student/leave.model";
import TeacherAuthModel from "../../auth/Teacher/models/teacher.auth.model";
import { ApiError } from "../../../core/errors/ApiErrors";
export class LeaveRepository {
  // 1. Create a new leave request
  async createLeave(leaveData: Partial<ILeave>) {
    const user = await TeacherAuthModel.findOne({
      _id: leaveData.teacherId,
    });
    if (!user) throw new ApiError(401, "Unauthorized");
    leaveData.principalId = user ? (user.principalId as string) : "";
    return await LeaveModel.create(leaveData);
  }
  async findLeaveById(leaveId: string) {
    return await LeaveModel.findById(leaveId);
  }

  // Delete the leave
  async deleteLeave(leaveId: string) {
    return await LeaveModel.findByIdAndDelete(leaveId);
  }

  // (Already exists from before) Fetch leaves for a specific teacher
  async findLeavesByTeacher(teacherId: string) {
    return await LeaveModel.find({ teacherId }).sort({ createdAt: -1 });
  }

  async findPendingLeaveByTeacherId(teacherId: string) {
    return await StudentLeaveModel.find({
      teacherId,
      status: "Pending",
    }).populate("studentId", "name email studentId");
  }
  async ApproveLeaveID(leaveId: string, status: string) {
    return await StudentLeaveModel.findByIdAndUpdate(
      leaveId,
      {
        $set: {
          status: status,
        },
      },

      { new: true, runValidators: true },
    );
  }
}
