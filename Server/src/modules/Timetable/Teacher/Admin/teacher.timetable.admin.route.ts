import { Router } from "express";
import { StudentTimetableController } from "./teacher.timetable.admin.controller";
import { GlobalAuthMiddleware } from "../../../../middleware/Gloabal.auth.middleware";
const router = Router();
router.use(GlobalAuthMiddleware(["admin"]));
router.post("/", StudentTimetableController.create);

router.get("/teacher/:teacherId", StudentTimetableController.getByTeacherId);

router.get("/:id", StudentTimetableController.getById);
router.patch("/:id", StudentTimetableController.update);
router.delete("/:id", StudentTimetableController.delete);
export default router;
