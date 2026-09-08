import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { TeacherClassService } from './class.teacher.service'; // Adjust path if necessary

export class TeacherClassController {
  
    static async getClassById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id as string;
            const classId = new Types.ObjectId(id);
            const classData = await TeacherClassService.findClassById(classId);

            if (!classData) {
                return res.status(404).json({ success: false, message: 'Class not found' });
            }

            res.status(200).json({
                success: true,
                data: classData
            });
        } catch (error) {
            next(error);
        }
    }

   
    static async getAllClasses(req: Request, res: Response, next: NextFunction) {
        try {

            const classes = await TeacherClassService.getAllClasses(req.user?.principalId as string);

            res.status(200).json({
                success: true,
                data: classes
            });
        } catch (error) {
            next(error);
        }
    }
}