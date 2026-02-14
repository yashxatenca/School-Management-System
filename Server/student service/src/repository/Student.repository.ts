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
    console.log(studentId)
    return await StudentModel.findById(studentId);

  }


  async updateByStudentId(
    studentId: string,
    data: UpdateStudentDTO
  ): Promise<StudentDocument | null> {
    return await StudentModel.findOneAndUpdate(
      { _id:studentId },
      data,
      { new: true }
    );
  }

  async deleteByStudentId(studentId: string): Promise<boolean> {
    const result = await StudentModel.findOneAndDelete({_id: studentId });
    return !!result;
  }
}
