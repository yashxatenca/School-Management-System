import { StudentAuth } from "../../auth/Student/models/student.auth.model";
import { StudentAuthDocument } from "../../auth/Student/interface/student.auth.interface";
import mongoose from "mongoose";
import { after } from "node:test";

export class AdminStudentRepo {
  static async getStudentByStudentIdRepo(id: string) {
    // 1. Check if the passed 'id' is a valid MongoDB ObjectId
    const isValidObjectId = mongoose.isValidObjectId(id);

    // 2. Build the query condition dynamically
    const queryCondition = isValidObjectId
      ? { $or: [{ _id: id }, { studentId: id }] }
      : { studentId: id };

    return await StudentAuth.findOne(queryCondition)
      .select("-password")
      .populate("classId teacherId")
      .exec();
  }
  static async getStudentByClassIdRepo(id: string) {
    return await StudentAuth.find({ classId: id })
      .select("-password")
      .populate("classId")
      .populate("teacherId")
      .exec();
  }
  static async deleteStudentById(id: string) {
    return await StudentAuth.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  }

  static async updateStudentByStudentIdRepo(
    id: string,
    data: StudentAuthDocument,
  ) {
    return await StudentAuth.findOneAndUpdate(
      {
        $or: [
          {
            _id: mongoose.isValidObjectId(id)
              ? new mongoose.Types.ObjectId(id)
              : null,
          },
          { studentId: id },
        ],
      },
      data,
      { returnDocument: "after" },
    );
  }

  static async bulkUpdateWithIds(
    studentIds: string[],
    updatePayload: { classId?: string; teacherId?: string },
  ) {
    return await StudentAuth.updateMany(
      { _id: { $in: studentIds } },
      { $set: updatePayload },
    );
  }
}
