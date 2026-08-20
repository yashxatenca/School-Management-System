import { Router } from "express";
import { TeacherAttendanceController } from "./teacher.attendance.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
const controller = new TeacherAttendanceController();

router.use(GlobalAuthMiddleware(["teacher"]));

router.post("/mark", controller.markOrUpdate);
router.get("/class/:classId", controller.getByClassAndDate);
router.delete("/:id", controller.deleteRecord);

export default router;
