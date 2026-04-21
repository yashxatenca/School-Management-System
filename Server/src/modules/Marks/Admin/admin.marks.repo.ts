import Mark from '../marks.model'; // Adjust path as needed
import { IMark } from '../marks.interface'; // Adjust path as needed

export class MarkRepository {
    async createMark(data: Partial<IMark>): Promise<IMark> {
        return await Mark.create(data);
    }

    async findMarkById(id: string): Promise<IMark | null> {
        return await Mark.findById(id)
            .populate('examId studentId teacherId classId')
            .exec();
    }

    async findAllMarks(query: any = {}): Promise<IMark[]> {
        return await Mark.find(query)
            .populate('examId studentId classId')
            .sort({ createdAt: -1 })
            .exec();
    }

    async updateMark(id: string, data: Partial<IMark>): Promise<IMark | null> {
        return await Mark.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
    }

    async deleteMark(id: string): Promise<IMark | null> {
        return await Mark.findByIdAndDelete(id).exec();
    }

    // Specialized query for Admin: check if a record already exists
    async checkDuplicate(examId: string, studentId: string): Promise<boolean> {
        const existing = await Mark.findOne({ examId, studentId }).exec();
        return !!existing;
    }
}