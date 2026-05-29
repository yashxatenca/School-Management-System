import { Router } from "express";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";
import { TeacherNoticeController } from "./teacher.notice.controller";
const router = Router();
const noticeController = new TeacherNoticeController();
router.use(GlobalAuthMiddleware(["teacher"]));

router.post("/create", noticeController.createNotice);
router.get("/list", noticeController.getNotices);
router.delete("/delete/:id", noticeController.deleteNotice);
export default router;
