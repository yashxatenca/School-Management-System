import { Request, Response } from "express";
import { StudentService } from "../service/student.auth.service";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

export class StudentController {
  // ==============================
  // ✅ REGISTER
  // ==============================
  static async register(req: Request, res: Response) {
    try {
      const result = await StudentService.registerStudent({
        ...req.body,
        teacherId: (req as any).user.id,
        principalId: (req as any).user.principalId,
      });

      return res.status(201).json({
        success: true,
        message: "Student registered successfully",
        data: result.student,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Registration failed",
      });
    }
  }

  // ==============================
  // ✅ LOGIN (studentId + password)
  // ==============================
  static async login(req: Request, res: Response) {
    try {
      const { studentId, password } = req.body;

      if (!studentId || !password) {
        return res.status(400).json({
          success: false,
          message: "studentId and password are required",
        });
      }

      const result = await StudentService.login(studentId, password);

      res.cookie("token", result.token, COOKIE_OPTIONS);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result.student,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "Invalid credentials",
      });
    }
  }

  // ==============================
  // ✅ LOGOUT
  // ==============================
  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("token");

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: "Logout failed",
      });
    }
  }

  // ==============================
  // ✅ GET PROFILE (Protected)
  // ==============================
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const student = await StudentService.getProfile(userId);

      return res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Student not found",
      });
    }
  }

  // ==============================
  // ✅ UPDATE STUDENT (by _id)
  // ==============================
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const updated = await StudentService.updateStudent(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Student updated successfully",
        data: updated,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Update failed",
      });
    }
  }

  // ==============================
  // ✅ DELETE STUDENT (by _id)
  // ==============================
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const result = await StudentService.deleteStudent(id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || "Delete failed",
      });
    }
  }

  // ==============================
  // ✅ GET STUDENTS BY TEACHER
  // ==============================
  static async getByTeacher(req: Request, res: Response) {
    try {
      const teacherId = req.user?.id;

      if (!teacherId) {
        return res.status(400).json({
          success: false,
          message: "Teacher ID is required",
        });
      }

      const students = await StudentService.getStudentsByTeacher(teacherId);

      return res.status(200).json({
        success: true,
        data: students,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch students",
      });
    }
  }

  // get by student _id

  static getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const student = await StudentService.getStudentById(id);
      return res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };
  static getUser = async (req: Request, res: Response) => {
    try {
      const id = req.user?.id;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      const student = await StudentService.getStudentById(id);
      return res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };
}
