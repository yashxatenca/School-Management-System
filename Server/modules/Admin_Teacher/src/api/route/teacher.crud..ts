import express from "express";
import { AdminTeacherController } from "../controller/admin.teacher.controller";
import { catchAsync } from "../../core/errors/catchAsync";
import { authenticationmiddleware } from "../middlewares/authmid";

const router = express.Router();

/* =====================================================
   HEALTH CHECK
===================================================== */
router.get("/teacher", (_req, res) => {
  res.json({
    success: true,
    message: "Teacher API is working",
  });
});

/* =====================================================
   TEACHER ROUTES (PROTECTED)
===================================================== */

// CREATE teacher
router.post(
  "/",
  authenticationmiddleware,
  catchAsync(AdminTeacherController.Create)
);

// READ all teachers (by principal)
router.get(
  "/",
  authenticationmiddleware,
  catchAsync(AdminTeacherController.Read)
);

// READ teacher by staff_id
router.get(
  "/staff/:staff_id",
  authenticationmiddleware,
  catchAsync(AdminTeacherController.ReadByStaffId)
);

// UPDATE teacher by staff_id
router.put(
  "/staff/:staff_id",
  authenticationmiddleware,
  catchAsync(AdminTeacherController.Update)
);

// DELETE teacher by mongo _id
router.delete(
  "/:id",
  authenticationmiddleware,
  catchAsync(AdminTeacherController.Delete)
);

export default router;
