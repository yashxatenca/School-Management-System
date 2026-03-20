import { Types } from 'mongoose';
import { AdminAssignClassRepository } from './admin.assignclass.repository';
import { ClassAssignment } from '../assignclass.interface';

export class AdminAssignClassService {
    private repository: AdminAssignClassRepository;

    constructor() {
        this.repository = new AdminAssignClassRepository();
    }

    public async createAssignment(data: ClassAssignment) {
        // 1. Archive any active assignments for this class from previous years
        await this.repository.archivePreviousAssignments(data.classId, data.academicYear);

        // 2. STRICT CHECK: Does this class ALREADY have an active teacher for this year?
        const existing = await this.repository.findActiveByClass(data.classId);

        // If an active assignment exists AND it matches the year they are trying to assign...
        if (existing && existing.academicYear === data.academicYear) {
            throw new Error('A teacher is already assigned to this class for this academic year. Please delete the existing assignment first.');
        }

        // 3. Create
        return await this.repository.create(data);
    }

    public async getAllAssignments() {
        return await this.repository.findAllActive();
    }

    public async getAssignmentById(id: string) {
        const assignment = await this.repository.findById(id);
        if (!assignment) throw new Error('Assignment not found.');
        return assignment;
    }

    public async updateAssignment(id: string, updateData: Partial<ClassAssignment>) {
        const updated = await this.repository.update(id, updateData);
        if (!updated) throw new Error('Assignment not found or could not be updated.');
        return updated;
    }

    public async deleteAssignment(id: string) {
        const deleted = await this.repository.delete(id);
        if (!deleted) throw new Error('Assignment not found or already deleted.');
        return deleted;
    }
}