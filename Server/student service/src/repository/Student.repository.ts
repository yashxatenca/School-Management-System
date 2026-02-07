import StudentModel from "../models/info.student.model";
import { StudentDocument } from "../core/interface/Database.interface";
import { CreateStudentDTO, UpdateStudentDTO } from "../core/interface/Student.Dto.interface";

export class StudentRepository {
  async create(data: CreateStudentDTO): Promise<StudentDocument> {
    return StudentModel.create(data);
  }

  async findAll(): Promise<StudentDocument[]> {
    return StudentModel.find().lean();
  }

  async findByStudentId(studentId: string): Promise<StudentDocument | null> {
    return StudentModel.findOne({ studentId }).lean();
  }

  async updateByStudentId(
    studentId: string,
    data: UpdateStudentDTO
  ): Promise<StudentDocument | null> {
    return StudentModel.findOneAndUpdate(
      { studentId },
      data,
      { new: true }
    );
  }

  async deleteByStudentId(studentId: string): Promise<boolean> {
    const result = await StudentModel.findOneAndDelete({ studentId });
    return !!result;
  }
}
