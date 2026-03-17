import { SubjectService } from "./subject.admin.service";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { ISubject } from "../global.interface";

export class SubjectController {
    static async createSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = req.body as ISubject;
            const subject = await SubjectService.createSubject(payload, req.user?.id);
            if (subject) {
                return res.status(201).json({
                    success: true,
                    message: "Subject created successfully",
                    data: subject
                });

            }

        } catch (error) {
            console.log(error)
            next(error);
        }
    }

    static async findSubjectById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const subjectId = new Types.ObjectId(id);
            const subject = await SubjectService.findSubjectById(subjectId);
            if (!subject) {
                return res.status(404).json({
                    success: false,
                    message: "Subject not found"
                });
            }
            res.status(200).json({
                success: true,
                message: "Subject found successfully",
                data: subject
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateSubject(req: Request, res: Response, next: NextFunction) {
        try {

            const id = req.params.id as string;
            const subjectId = new Types.ObjectId(id);
            const payload = req.body as Partial<ISubject>;

            const subject = await SubjectService.updateSubject(subjectId, payload);
            if (!subject) {
                return res.status(404).json({
                    success: false,
                    message: "Subject not found"
                });
            }
            res.status(200).json({
                success: true,
                message: "Subject updated successfully",
                data: subject
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteSubject(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const subjectId = new Types.ObjectId(id);
            const subject = await SubjectService.deleteSubject(subjectId);
            if (!subject) {
                return res.status(404).json({
                    success: false,
                    message: "Subject not found"
                });
            }
            res.status(200).json({
                success: true,
                message: "Subject deleted successfully",
                data: subject
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllSubjects(req: Request, res: Response, next: NextFunction) {
        try {
            const subjects = await SubjectService.getAllSubjects();
            res.status(200).json({
                success: true,
                message: "Subjects fetched successfully",
                data: subjects
            });
        } catch (error) {
            next(error);
        }
    }
}