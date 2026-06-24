import { Router } from "express";
import { AdminDashboardController } from "./admin.dashboard.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";
const router = Router();

router.use(GlobalAuthMiddleware(["admin"]));
router.get("/getdashboard", AdminDashboardController.getTotalDashboard);

export default router;
