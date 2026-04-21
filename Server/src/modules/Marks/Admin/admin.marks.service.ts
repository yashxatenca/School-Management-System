import { MarkRepository } from './admin.marks.repo';
import { IMark } from '../marks.interface';

export class MarkService {
    private markRepository: MarkRepository;

    constructor() {
        this.markRepository = new MarkRepository();
    }

    async createMark(data: Partial<IMark>): Promise<IMark> {
        // Admin logic: Validate duplicate entries before creation
        if (data.examId && data.studentId) {
            const isDuplicate = await this.markRepository.checkDuplicate(
                data.examId.toString(),
                data.studentId.toString()
            );
            if (isDuplicate) {
                throw new Error('A mark record for this student and exam already exists.');
            }
        }

        return await this.markRepository.createMark(data);
    }

    async getMarkById(id: string): Promise<IMark> {
        const mark = await this.markRepository.findMarkById(id);
        if (!mark) throw new Error('Mark record not found');
        return mark;
    }

    async getAllMarks(filters: any): Promise<IMark[]> {
        // Admin logic: Add custom filters here if needed (e.g., filter by classId or examId)
        return await this.markRepository.findAllMarks(filters);
    }

    async updateMark(id: string, data: Partial<IMark>): Promise<IMark> {
        const updatedMark = await this.markRepository.updateMark(id, data);
        if (!updatedMark) throw new Error('Mark record not found for update');
        return updatedMark;
    }

    async deleteMark(id: string): Promise<IMark> {
        const deletedMark = await this.markRepository.deleteMark(id);
        if (!deletedMark) throw new Error('Mark record not found for deletion');
        return deletedMark;
    }
}