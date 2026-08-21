import express from "express";
import { SubjectController } from "./subject.admin.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = express.Router();

router.post(
  "/",
  GlobalAuthMiddleware(["admin"]),
  SubjectController.createSubject,
);
router.get(
  "/:id",
  GlobalAuthMiddleware(["admin"]),
  SubjectController.findSubjectById,
);
router.patch(
  "/:id",
  GlobalAuthMiddleware(["admin"]),
  SubjectController.updateSubject,
);
router.delete(
  "/:id",
  GlobalAuthMiddleware(["admin"]),
  SubjectController.deleteSubject,
);
router.get(
  "/",
  GlobalAuthMiddleware(["admin"]),
  SubjectController.getAllSubjects,
);

export default router;
