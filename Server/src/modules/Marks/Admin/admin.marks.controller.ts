import { Request, Response } from 'express';
import { MarkService } from './admin.marks.service';

export class MarkController {
    private markService: MarkService;

    constructor() {
        this.markService = new MarkService();
    }

    createMark = async (req: Request, res: Response): Promise<void> => {
        try {
            const mark = await this.markService.createMark(req.body);
            res.status(201).json({ success: true, data: mark });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    getMarkById = async (req: Request, res: Response): Promise<void> => {
        try {
            const mark = await this.markService.getMarkById(req.params.id as string);
            res.status(200).json({ success: true, data: mark });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message });
        }
    };

    getAllMarks = async (req: Request, res: Response): Promise<void> => {
        try {
            // Pass query params for admin filtering (e.g., ?classId=123)
            const marks = await this.markService.getAllMarks(req.query);
            res.status(200).json({ success: true, count: marks.length, data: marks });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    updateMark = async (req: Request, res: Response): Promise<void> => {
        try {
            const mark = await this.markService.updateMark(req.params.id as string, req.body);
            res.status(200).json({ success: true, data: mark });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    deleteMark = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.markService.deleteMark(req.params.id as string);
            res.status(200).json({ success: true, message: 'Mark record deleted successfully' });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message });
        }
    };
}