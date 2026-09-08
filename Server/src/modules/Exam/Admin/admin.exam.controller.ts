import { Request, Response, NextFunction } from "express";
import { ExamService } from "./admin.exam.services";

import { ApiError } from "../../../core/errors/ApiErrors";

export class ExamController {
    static async createExamController(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new ApiError(400, "All details are required");
            }
            const result = await ExamService.createExamService({ ...req.body, principal: req.user?.id });
            res.status(201).json({
                message: "Exam created Successfull",
                success: true
            }); 
        } catch (err) {
            next(err); 
        }
    }

    static async getAllExamController(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await ExamService.getAllExamService(req.user?.id as string);
            res.status(200).json({
                message: "Exam fetched Successfull",
                success: true,
                data: result
            });
        } catch (err) {
            next(err);
        }
    }

    static async getExamByIdController(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await ExamService.getExamByIdService(req.params.id as string);
            res.status(200).json({
                message: "Exam fetched Successfull",
                success: true,
                data: result
            });
        } catch (err) {
            next(err);
        }
    }

    static async updateExamController(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await ExamService.updateExamService(req.params.id as string, { ...req.body, principal: req.user?.id });
            res.status(200).json({
                message: "Exam updated Successfull",
                success: true,
                data: result
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteExamController(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await ExamService.deleteExamService(req.params.id as string);
            res.status(200).json({
                message: "Exam deleted successfully",
                success: true,
                data: result
            });
        } catch (err) {
            next(err);
        }
    }
}