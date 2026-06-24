import { ApiError } from "../../../core/errors/ApiErrors";
import { AdminDashboardRepo } from "./admin.dashboard.repo";

export class AdminDashboardService {
  static async getDashboard(principalId: string) {
    if (!principalId) throw new ApiError(400, "Details Required");
    const dashboard = await AdminDashboardRepo.getDashboard(principalId);
    if (dashboard === null || dashboard === undefined) {
      throw new ApiError(404, "Unable to fetch teacher count");
    }
    return dashboard;
  }
}
