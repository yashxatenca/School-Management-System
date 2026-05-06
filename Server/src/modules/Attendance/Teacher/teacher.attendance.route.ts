import express from 'express';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
import { AttendanceTeacherController } from './teacher.attedance.controller';

const router = express.Router();

// Apply auth middleware for all routes in this file
router.use(GlobalAuthMiddleware(['teacher']));

// Student Fetching Route
router.get('/get-students', AttendanceTeacherController.GetStudents);

// Create / Update Attendance Route
router.post('/create', AttendanceTeacherController.ProcessAttendance);

// Fetch Attendance Route (Handles both single date and ranges via query params)
// Example 1: GET /class/60d21b4667d0d8992e610c85?date=2026-05-06
// Example 2: GET /class/60d21b4667d0d8992e610c85?startDate=2026-05-01&endDate=2026-05-31
router.get('/class/:classId', AttendanceTeacherController.GetAttendance);

export default router;