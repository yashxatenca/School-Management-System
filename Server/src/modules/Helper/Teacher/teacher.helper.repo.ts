import { ObjectId } from "mongoose";
import { StudentAuth } from "../../auth/Student/models/student.auth.model";
import { ClassModel } from "../../Classes/global.class.model";

export class TeacherHelperRepo {
    static async getClassIdwithTeacherId(teacherId: string) {
        try {
            if (!teacherId) {
                throw new Error("Teacher ID is required");
            }
            const classes = await ClassModel.findOne({ teacherId: teacherId });
            return classes;
        } catch (error) {
            throw error;
        }
    }

    static async getStudentByClassId(classId: string) {
        try {
            if (!classId) {
                throw new Error("Class ID is required");
            }
            const students = await StudentAuth.find({ classId: classId });
            return students;
        } catch (error) {
            throw error;
        }
    }
}