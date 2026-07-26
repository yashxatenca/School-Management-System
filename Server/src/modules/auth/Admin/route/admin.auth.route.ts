import express from "express";
import { AdminAuthController } from "../controller/admin.auth.controller";
import { catchAsync } from "../../../../core/errors/catchAsync";
import { authenticationmiddleware } from "../middleware/admin.auth.middleware";
import { GlobalAuthMiddleware } from "../../../../middleware/Gloabal.auth.middleware";

const router = express.Router();

router.get("/login", (req, res) => {
  res.json({
    message: "admin api is working in controller",
  });
});

router.post("/login", catchAsync(AdminAuthController.createAndLoginUser));

router.get(
  "/adminuser",
  GlobalAuthMiddleware(["admin"]),
  catchAsync(AdminAuthController.GetUser),
);

router.post(
  "/adminlogout",
  GlobalAuthMiddleware(["admin"]),
  catchAsync(AdminAuthController.LogoutUser),
);

export default router;
