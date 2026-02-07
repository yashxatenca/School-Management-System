import { Request, Response } from "express";
import { StudentService } from "../services/student.service";

export class StudentController {
  private static service = new StudentService();

  static async create(req: Request, res: Response) {
    try {
      const student = await StudentController.service.addStudent(req.body);

      res.status(201).json({
        message: "Student created successfully",
        studentId: student.studentId,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getAll(_: Request, res: Response) {
    try {
      const students = await StudentController.service.getAllStudents();
      res.json(students);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getByStudentId(req: Request, res: Response) {
    try {
      const student =
        await StudentController.service.getStudentByStudentId(
          req.params.studentId
        );

      res.json(student);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const student =
        await StudentController.service.updateStudent(
          req.params.studentId,
          req.body
        );

      res.json({
        message: "Student updated successfully",
        student,
      });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await StudentController.service.deleteStudent(
        req.params.studentId
      );

      res.json({ message: "Student deleted successfully" });
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}
