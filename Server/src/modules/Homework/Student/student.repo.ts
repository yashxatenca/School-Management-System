import { Homework } from "../homework.model";
import { IHomework } from "../homework.interface";

export class StudentHomeworkRepo {
  static async fetchassignment(classId: string) {
    return await Homework.find({
      classId: classId,
      isDeleted: false, 
    })
      .populate("subjectId")
      .sort({ createdAt: -1 }); 
  }
}
