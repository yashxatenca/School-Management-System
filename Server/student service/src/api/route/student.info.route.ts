// src/routes/student.routes.ts
import express from 'express';
const router = express.Router();
import { StudentController } from '../controller/student.controller';
import { catchAsync } from '../../core/errors/CatchAsync';
import { authteachermiddleware } from '../middleware/auth.teacher.mid';

router.post("/create",authteachermiddleware, catchAsync(StudentController.create));
router.get("/read", authteachermiddleware,  catchAsync(StudentController.getAll));
router.get('/read/:student_id',authteachermiddleware,  catchAsync(StudentController.getByStudentId));
router.put("/update",authteachermiddleware,  catchAsync(StudentController.update));
// FIX: Added '/' before ':student_id'
router.delete("/delete/:id", authteachermiddleware,  catchAsync(StudentController.delete)); 

export default router;
