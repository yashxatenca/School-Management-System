import { Router } from "express";
import { AdminLeaveController } from "./admin.leave.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
router.use(GlobalAuthMiddleware(["admin"]));

// student route for approval
router.get("/pending-leave", AdminLeaveController.findPendingLeave);
router.put("/approval", AdminLeaveController.ApprovedLeave);

export default router;
