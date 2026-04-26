import express from 'express'
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
import { AttendanceTeacherController } from './teacher.attedance.controller';

const router = express.Router()

router.use(GlobalAuthMiddleware(['teacher']));
router.get('/get-students', AttendanceTeacherController.GetStudents);
export default router;