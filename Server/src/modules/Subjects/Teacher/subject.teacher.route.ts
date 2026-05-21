import express from 'express';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
import { TeacherSubjectController } from './subject.teacher.controller';
const router = express.Router();
router.use(GlobalAuthMiddleware(['teacher']))
router.get('/', TeacherSubjectController.getAllSubject)
export default router;