import { AdminController } from "../controller/admin.auth.controller";
import { catchAsync } from "../../../../core/errors/catchAsync";
import {authenticationmiddleware } from '../middleware/admin.auth.middleware'

import express, { Router } from 'express'
const router = express.Router();

router.get("/login", (req,res)=>{
res.json({
    message:"admin api is working in controller"
})
});
router.post("/login", catchAsync(AdminController.adminlogin));
router.get("/adminuser", authenticationmiddleware, AdminController.AdminUser)
router.post("/adminlogout" , authenticationmiddleware, AdminController.LogoutUser);
export default router;