import { ObjectId } from "mongoose";
import { StudentAuth } from "../../auth/Student/models/student.auth.model";
import { ClassModel } from "../../Classes/global.class.model";
import { ApiError } from "../../../core/errors/ApiErrors";

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

    static async getClassAndTotalStudentByTeacherId(Id: string) {
        const classes = await ClassModel.findOne({ teacherId: Id });
        if (!classes) {
            throw new ApiError(402, "Classes Not found")
        }
        const studentCount = await StudentAuth.countDocuments({ classId: classes._id });

        return { classes, studentCount }
    }
}