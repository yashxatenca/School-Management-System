import { LeaveModel as TeacherLeaveModel } from "../Teacher/leave.model";

export class AdminLeaveRepo {
  static async findPendingLeaveByPrincipalId(principalId: string) {
    return await TeacherLeaveModel.find({
      principalId,
      status: "Pending",
    });
  }

  static async ApprovalByLeaveId(leaveId: string, status: string) {
    return await TeacherLeaveModel.findByIdAndUpdate(
      leaveId,
      {
        $set: {
          status: status,
        },
      },

      {
        new: true,
        runValidators: true,
      },
    );
  }
}
