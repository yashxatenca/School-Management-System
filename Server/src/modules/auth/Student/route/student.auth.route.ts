import { Router } from "express";
import { StudentController } from "../controller/student.auth.controller";
// import { authMiddleware } from "../middleware/student.auth.middleware";
import { GlobalAuthMiddleware } from "../../../../middleware/Gloabal.auth.middleware";
const router = Router();

// ===============================
// 🔓 PUBLIC ROUTES
// ===============================

router.post("/login", StudentController.login);
router.post(
  "/logout",
  GlobalAuthMiddleware(["student"]),
  StudentController.logout,
);

// ===============================
// 🔐 PROTECTED ROUTES
// ===============================

// Get logged-in student profile
router.get(
  "/profile",
  GlobalAuthMiddleware(["student"]),
  StudentController.getProfile,
);
// create student by teacher
router.post(
  "/create",
  GlobalAuthMiddleware(["teacher"]),
  StudentController.register,
);
// Update student by Mongo _id
router.put(
  "/update/:id",
  GlobalAuthMiddleware(["teacher"]),
  StudentController.update,
);

// Delete student by Mongo _id
router.delete(
  "/delete/:id",
  GlobalAuthMiddleware(["teacher"]),
  StudentController.delete,
);

// Get all students by teacherId
router.get(
  "/read",
  GlobalAuthMiddleware(["teacher"]),
  StudentController.getByTeacher,
);

router.get(
  "/user",
  GlobalAuthMiddleware(["student"]),
  StudentController.getUser,
);

router.get(
  "/read/:id",
  GlobalAuthMiddleware(["teacher"]),
  StudentController.getById,
);

export default router;
