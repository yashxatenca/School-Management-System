import { Router } from 'express';
import { ClassAssignTeacherController } from './class-assign.teacher.controller';

const router = Router();

// Matches standard RESTful patterns
router.post('/assign', ClassAssignTeacherController.create);
router.get('/assign', ClassAssignTeacherController.read);
router.put('/assign/:id', ClassAssignTeacherController.update);
router.delete('/assign/:id', ClassAssignTeacherController.delete);

export default router;