import { Router } from 'express';
import { TeacherHomeworkController } from './teacher.homework.controller';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
const router = Router();
router.use(GlobalAuthMiddleware(['teacher']))
router.post('/', TeacherHomeworkController.createHomework);
router.get('/class/:classId', TeacherHomeworkController.getHomeworkByClassId)
export default router;