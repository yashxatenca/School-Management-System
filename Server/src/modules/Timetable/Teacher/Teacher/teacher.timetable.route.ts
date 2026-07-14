import { Router } from "express";
import { TeacherTimetableController } from "./teacher.timetable.controller"; // Adjust path if needed
import route from "../../../Exam/Student/exam.route";
import { GlobalAuthMiddleware } from "../../../../middleware/Gloabal.auth.middleware";

const router = Router();

router.use(GlobalAuthMiddleware(["teacher"]));
router.get(
  "/my-timetable",

  TeacherTimetableController.getTimetable,
);

router.get(
  "/class/:classId",
  TeacherTimetableController.getClassTimetable // Assuming you create this method later
);

export const TeacherTimetableRoutes = router;
