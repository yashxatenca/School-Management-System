import { Router } from "express";
import { ClassAssignTeacherController } from "./class-assign.teacher.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
router.use(GlobalAuthMiddleware(["teacher"]));

router.post("/assign", ClassAssignTeacherController.create);
router.get("/assign", ClassAssignTeacherController.read);
router.put("/assign/:id", ClassAssignTeacherController.update);
router.delete("/assign/:id", ClassAssignTeacherController.delete);

export default router;
