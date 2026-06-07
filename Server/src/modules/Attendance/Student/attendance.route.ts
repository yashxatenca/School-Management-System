import { Router } from "express";
import { AttendanceController } from "./attendance.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";
// import { protectStudent } from "../middlewares/auth.middleware"; // Example auth middleware

export class AttendanceRoutes {
  public router: Router;
  private attendanceController: AttendanceController;

  constructor() {
    this.router = Router();
    this.attendanceController = new AttendanceController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(GlobalAuthMiddleware(["student"]));
    // Auth middleware zaroor lagayein taaki req.user set ho sake
    // this.router.use(protectStudent);

    // Range endpoint (e.g., /api/v1/student/attendance?startDate=...&endDate=...)
    this.router.get("/", this.attendanceController.getRangeDate);

    // Single Date endpoint (e.g., /api/v1/student/attendance/2026-06-04)
    this.router.get("/:date", this.attendanceController.getSingleDate);
  }
}

export default new AttendanceRoutes().router;
