import { Router } from "express";

import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";
import { processAdminChat } from "./chatcontroller";

const router = Router();
router.use(GlobalAuthMiddleware(["admin"]));
router.post("/chat", processAdminChat);

export default router;
