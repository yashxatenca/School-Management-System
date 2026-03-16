import { Router } from 'express';
import { AdminClassController } from './class.admin.controller';
import { GlobalAuthMiddleware } from '../../../middleware/Gloabal.auth.middleware';
const router = Router();

// Create a new class
router.post('/', GlobalAuthMiddleware(['admin']), AdminClassController.createClass);

// Get all classes
router.get('/', GlobalAuthMiddleware(['admin']), AdminClassController.getAllClasses);

// Get a single class by its ID
router.get('/:id', GlobalAuthMiddleware(['admin']), AdminClassController.getClassById);

// Update a class by its ID (using PATCH for partial updates)
router.patch('/:id', GlobalAuthMiddleware(['admin']), AdminClassController.updateClass);

// Delete a class by its ID
router.delete('/:id', GlobalAuthMiddleware(['admin']), AdminClassController.deleteClass);

export default router;