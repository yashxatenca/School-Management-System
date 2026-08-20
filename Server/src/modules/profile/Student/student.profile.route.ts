import { Router } from "express";
import profileController from "./student.profile.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
router.use(GlobalAuthMiddleware(["student", "admin", "teacher"]));
// GET /api/student-profile/:student_id
router.get("/:student_id", profileController.getProfile);

router.put("/:student_id", profileController.updateProfile);

export default router;
