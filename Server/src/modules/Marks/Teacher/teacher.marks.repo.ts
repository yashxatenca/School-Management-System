import MarkModel from "../marks.model";
import { IMark } from "../marks.interface";
export class TeacherMarksRepo {
  static async createMarks(data: IMark) {
    return await MarkModel.create(data);
  }
  static async readMark() {}
  static async updateMark() {}
  static async deleteMark() {}
}
