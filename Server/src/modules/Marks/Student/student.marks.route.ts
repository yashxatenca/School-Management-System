import { Router } from "express";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";
import { StudentMarksController } from "./student.marks.controller";
const router = Router();
router.use(GlobalAuthMiddleware(["student"]));
router.get("/:examId", StudentMarksController.GetStudentMarks);
export default router;
