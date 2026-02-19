
import { authteachermiddleware} from '../middleware/auth.teacher.mid'
import express from 'express';
const router = express.Router();
import { catchAsync } from '../../core/errors/CatchAsync';
import { AuthControllerStudent } from "../controller/auth.controller"




router.post('/login', catchAsync(AuthControllerStudent.Login));
router.get('/user',authteachermiddleware , catchAsync(AuthControllerStudent.StudentDetails))

export default router;
