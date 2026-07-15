import { Router } from "express";
import { MarkController } from "./teacher.result.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
const markController = new MarkController();

router.use(GlobalAuthMiddleware(["teacher"]));
router.get("/:examId/:studentId", markController.getStudentResult);

export default router;
