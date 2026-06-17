import { Request, Response } from "express";
import resultService from "./result.service";

export const getStudentResultController = async (
  req: Request,
  res: Response,
) => {
  try {
    // API Query params se variables nikal rahe hain
    const { student_Id, exam_Id, class_Id, academicYear } = req.query;

    // Validations
    if (!student_Id || !exam_Id || !class_Id || !academicYear) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: student_Id, exam_Id, class_Id, or academicYear",
      });
    }

    // Service call karo
    const resultData = await resultService.fetchStudentResult(
      student_Id as string,
      exam_Id as string,
      class_Id as string,
      academicYear as string,
    );

    return res.status(200).json({
      success: true,
      data: resultData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
