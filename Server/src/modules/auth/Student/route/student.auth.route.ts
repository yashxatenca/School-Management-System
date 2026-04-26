import { Router } from "express";
import { StudentController } from "../controller/student.auth.controller";
import { authMiddleware } from "../middleware/student.auth.middleware";

const router = Router();

// ===============================
// 🔓 PUBLIC ROUTES
// ===============================

router.post("/login", (req, res, next) => {
  next()

}, StudentController.login);
router.post("/logout", authMiddleware(["student"]), StudentController.logout);

// ===============================
// 🔐 PROTECTED ROUTES
// ===============================

// Get logged-in student profile
router.get("/profile", authMiddleware(['student']), StudentController.getProfile);
// create student by teacher
router.post("/create", authMiddleware(["teacher"]), StudentController.register);
// Update student by Mongo _id
router.put("/update/:id", authMiddleware(["teacher"]), StudentController.update);

// Delete student by Mongo _id
router.delete("/delete/:id", authMiddleware(["teacher"]), StudentController.delete);

// Get all students by teacherId
router.get(
  "/read",
  authMiddleware(["teacher"]),
  StudentController.getByTeacher
);

router.get("/read/:id", authMiddleware(["teacher"]), StudentController.getById);

export default router;