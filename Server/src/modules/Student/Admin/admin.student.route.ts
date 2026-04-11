import { Router } from "express";
import { AdminStudentController } from "./admin.student.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();

router.get("/:studentId", GlobalAuthMiddleware(['admin']), AdminStudentController.getStudentByStudentIdController);
router.post("/", GlobalAuthMiddleware(["admin"]), AdminStudentController.createstudentcontroller);
router.delete("/:id", GlobalAuthMiddleware(["admin"]), AdminStudentController.deleteStudentController);
router.get("/class/:classId", GlobalAuthMiddleware(['admin']), AdminStudentController.getStudentByClassIdController);
router.put("/:id", GlobalAuthMiddleware(["admin"]), AdminStudentController.updateStudentByStudentIdController);

export default router;