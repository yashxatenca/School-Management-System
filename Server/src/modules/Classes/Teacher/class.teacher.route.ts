import { Router } from 'express';
import { TeacherClassController } from './class.teacher.controller';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
const router = Router();
router.use(GlobalAuthMiddleware(['teacher']));



router.get('/', TeacherClassController.getAllClasses);

router.get('/:id', TeacherClassController.getClassById);



export default router;