import { Router } from "express";
import { processStudentChat } from "./chatcontroller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
router.use(GlobalAuthMiddleware(["student"]));
router.post("/chat", processStudentChat);

export default router;
