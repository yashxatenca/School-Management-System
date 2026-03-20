import { Types } from 'mongoose';
import { ClassAssignmentModel } from '../assignclass.model'; // Assuming your model is here
import { ClassAssignment } from '../assignclass.interface';

export class AdminAssignClassRepository {

    // CREATE
    public async create(data: ClassAssignment) {
        const newAssignment = new ClassAssignmentModel(data);
        return await newAssignment.save();
    }

    // READ (All Active)
    public async findAllActive() {
        let user = await ClassAssignmentModel.find({ isActive: true })
            .populate('classId', 'name section')
            .populate('teacherId', 'name')
            .populate('assignedBy', 'name')
            .sort({ createdAt: -1 })
            .exec();
        return user;
    }

    // READ (Single by ID)
    public async findById(id: string) {
        return await ClassAssignmentModel.findById(id)
            .populate('classId', 'name section')
            .populate('teacherId', 'name')
            .exec();
    }

    // Helper: Find active assignment for a specific class
    public async findActiveByClass(classId: Types.ObjectId) {
        return await ClassAssignmentModel.findOne({ classId, isActive: true }).exec();
    }

    // UPDATE: Archive previous years
    public async archivePreviousAssignments(classId: Types.ObjectId, currentYear: string) {
        return await ClassAssignmentModel.updateMany(
            { classId, academicYear: { $ne: currentYear }, isActive: true },
            { $set: { isActive: false } }
        );
    }

    // UPDATE (Modify specific assignment)
    public async update(id: string, updateData: Partial<ClassAssignment>) {
        return await ClassAssignmentModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('classId', 'name section')
            .populate('teacherId', 'name');
    }

    // DELETE (Hard delete)
    public async delete(id: string) {
        return await ClassAssignmentModel.findByIdAndDelete(id);
    }
}