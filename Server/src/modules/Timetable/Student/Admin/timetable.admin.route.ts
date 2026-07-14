import { Router } from "express";
import { StudentTimetableController } from "./timetable.admin.controller";
import { GlobalAuthMiddleware } from "../../../../middleware/Gloabal.auth.middleware";
// Optional: Import your auth/admin middleware here
// import { isAuthenticated, authorizeRoles } from "../../../../middlewares/auth.middleware";

const router = Router();
router.use(GlobalAuthMiddleware(["admin"]));
router.post("/", StudentTimetableController.create);

router.get("/class/:classId", StudentTimetableController.getByClassId);

router.get("/:id", StudentTimetableController.getById);
router.patch("/:id", StudentTimetableController.update);
router.delete("/:id", StudentTimetableController.delete);
export default router;
