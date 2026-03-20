import { Types } from 'mongoose';
import { SubjectAssignmentModel } from '../assignsubject.model';
import { SubjectAssignment } from '../assignsubject.interface';

export class AdminAssignSubjectRepository {
    public async create(data: SubjectAssignment) {
        const newAssignment = new SubjectAssignmentModel(data);
        return await newAssignment.save();
    }

    public async findAllActive() {
        return await SubjectAssignmentModel.find({ isActive: true })
            .populate('teacherId', 'name email')
            .populate('subjectId', 'name code')
            .populate('assignedBy', 'name')
            .sort({ createdAt: -1 })
            .exec();
    }

    // Check if THIS teacher already has THIS subject for THIS year
    public async findExactAssignment(teacherId: Types.ObjectId, subjectId: Types.ObjectId, academicYear: string) {
        return await SubjectAssignmentModel.findOne({ teacherId, subjectId, academicYear, isActive: true }).exec();
    }

    public async delete(id: string) {
        return await SubjectAssignmentModel.findByIdAndDelete(id);
    }
}