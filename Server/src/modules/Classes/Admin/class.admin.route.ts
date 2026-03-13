import { Router } from 'express';
import { AdminClassController } from './class.admin.controller';

const router = Router();

// Create a new class
router.post('/', AdminClassController.createClass);

// Get all classes
router.get('/', AdminClassController.getAllClasses);

// Get a single class by its ID
router.get('/:id', AdminClassController.getClassById);

// Update a class by its ID (using PATCH for partial updates)
router.patch('/:id', AdminClassController.updateClass);

// Delete a class by its ID
router.delete('/:id', AdminClassController.deleteClass);

export default router;