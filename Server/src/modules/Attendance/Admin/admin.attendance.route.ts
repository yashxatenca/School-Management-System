import { Router } from "express";
import { AdminAttendanceController } from "./admin.attendance.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
const controller = new AdminAttendanceController();

router.use(GlobalAuthMiddleware(["teacher"]));

router.get("/student/:studentId", controller.getByStudent);
router.get("/class/:classId", controller.getByClass);
router.get("/class/:classId/cards", controller.getCards);

export default router;
