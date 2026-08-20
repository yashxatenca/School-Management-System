import { TeacherAttendanceRepository } from "./teacher.attendance.repo";
import { BulkAttendanceDTO } from "../attendance.interface";

export class TeacherAttendanceService {
  private repo: TeacherAttendanceRepository;

  constructor() {
    this.repo = new TeacherAttendanceRepository();
  }

  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async markOrUpdateAttendance(data: BulkAttendanceDTO, teacherId: string) {
    if (!data.records || data.records.length === 0) {
      throw new Error("At least one student record is required.");
    }

    const normalizedDate = this.normalizeDate(data.date);
    await this.repo.bulkUpsert(
      data.classId,
      normalizedDate,
      data.records,
      teacherId,
    );

    return { message: "Attendance processed successfully" };
  }

  async getClassAttendanceByDate(classId: string, dateStr: string) {
    const normalizedDate = this.normalizeDate(dateStr);
    return this.repo.findByClassAndDate(classId, normalizedDate);
  }

  async deleteAttendance(attendanceId: string) {
    const deleted = await this.repo.deleteById(attendanceId);
    if (!deleted) throw new Error("Record not found");
    return { message: "Attendance record deleted" };
  }
}
