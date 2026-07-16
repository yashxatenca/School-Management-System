import { Router } from "express";
import { StudentTimetableController } from "./student.timetable.controller";
import { GlobalAuthMiddleware } from "../../../../middleware/Gloabal.auth.middleware";

const router = Router();
router.use(GlobalAuthMiddleware(["student"]));

router.get("/class/:classId", StudentTimetableController.getTimetable);

export default router;
