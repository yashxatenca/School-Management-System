import { AdminAuthService as AdminController } from "../controller/admin.auth.controller";
import { catchAsync } from "../../../../core/errors/catchAsync";
import { authenticationmiddleware } from "../middleware/admin.auth.middleware";

import express, { Router } from "express";
const router = express.Router();

router.get("/login", (req, res) => {
  res.json({
    message: "admin api is working in controller",
  });
});
router.post("/login",, (req,res,next)=>{
    
    console.log("post route login ht")
}, catchAsync(AdminController.createAndLoginUser));
router.get("/adminuser", authenticationmiddleware, AdminController.GetUser);
router.post(
  "/adminlogout",
  authenticationmiddleware,
  AdminController.LogoutUser,
);
export default router;
