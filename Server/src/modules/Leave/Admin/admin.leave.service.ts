import { ApiError } from "../../../core/errors/ApiErrors";
import { AdminLeaveRepo } from "./admin.leave.repo";

export class AdminLeaveService {
  static async findPendingByPrincipalId(principalId: string) {
    if (!principalId) throw new ApiError(400, "All Field Required");
    const leave =
      await AdminLeaveRepo.findPendingLeaveByPrincipalId(principalId);

    if (!leave) return [];
    return leave;
  }

  static async ApprovalByLeaveId(leaveId: string, status: string) {
    if (!leaveId || !status) throw new ApiError(400, "all field required");
    const leave = await AdminLeaveRepo.ApprovalByLeaveId(leaveId, status);
    if (!leave) return [];
    return leave;
  }
}
