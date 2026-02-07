import express from 'express'
const router = express.Router();
import {StudentController} from '../controller/student.controller';
import { catchAsync } from '../../core/errors/CatchAsync';

router.post("/create", catchAsync(StudentController.create));
router.get("/read", catchAsync(StudentController.getAll));
router.get('/read/:student_id', catchAsync(StudentController.getByStudentId));
router.put("/update",catchAsync(StudentController.update) )
router.delete("/delete:student_id", catchAsync(StudentController.delete))



export default router;

