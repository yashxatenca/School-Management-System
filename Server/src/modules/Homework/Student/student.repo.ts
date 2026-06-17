import { Homework } from "../homework.model";
import { IHomework } from "../homework.interface";

export class StudentHomeworkRepo {
  static async fetchassignment(classId: string) {
    return await Homework.find({
      classId: classId,
      isDeleted: false, // Sirf active assignments fetch honge
    })
      .populate("subjectId") // Subject ki details (name, etc.) populate karega
      .sort({ createdAt: -1 }); // Naye assignments sabse upar aayenge
  }
}
