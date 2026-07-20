import { Router } from "express";
import { LeaveController } from "./leave.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
const leaveController = new LeaveController();

// Route for Student
router.post(
  "/apply",
  GlobalAuthMiddleware(["student"]),
  leaveController.applyLeave,
);
router.get(
  "/get-leave",
  GlobalAuthMiddleware(["student"]),
  leaveController.getMyLeaves,
);
router.delete(
  "/:id",
  GlobalAuthMiddleware(["student"]),
  leaveController.deleteLeave,
);

export default router;
