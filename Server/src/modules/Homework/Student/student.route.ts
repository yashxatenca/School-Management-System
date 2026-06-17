import { Router } from "express";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";
import { StudentHomeworkController } from "./student.controller";
const router = Router();

router.get(
  "/:classId",
  GlobalAuthMiddleware(["student"]),
  StudentHomeworkController.fetchassignment,
);

export default router;
