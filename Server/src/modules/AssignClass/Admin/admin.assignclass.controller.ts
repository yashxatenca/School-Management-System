import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { AdminAssignClassService } from './admin.assignclass.service';

export class AdminAssignClassController {
    private service: AdminAssignClassService;

    constructor() {
        this.service = new AdminAssignClassService();
    }

    // CREATE
    public create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { classId, teacherId, academicYear } = req.body;

            if (!Types.ObjectId.isValid(classId) || !Types.ObjectId.isValid(teacherId)) {
                res.status(400).json({ success: false, message: 'Invalid ID format provided.' });
                return;
            }

            // Assume req.user is populated by your auth middleware
            const assignedBy = new Types.ObjectId(req.user?.id);

            const result = await this.service.createAssignment({
                classId: new Types.ObjectId(classId),
                teacherId: new Types.ObjectId(teacherId),
                assignedBy,
                academicYear,
                isActive: true
            });

            res.status(201).json({ success: true, message: 'Class assigned successfully', data: result });
        } catch (error: any) {
            if (error.code === 11000) {
                res.status(409).json({ success: false, message: 'This specific assignment already exists.' });
                return;
            }
            res.status(400).json({ success: false, message: error.message });
        }
    };

    // READ ALL
    public getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const assignments = await this.service.getAllAssignments();
            res.status(200).json({ success: true, data: assignments });
        } catch (error: any) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Failed to fetch assignments.' });
        }
    };

    // READ ONE
    public getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const assignment = await this.service.getAssignmentById(req.params.id);
            res.status(200).json({ success: true, data: assignment });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message });
        }
    };

    // UPDATE
    public update = async (req: Request, res: Response): Promise<void> => {
        try {
            // Prevent updating the assignedBy field for security
            const { assignedBy, ...safeUpdateData } = req.body;

            const updated = await this.service.updateAssignment(req.params.id, safeUpdateData);
            res.status(200).json({ success: true, message: 'Updated successfully', data: updated });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    // DELETE
    public delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.service.deleteAssignment(req.params.id);
            res.status(200).json({ success: true, message: 'Deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
}