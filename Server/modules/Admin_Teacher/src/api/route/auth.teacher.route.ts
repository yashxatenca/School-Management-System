import { AdminTeacherController } from "../controller/admin.teacher.controller";
import { catchAsync } from "../../core/errors/catchAsync";
import {authenticationmiddleware } from '../middlewares/authmid'

import express, { Router } from 'express'
import Authteachercontroller from "../controller/auth.teacher.controller";
const router = express.Router();
router.post("/login", catchAsync(Authteachercontroller.login))
router.get('/user', authenticationmiddleware, catchAsync(Authteachercontroller.GetUser));
router.post('/logout', authenticationmiddleware, catchAsync(Authteachercontroller.logout))
export default router;