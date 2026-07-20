import { Router } from "express";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";
import { StudentNoticeController } from "./notice.student.controller";
const router = Router();
const noticeController = new StudentNoticeController();
router.use(GlobalAuthMiddleware(["student"]));
router.get("/class/:classId", noticeController.getNotices);
export default router;
