import { Router } from 'express';
import { TeacherClassController } from './class.teacher.controller';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
const router = Router();
router.use(GlobalAuthMiddleware(['teacher']));
// Create a new class
//router.post('/', GlobalAuthMiddleware(['admin']), AdminClassController.createClass);

// Get all classes
router.get('/', TeacherClassController.getAllClasses);

// Get a single class by its ID
router.get('/:id', TeacherClassController.getClassById);

// // Update a class by its ID (using PATCH for partial updates)
// router.patch('/:id', GlobalAuthMiddleware(['admin']), AdminClassController.updateClass);

// // Delete a class by its ID
// router.delete('/:id', GlobalAuthMiddleware(['admin']), AdminClassController.deleteClass);

export default router;