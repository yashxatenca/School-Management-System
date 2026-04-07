import { Router } from "express";
import { AdminStudentController } from "../controller/admin.student.controller";
import { GlobalAuthMiddleware } from "../../../../middleware/Gloabal.auth.middleware";

const router = Router();

router.get("/:studentId", GlobalAuthMiddleware(['admin']), AdminStudentController.GetByStudentId);

export default router;