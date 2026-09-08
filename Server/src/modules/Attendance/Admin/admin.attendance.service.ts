import { AdminAttendanceRepository } from "./admin.attendance.repo";

export class AdminAttendanceService {
  // Optimization: Constructor injection makes the service easily testable
  constructor(private readonly repo = new AdminAttendanceRepository()) {}

  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  async getAttendanceByStudent(studentId: string, dateStr?: string) {
    const date = dateStr ? this.normalizeDate(dateStr) : undefined;
    return this.repo.findByStudentId(studentId, date);
  }

  async getAttendanceByClass(classId: string, dateStr: string) {
    const date = this.normalizeDate(dateStr);
    const records = await this.repo.findByClassAndDate(classId, date);
    console.log(records);
    return records?.map((record: any) => ({
      _id: record._id,
      date: record.date,
      status: record.status,
      remarks: record.remarks,

      // Optimization: Extracted single student object safely using optional chaining
      student: record.students?.[0]
        ? {
            _id: record.students[0]._id,
            name: record.students[0].name,
            studentId: record.students[0].studentId,
          }
        : null,

      markedBy: record.markedBy
        ? {
            _id: record.markedBy._id,
            name: record.markedBy.name,
          }
        : null,
    })); 
  }

  async getDateCards(classId: string, year: number, month: number) {
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const summaries = await this.repo.getMarkedDatesCards(
      classId,
      startDate,
      endDate,
    );

    return summaries.map((item: any) => ({
      date: item._id,
      isMarked: true,
      totalMarked: item.totalMarked,
      presentCount: item.presentCount,
      absentCount: item.absentCount,
      lateCount: item.lateCount,
      excusedCount: item.excusedCount || 0,
    }));
  }
}
