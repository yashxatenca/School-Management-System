import { StudentRepository } from "../../repository/Student.repository";
import { CreateStudentDTO, UpdateStudentDTO } from "../../core/interface/Student.Dto.interface";

export class StudentService {
  private repo: StudentRepository;

  constructor() {
    this.repo = new StudentRepository();
  }

  async addStudent(data: CreateStudentDTO) {
    return this.repo.create(data);
  }

  async getAllStudents() {
    return this.repo.findAll();
  }

  async getStudentByStudentId(studentId: string) {
    const student = await this.repo.findByStudentId(studentId);
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  }

  async updateStudent(studentId: string, data: UpdateStudentDTO) {
    const updated = await this.repo.updateByStudentId(studentId, data);
    if (!updated) {
      throw new Error("Student not found");
    }
    return updated;
  }

  async deleteStudent(studentId: string) {
    const deleted = await this.repo.deleteByStudentId(studentId);
    if (!deleted) {
      throw new Error("Student not found");
    }
    return true;
  }
}
