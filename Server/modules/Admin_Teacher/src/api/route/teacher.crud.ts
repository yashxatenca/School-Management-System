import express from "express";
import { AdminTeacherController } from "../controller/admin.teacher.controller";
import { catchAsync } from "../../core/errors/catchAsync";
import { adminmiddleware } from "../middlewares/admin.mid";

const router = express.Router();

/* =====================================================
   HEALTH CHECK
===================================================== */
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Teacher API is working",
  });
});

/* =====================================================
   TEACHER ROUTES (PROTECTED)
===================================================== */

router.post("/create", adminmiddleware, catchAsync(AdminTeacherController.Create));
router.get("/read", adminmiddleware, catchAsync(AdminTeacherController.Read));
router.get("/:id",adminmiddleware,  catchAsync(AdminTeacherController.ReadById));
router.put("/update/:id",adminmiddleware,  catchAsync(AdminTeacherController.Update));
router.delete("/delete/:id",adminmiddleware,  catchAsync(AdminTeacherController.Delete));
export default router;