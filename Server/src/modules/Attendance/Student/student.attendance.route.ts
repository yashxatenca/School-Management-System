import { Router } from "express";
import { StudentAttendanceController } from "./student.attendance.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
const controller = new StudentAttendanceController();

router.use(GlobalAuthMiddleware(["student"]));

// Self-only view route
router.get("/my-attendance", controller.getMyAttendance);

export default router;
