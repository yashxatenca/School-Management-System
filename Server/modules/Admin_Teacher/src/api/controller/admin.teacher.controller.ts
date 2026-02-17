  import { Request, Response } from "express";
  import { AdminTeacherService } from "../services/teacher.info.service";

  export class AdminTeacherController {

  /* ---------------- CREATE ---------------- */
  static async Create(req: Request, res: Response) {

    const teacher = await AdminTeacherService.CreateTeacher(req.body.data, req.user.id);

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher,
    });
  }

  /* ---------------- READ ALL ---------------- */
  static async Read(req: Request, res: Response) {
    const teachers = await AdminTeacherService.ReadAllTeacher();

    res.status(200).json({
      success: true,
      teachers,
    });
  }

  /* ---------------- READ ONE (_id) ---------------- */
  static async ReadById(req: Request, res: Response) {
    const teacher = await AdminTeacherService.GetById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      teacher,
    });
  }

  /* ---------------- UPDATE (_id) ---------------- */
  static async Update(req: Request, res: Response) {
    const { data } = req.body;

    const teacher = await AdminTeacherService.UpdateTeacher(
      req.params.id,
      data
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      teacher,
    });
  }

  /* ---------------- DELETE (_id) ---------------- */
  static async Delete(req: Request, res: Response) {
    const teacher = await AdminTeacherService.DeleteTeacher(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  }
}
