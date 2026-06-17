import { Router } from "express";
import { SubmissionController } from "./student.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
router.use(GlobalAuthMiddleware(["student"]));
// Naya Assignment Submit karne ke liye
router.post(
  "/homework-submit",

  SubmissionController.submitAssignment,
);

// Pehle Submit kiye hue ko Edit karne ke liye (PUT request)
router.put(
  "/homework-edit/:homeworkId",

  SubmissionController.editAssignment,
);

export default router;
