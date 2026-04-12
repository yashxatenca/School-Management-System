import { Router } from "express";
import { AttendanceController } from "./admin.attendance.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();

router.get(
    "/student/:studentId",
    GlobalAuthMiddleware(["admin"]),
    AttendanceController.getStudentAttendance
);

// Get attendance of a whole class
// Example: GET /api/attendance/class/6543abc123?date=2023-10-25
router.get(
    "/class/:classId",
    GlobalAuthMiddleware(["admin"]),
    // verifyAdmin, 
    AttendanceController.getClassAttendance
);


// ==========================================
// POST/PUT ROUTES (Modifying Data)
// ==========================================

// Admin: Mark or Update single student
// Body: { classId, date, studentId, status, remarks }
router.post(
    "/mark-single",
    GlobalAuthMiddleware(["admin"]),
    // verifyAdmin, 
    AttendanceController.updateSingleStudent
);

// Admin: Mark or Update full class
// Body: { classId, date, attendanceArray, shouldLock }
router.post(
    "/bulk",
    GlobalAuthMiddleware(["admin"]),
    // verifyAdmin, 
    AttendanceController.updateClassAttendance
);

export default router;