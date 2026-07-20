import { Router } from "express";
import { StudentController } from "../controller/student.auth.controller";
// import { authMiddleware } from "../middleware/student.auth.middleware";
import { GlobalAuthMiddleware } from "../../../../middleware/Gloabal.auth.middleware";
import { ApiError } from "../../../../core/errors/ApiErrors";
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

router.get("/logout", GlobalAuthMiddleware(["student"]), (req, res) => {
  try {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    res
      .clearCookie("token")
      .status(200)
      .json({ message: "Logout Successfull", success: true });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", success: false });
  }
});

export default router;
