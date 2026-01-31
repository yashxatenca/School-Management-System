import { AdminTeacherController } from "../controller/admin.teacher.controller";
import { catchAsync } from "../../core/errors/catchAsync";
import {authenticationmiddleware } from '../middlewares/authmid'

import express, { Router } from 'express'
const router = express.Router();

router.get("/teacher", (req,res)=>{
res.json({
    message:"teacher  api is working in controller"
})
});

router.post("/create", authenticationmiddleware,  catchAsync(AdminTeacherController.Create));
router.get("/read", authenticationmiddleware, catchAsync(AdminTeacherController.Read));
router.get('/:id', authenticationmiddleware, catchAsync(AdminTeacherController.ReadById))
router.get("/readbystaffid", authenticationmiddleware, catchAsync(AdminTeacherController.ReadByStaff_Id))
router.delete("/delete/:id" , authenticationmiddleware,catchAsync(AdminTeacherController.Delete));
router.put("/update" , authenticationmiddleware,catchAsync(AdminTeacherController.Update));
export default router;