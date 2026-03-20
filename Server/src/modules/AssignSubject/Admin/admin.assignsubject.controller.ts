import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { AdminAssignSubjectService } from './admin.assignsubject.service';

export class AdminAssignSubjectController {
    private service: AdminAssignSubjectService;

    constructor() {
        this.service = new AdminAssignSubjectService();
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { teacherId, subjectId, academicYear } = req.body;

            if (!Types.ObjectId.isValid(teacherId) || !Types.ObjectId.isValid(subjectId)) {
                res.status(400).json({ success: false, message: 'Invalid ID format provided.' });
                return;
            }

            const assignedBy = new Types.ObjectId(req.user?.id); // From auth middleware

            const result = await this.service.createAssignment({
                teacherId: new Types.ObjectId(teacherId),
                subjectId: new Types.ObjectId(subjectId),
                assignedBy,
                academicYear,
                isActive: true
            });

            res.status(201).json({ success: true, message: 'Subject assigned successfully', data: result });
        } catch (error: any) {
            if (error.code === 11000) {
                res.status(409).json({ success: false, message: 'This specific assignment already exists.' });
                return;
            }
            res.status(400).json({ success: false, message: error.message });
        }
    };

    public getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const assignments = await this.service.getAllAssignments();
            res.status(200).json({ success: true, data: assignments });
        } catch (error: any) {
            res.status(500).json({ success: false, message: 'Failed to fetch assignments.' });
        }
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.service.deleteAssignment(req.params.id);
            res.status(200).json({ success: true, message: 'Deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
}