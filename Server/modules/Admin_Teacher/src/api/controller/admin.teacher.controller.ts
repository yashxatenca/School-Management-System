import { Request, Response } from "express";
import { AdminTeacherService } from "../services/teacher.info.service";

export class AdminTeacherController {

  static async Create(req: Request, res: Response) {
  console.log("REQ.USER 👉", req.user);
  console.log("REQ.BODY 👉", req.body);

  const teacher = await AdminTeacherService.CreateTeacher(
    req.body.data,
    req.user!.id
  );

  res.status(201).json({
    success: true,
    message: "Teacher created successfully",
    teacher,
  });
}

  static async Read(req: Request, res: Response) {
    const teachers = await AdminTeacherService.ReadAllTeacher(
      req.user!.id
    );
    console.log(teachers)

    res.status(200).json({
      success: true,
      teachers,
    });
  }

  static async ReadByStaffId(req: Request, res: Response) {
    const { staff_id } = req.params;

    const teacher = await AdminTeacherService.ReadByStaffId(staff_id);

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

  static async Update(req: Request, res: Response) {
    const { staff_id } = req.params;

    const teacher = await AdminTeacherService.UpdateTeacher(
      staff_id,
      req.body
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

  static async Delete(req: Request, res: Response) {
    const { id } = req.params;

    const teacher = await AdminTeacherService.DeleteTeacher(id);

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
