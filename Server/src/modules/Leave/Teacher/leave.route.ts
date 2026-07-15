import { Router } from "express";
import { LeaveController } from "./leave.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
const leaveController = new LeaveController();

router.use(GlobalAuthMiddleware(["teacher"]));

// Teacher Routes
router.post("/apply", leaveController.applyLeave);
router.get("/get-leave", leaveController.getMyLeaves);
router.delete("/:id", leaveController.deleteLeave);

export default router;
