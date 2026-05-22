import { Router } from "express";
import { TeacherController } from "../controller/teacher.auth.controller";
import { authMiddleware } from "../middleware/teacher.auth.middleware";
import { catchAsync } from "../../../../core/errors/catchAsync";
const router = Router();
const controller = new TeacherController();

// Admin Only CRUD
router.post(
  "/create",
  authMiddleware(["admin"]),
  catchAsync(controller.create),
);
router.get("/read", authMiddleware(["admin"]), catchAsync(controller.getAll));
router.get(
  "/read/:id",
  authMiddleware(["admin"]),
  catchAsync(controller.getById),
);
router.put(
  "/update/:id",
  authMiddleware(["admin"]),
  catchAsync(controller.update),
);
router.delete(
  "/delete/:id",
  authMiddleware(["admin"]),
  catchAsync(controller.delete),
);

// Public Login
router.post("/login", controller.login);

// Logout (Teacher + Admin)
router.post(
  "/logout",
  authMiddleware(["admin", "teacher"]),
  catchAsync(controller.logout),
);

router.get(
  "/profile",
  authMiddleware(["teacher"]),
  catchAsync(controller.profile),
);

export default router;
