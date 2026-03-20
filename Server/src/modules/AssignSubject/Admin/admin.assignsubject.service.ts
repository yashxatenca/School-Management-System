import { Types } from 'mongoose';
import { AdminAssignSubjectRepository } from './admin.assignsubject.repository';
import { SubjectAssignment } from '../assignsubject.interface';

export class AdminAssignSubjectService {
    private repository: AdminAssignSubjectRepository;

    constructor() {
        this.repository = new AdminAssignSubjectRepository();
    }

    public async createAssignment(data: SubjectAssignment) {
        // STRICT CHECK: Does this teacher already teach this subject this year?
        const existing = await this.repository.findExactAssignment(data.teacherId, data.subjectId, data.academicYear);

        if (existing) {
            throw new Error('This subject is already assigned to this teacher for the current academic year.');
        }

        return await this.repository.create(data);
    }

    public async getAllAssignments() {
        return await this.repository.findAllActive();
    }

    public async deleteAssignment(id: string) {
        if (!Types.ObjectId.isValid(id)) throw new Error('Invalid Assignment ID format.');
        const deleted = await this.repository.delete(id);
        if (!deleted) throw new Error('Assignment not found or already deleted.');
        return deleted;
    }
}