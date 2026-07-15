import { Request, Response } from "express";
import { MarkService } from "./teacher.result.service";

export class MarkController {
  private markService: MarkService;

  constructor() {
    this.markService = new MarkService();
  }

  public getStudentResult = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { examId, studentId } = req.params;

      if (!examId || !studentId) {
        res.status(400).json({
          success: false,
          message: "Exam ID and Student ID are required",
        });
        return;
      }

      const resultData = await this.markService.generateReportCard(
        examId as string,
        studentId as string,
      );

      res.status(200).json({
        success: true,
        data: resultData,
      });
    } catch (error: any) {
      if (error.message === "RESULT_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Result not found for this student.",
        });
        return;
      }
      console.error("Error fetching result:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}
