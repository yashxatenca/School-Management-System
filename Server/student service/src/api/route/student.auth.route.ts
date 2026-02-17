// src/routes/student.routes.ts
import express from 'express';
const router = express.Router();
import { catchAsync } from '../../core/errors/CatchAsync';
import { AuthControllerStudent } from "../controller/auth.controller"
router.post('/login', (req,res,next)=>{
    console.log(req.url)
    next()
}, catchAsync(AuthControllerStudent.Login));

export default router;
