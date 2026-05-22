import { Router } from "express";
import { TeacherMarkController } from "./teacher.exam.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";
const router = Router();

router.use(GlobalAuthMiddleware(["teacher"]));
router.get("/", TeacherMarkController.readmarks);
export default router;
