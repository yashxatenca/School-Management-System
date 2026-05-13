import { Homework } from '../homework.model';
import { IHomework } from '../homework.interface';
import { Types } from 'mongoose';
import { ApiError } from '../../../core/errors/ApiErrors';
export class HomeworkRepository {

    // 1. CREATE: Admin naya homework add karega
    async create(data: Partial<IHomework>, role: string) {
        try {
            if (role == "" || role === undefined) {
                throw new ApiError(500, "Please login again");
            }
            const newHomework = await Homework.create({
                title: data.title,
                description: data.description,
                classId: data.classId,
                subjectId: data.subjectId,
                assignedById: data.assignedById,
                assignedUser: "TeacherAuth",
                hasDueDate: data.hasDueDate,
                dueDate: data.dueDate,
                attachments: data.attachments,
                isDeleted: data.isDeleted,
            });
            return newHomework;
        } catch (error: any) {
            throw new Error(`Create failed: ${error.message}`);
        }
    }

    // 3. READ (Single): Ek specific homework ki detail dekhne ke liye
    async getById(id: string) {
        try {
            const homework = await Homework.findOne({ _id: id, isDeleted: false })
                .populate('classId', 'name')
                .populate('subjectId', 'name');
            return homework;
        } catch (error: any) {
            throw new Error(`Fetch single failed: ${error.message}`);
        }
    }

    // 4. UPDATE: Admin homework modify karega
    async update(id: string, updateData: Partial<IHomework>) {
        try {
            const updatedHomework = await Homework.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            return updatedHomework;
        } catch (error: any) {
            throw new Error(`Update failed: ${error.message}`);
        }
    }

    // 5. DELETE: Soft delete (UI se hide hoga + 7 din baad auto-delete hoga)
    async delete(id: string) {
        try {
            const deletedHomework = await Homework.findByIdAndUpdate(
                id,
                {
                    isDeleted: true,         // Ye UI se hide kar dega
                    deletedAt: new Date()    // Ye MongoDB ko batayega ki countdown shuru karo
                },
                { new: true }
            );
            return deletedHomework;
        } catch (error: any) {
            throw new Error(`Delete failed: ${error.message}`);
        }
    }

    async gethomeworkbyids(id: string) {
        return await Homework.find({
            $or: [{
                _id: new Types.ObjectId(id)
            }, // 1st query 
            {
                classId: new Types.ObjectId(id)
            },
            {
                subjectId: new Types.ObjectId(id)
            },
            {
                assignedById: new Types.ObjectId(id)
            },
            ]
        }).populate('subjectId', 'name code').populate('classId', 'name').populate({
            path: 'assignedById',
            select: 'name email role'
        }).exec();
    }
}

export const teacherhomeworkrepo = new HomeworkRepository();