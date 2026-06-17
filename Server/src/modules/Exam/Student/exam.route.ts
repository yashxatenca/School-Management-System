import { Router } from "express";
import router from "../Admin/admin.exam.route";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";
import { ExamStudentController } from "./exam.controller";
const route = Router();
router.use(GlobalAuthMiddleware(["student"]));
route.get("/", ExamStudentController.GetExam);

export default route;
