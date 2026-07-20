import { Router } from "express";
import { LeaveController } from "./leave.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
const leaveController = new LeaveController();

// Teacher Routes
router.post(
  "/apply",
  GlobalAuthMiddleware(["teacher"]),
  leaveController.applyLeave,
);
router.get(
  "/get-leave",
  GlobalAuthMiddleware(["teacher"]),
  leaveController.getMyLeaves,
);
router.delete(
  "/:id",
  GlobalAuthMiddleware(["teacher"]),
  leaveController.deleteLeave,
);

// student route for approval
router.get(
  "/pending-leave",
  GlobalAuthMiddleware(["teacher"]),
  leaveController.pendingLeaveByteacherId,
);
router.put("/approval", GlobalAuthMiddleware(['teacher']), leaveController.statusApproval)

export default router;
