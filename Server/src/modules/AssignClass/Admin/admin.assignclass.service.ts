import { Types } from 'mongoose';
import { AdminAssignClassRepository } from './admin.assignclass.repository';
import { ClassAssignment } from '../assignclass.interface';

export class AdminAssignClassService {
    private repository: AdminAssignClassRepository;

    constructor() {
        this.repository = new AdminAssignClassRepository();
    }

    public async createAssignment(data: ClassAssignment) {
        // 1. STRICT CHECK: Does this CLASS already have an active teacher?
        const existingClassAssignment = await this.repository.findActiveByClass(data.classId);
        if (existingClassAssignment && existingClassAssignment.academicYear === data.academicYear) {
            throw new Error('A teacher is already assigned to this class for this academic year.');
        }

        // 2. STRICT CHECK: Is this TEACHER already assigned to another class?
        const existingTeacherAssignment = await this.repository.findActiveByTeacher(data.teacherId);
        if (existingTeacherAssignment && existingTeacherAssignment.academicYear === data.academicYear) {
            throw new Error('This teacher is already assigned to a different class for this academic year.');
        }

        // 3. Archive any active assignments for this class from previous years (Optional based on your flow)
        await this.repository.archivePreviousAssignments(data.classId, data.academicYear);

        // 4. Create the new assignment
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
        // Ensure the ID is a valid MongoDB ObjectId before trying to delete
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('Invalid Assignment ID format.');
        }

        const deleted = await this.repository.delete(id);
        if (!deleted) throw new Error('Assignment not found or already deleted.');
        return deleted;
    }
}